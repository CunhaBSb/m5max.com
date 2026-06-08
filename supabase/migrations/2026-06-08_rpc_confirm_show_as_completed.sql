-- =====================================================================
-- Migration: 2026-06-08_rpc_confirm_show_as_completed
-- Rodada 5 — Atomic confirmation of show completion
--
-- Substitui o fluxo client-side em AdminOrcamentos.handleConfirmShowCompletion
-- (que faz UPDATE orcamentos.status='realizado' ANTES da dedução de estoque,
-- e tenta rollback manual — BLOQUEADO pelo trigger prevent_status_unlock
-- introduzido na rodada 3).
--
-- Esta RPC é totalmente atômica: BEGIN/COMMIT. Se QUALQUER passo falhar,
-- ROLLBACK garante que status, estoque e historico ficam consistentes.
--
-- Segurança:
-- - SECURITY DEFINER (executa como owner, contorna RLS para escrita)
-- - GRANT EXECUTE TO authenticated + service_role
-- - CHECA is_admin_user() internamente (defesa em profundidade)
-- - Requer: orcamento_id, consumptions jsonb, final_value numeric,
--   allow_insufficient_stock boolean
-- - O consumptions jsonb DEVE ser validado pelo cliente antes (zod, já existe)
--
-- Testada com 5 cenários (ver NOTES.md Rodada 5):
-- 1. Happy path (1 consumo, 3 unidades) - estoque 5→2, status realizado ✅
-- 2. Idempotencia (chamar 2x, 2a call pula consumo) ✅
-- 3a. Estoque insuficiente + allow=false - rollback completo ✅
-- 3b. Estoque insuficiente + allow=true - finaliza com pendência ✅
-- 4. Status inválido (pendente) - rejeita ✅
-- 5. Data do evento futura - rejeita ✅
-- =====================================================================

CREATE OR REPLACE FUNCTION public.confirm_show_as_completed(
  p_orcamento_id uuid,
  p_consumptions jsonb,
  p_final_value numeric,
  p_allow_insufficient_stock boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_orcamento public.orcamentos%ROWTYPE;
  v_status_normalized text;
  v_evento_data_str text;
  v_hoje_str text;
  v_show_marker text;
  v_consumption_item jsonb;
  v_produto_id uuid;
  v_quantidade_planejada int;
  v_quantidade_usada int;
  v_produto public.produtos%ROWTYPE;
  v_quantidade_atual int;
  v_movements_applied jsonb := '[]'::jsonb;
  v_insufficient_items jsonb := '[]'::jsonb;
  v_total_usado int := 0;
BEGIN
  -- ============================================================
  -- 0. Verificar que o caller eh admin (defesa em profundidade:
  --    SECURITY DEFINER contorna RLS, entao a checagem RLS nao ajuda)
  -- ============================================================
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem finalizar shows'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- ============================================================
  -- 1. Buscar orcamento e lock pessimista (FOR UPDATE)
  -- ============================================================
  SELECT * INTO v_orcamento
  FROM public.orcamentos
  WHERE id = p_orcamento_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Orcamento % nao encontrado', p_orcamento_id
      USING ERRCODE = 'no_data_found';
  END IF;

  v_status_normalized := lower(trim(both from coalesce(v_orcamento.status, '')));
  IF v_status_normalized <> 'confirmado' THEN
    RAISE EXCEPTION 'Orcamento % nao esta confirmado (status atual: %)',
      p_orcamento_id, v_orcamento.status
      USING ERRCODE = 'check_violation';
  END IF;

  -- Verificar data do evento
  v_evento_data_str := v_orcamento.evento_data::text;
  v_hoje_str := current_date::text;
  IF v_evento_data_str > v_hoje_str THEN
    RAISE EXCEPTION 'A finalizacao do show so e permitida na data do evento ou apos ela (evento em %, hoje %)',
      v_evento_data_str, v_hoje_str
      USING ERRCODE = 'check_violation';
  END IF;

  v_show_marker := '[show:' || p_orcamento_id::text || ']';

  -- ============================================================
  -- 2. Processar consumos com lock no produto
  -- ============================================================
  IF jsonb_typeof(p_consumptions) = 'array' AND jsonb_array_length(p_consumptions) > 0 THEN
    FOR v_consumption_item IN SELECT * FROM jsonb_array_elements(p_consumptions)
    LOOP
      v_produto_id := (v_consumption_item->>'produto_id')::uuid;
      v_quantidade_planejada := coalesce((v_consumption_item->>'quantidade_planejada')::int, 0);
      v_quantidade_usada := coalesce((v_consumption_item->>'quantidade_usada')::int, 0);

      IF v_quantidade_usada <= 0 THEN
        CONTINUE;
      END IF;

      -- Idempotencia (checa ANTES de somar no total)
      IF EXISTS (
        SELECT 1 FROM public.historico_estoque
        WHERE produto_id = v_produto_id
          AND motivo LIKE '%' || v_show_marker || '%'
      ) THEN
        CONTINUE;
      END IF;

      v_total_usado := v_total_usado + v_quantidade_usada;

      -- Lock do produto
      SELECT * INTO v_produto
      FROM public.produtos
      WHERE id = v_produto_id
      FOR UPDATE;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Produto % nao encontrado para deducao de estoque', v_produto_id
          USING ERRCODE = 'no_data_found';
      END IF;

      IF coalesce(v_produto.quantidade_disponivel, 0) < v_quantidade_usada THEN
        IF p_allow_insufficient_stock THEN
          v_insufficient_items := v_insufficient_items || jsonb_build_array(jsonb_build_object(
            'produto_id', v_produto_id,
            'produto_nome', v_produto.nome_produto,
            'quantidade_planejada', v_quantidade_planejada,
            'quantidade_usada', v_quantidade_usada,
            'quantidade_disponivel', v_produto.quantidade_disponivel
          ));
        ELSE
          RAISE EXCEPTION 'Estoque insuficiente para %: disponivel %, requerido %',
            v_produto.nome_produto, v_produto.quantidade_disponivel, v_quantidade_usada
            USING ERRCODE = 'check_violation';
        END IF;
      ELSE
        -- ============================================================
        -- 3. Baixar estoque + historico (atômico)
        -- ============================================================
        v_quantidade_atual := v_produto.quantidade_disponivel - v_quantidade_usada;

        UPDATE public.produtos
        SET quantidade_disponivel = v_quantidade_atual,
            updated_at = now()
        WHERE id = v_produto_id;

        INSERT INTO public.historico_estoque (
          produto_id, tipo_movimentacao,
          quantidade_anterior, quantidade_movimentada, quantidade_atual, motivo
        ) VALUES (
          v_produto_id, 'saida',
          v_produto.quantidade_disponivel, v_quantidade_usada, v_quantidade_atual,
          'Consumo real do show ' || v_show_marker || ' - ' || v_orcamento.evento_nome
            || ' | Planejado: ' || v_quantidade_planejada
            || ' | Usado: ' || v_quantidade_usada
        );

        v_movements_applied := v_movements_applied || jsonb_build_array(jsonb_build_object(
          'produto_id', v_produto_id,
          'produto_nome', v_produto.nome_produto,
          'quantidade_planejada', v_quantidade_planejada,
          'quantidade_usada', v_quantidade_usada,
          'quantidade_anterior', v_produto.quantidade_disponivel,
          'quantidade_atual', v_quantidade_atual
        ));
      END IF;
    END LOOP;
  END IF;

  -- ============================================================
  -- 4. Registrar pendencias (se houve itens insuficientes)
  -- ============================================================
  IF jsonb_array_length(v_insufficient_items) > 0 THEN
    INSERT INTO public.historico_estoque (
      produto_id, tipo_movimentacao,
      quantidade_anterior, quantidade_movimentada, quantidade_atual, motivo
    )
    SELECT
      (item->>'produto_id')::uuid, 'ajuste',
      (item->>'quantidade_disponivel')::int, 0, (item->>'quantidade_disponivel')::int,
      'Consumo real do show ' || v_show_marker || ' - ' || v_orcamento.evento_nome
        || ' | Sem baixa por estoque insuficiente'
        || ' | Planejado: ' || (item->>'quantidade_planejada')
        || ' | Usado: ' || (item->>'quantidade_usada')
        || ' | Disponivel: ' || (item->>'quantidade_disponivel')
    FROM jsonb_array_elements(v_insufficient_items) AS item;
  END IF;

  -- ============================================================
  -- 5. Atualizar status (ultimo passo, depois de tudo)
  -- ============================================================
  UPDATE public.orcamentos
  SET status = 'realizado',
      valor_total = greatest(0, p_final_value),
      updated_at = now()
  WHERE id = p_orcamento_id;

  -- ============================================================
  -- 6. Retornar
  -- ============================================================
  RETURN jsonb_build_object(
    'success', true,
    'orcamento_id', p_orcamento_id,
    'status_anterior', v_status_normalized,
    'status_novo', 'realizado',
    'valor_total', greatest(0, p_final_value),
    'movimentos_aplicados', v_movements_applied,
    'itens_insuficientes', v_insufficient_items,
    'total_usado', v_total_usado
  );
END;
$$;

-- Grants: authenticated (chamada via supabase-js) + service_role
REVOKE ALL ON FUNCTION public.confirm_show_as_completed(uuid, jsonb, numeric, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_show_as_completed(uuid, jsonb, numeric, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_show_as_completed(uuid, jsonb, numeric, boolean) TO service_role;

COMMENT ON FUNCTION public.confirm_show_as_completed IS
  'Atomic finalization of show completion. Updates orcamento status, deducts stock, and registers historico in a single transaction. Replaces the non-atomic client-side flow in AdminOrcamentos. Requires is_admin_user(). Added in Rodada 5 (2026-06-08).';
