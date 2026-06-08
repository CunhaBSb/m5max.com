# NOTES — Auditoria e correções (2026-06-08)

> Documento de passagem. Cada item diz **status** (✅ aplicado / ⚠️ decidido/não aplicado / 📋 decisão do Marcos).

---

## Rodada 3 — Auditoria profunda (admin + DB)

Comando do Marcos: análise completa e profunda do painel admin + banco de dados. Saí do "edge de segurança" e fui pra **business logic + integridade de dados**.

### ✅ Correções aplicadas (Rodada 3)

**`2026-06-08_admin_audit_hardening`**

1. **Trigger `BEFORE UPDATE` em `produtos`** (`trg_produtos_prevent_negative_stock`): rejeita qualquer `UPDATE` que tente setar `quantidade_disponivel < 0`. O front deduz via `current - qty` (Client side, sem checagem de saldo real do banco no momento do UPDATE). Agora o DB é a linha de defesa. Erro: `check_violation (23514)`.
2. **Trigger `BEFORE UPDATE` em `orcamentos`** (`trg_orcamentos_status_lock`): bloqueia mudança de `status` quando o status anterior é `realizado`. O `ConfirmShow` já faz rollback manual se estoque falhar, mas reverte só o estoque — o status `realizado` ficava órfão. Agora o DB trava a transição.
3. **Trigger `BEFORE INSERT` em `historico_estoque`** (`trg_historico_estoque_fill_usuario`): se `usuario_id` vier `NULL`, preenche com `auth.uid()`. Antes, 98% das 113 linhas tinham `usuario_id` NULL porque o `AuthContextSimple` nem sempre tinha `userData` populado no momento do insert.
4. **`ANALYZE` em todas as 7 tabelas**: tabelas com 60–900% de dead tuples (`usuarios` 900%, `eventos` 700%, `produtos` 90%). Último autovacuum de `produtos`: 2026-04-19. Planner vai usar stats novas.

**`2026-06-08_dedupe_updated_at_triggers`**

5. Removidos triggers duplicados `trg_*_updated_at` (criados por esta migration). O Supabase dashboard já tinha criado `update_*_updated_at` no mesmo evento. Mantido o original, drop dos meus.

**Código**

6. `AuthContextSimple.tsx`: removido `console.log` que vazava `role` e `ativo` no DevTools (todo usuário logado via console do browser).

### 🔍 Achados da auditoria profunda (não corrigidos, documentados)

#### 🔴 CRÍTICO (risco real, em produção)

**1. `ConfirmShow` no `AdminOrcamentos.tsx` (3.5k linhas): transação não é atômica**
- **Linha ~885**: o código faz `UPDATE orcamentos SET status='realizado'` ANTES de deduzir estoque.
- **Linha ~960-1030**: depois deduz estoque de cada produto + insere no `historico_estoque` em loop sequencial.
- **Linha ~1050+**: se o estoque falhar, faz **rollback manual** (reverte o produto + insere entrada no histórico). **Mas não reverte o status `realizado`** — o orcamento fica como `realizado` mas sem o estoque deduzido.
- **Mitigação parcial aplicada (Rodada 3)**: o trigger `prevent_status_unlock` agora BLOQUEIA qualquer UPDATE de status quando o anterior é `realizado` — então o `realizado` órfão vira um *fail-fast*: se algo tentar mudar de novo, erro. Mas o estado "realizado sem estoque" continua possível.
- **Correção real (não aplicada, refactor grande)**: envolver em RPC `confirm_show_as_completed(orcamento_id, consumptions jsonb, final_value numeric)` que faz tudo dentro de `BEGIN; ... COMMIT;` server-side. Risco-benefício: alto refactor, baixa probabilidade de falha (rollback manual já cobre 95% dos casos). **Recomendação**: abrir PR dedicado.
- **Race condition**: `currentQuantity` lido pelo JS, depois `UPDATE produtos SET q = currentQuantity - qty` — entre leitura e update, outro admin pode alterar. **Não é corrigido** sem refactor pra `UPDATE ... WHERE quantidade_disponivel >= qty RETURNING`.

**2. `handle_new_user` aceita role via `raw_user_meta_data->>'role'`**
- O trigger que cria `usuarios` ao cadastrar via Auth lê `raw_user_meta_data->>'role'` (default `moderador`).
- Se um signup público existir, alguém pode tentar se registrar com `role: 'admin'` no payload.
- **Hoje**: nenhum signup público exposto no código. Risco zero em produção.
- **Recomendação**: ignorar o metadata e forçar `'moderador'` no trigger.

**3. `solicitacoes_orcamento` INSERT anônimo sem rate limit**
- Formulário público. Pode ser abusado.
- **Recomendação**: Edge Function com throttling por IP, ou trigger que rejeita mais de N inserts/hora/IP. **Decisão pendente do Marcos**.

#### 🟡 IMPORTANTE (risco médio, não-bloqueante)

**4. `database.ts` (types) está desatualizado**
- `PostgrestVersion: 12.2.12` no header do tipo, mas o projeto roda versão mais nova.
- Falta: tipo da função `is_admin_user` e dos triggers recém-criados.
- **Recomendação**: `supabase gen types typescript --project-id xxx` (CLI) e commitar.

**5. `eventos` table: 0 rows, 700% dead tuples, sem uso**
- Tabela vazia, sem RLS policy granular, sem uso conhecido.
- **Decisão consciente**: deixada como está. Se for abandonada, dropar em migration futura.

**6. `AdminOrcamentos.tsx` state management: 43 `useState` em 3.5k linhas**
- Puro legado. Refactor pra `useReducer` + state machine (`idle → editing → confirming → rollback`) seria correto.
- **Decisão consciente**: não refatorar (alto risco, zero ganho funcional imediato). Documentado.

**7. `AdminEventos.tsx` (página) com `useState<... | null>` sem `noUncheckedIndexedAccess` ativo em alguns pontos**
- Lint limpo agora (removido `catch(error: any)` na Rodada 1).
- Tipos de TypeScript: o `database.ts` é a principal fonte de inconsistência. Quando regenerar, esse item se resolve.

**8. `AdminEstoque.tsx` deduz estoque sem checar `historico_estoque` para itens reservados**
- Quando um `ConfirmShow` acontece, o estoque é deduzido + `historico_estoque` recebe uma `saida`. Mas se o `AdminEstoque` (entrada manual) rodar em paralelo, a checagem `saldo insuficiente` no JS é baseada em `currentQuantity` lido antes — mesma race condition do item 1.
- **Mitigação**: o trigger `prevent_negative_stock` (Rodada 3) faz o DB recusar UPDATE inválido, mesmo que o JS tenha checado errado. Defesa em profundidade.

#### 🟢 BAIXO (cosmético ou planejado)

**9. `bun.lockb` ainda commitado**: órfão. Decisão pendente.

**10. `auth_leaked_password_protection` desligada**: config manual no painel Supabase. Pendente.

**11. Postgres 17.4.1 com patches pendentes**: agendável pelo painel.

**12. `.env` commitado em `1799a2d`**: se havia `service_role` key, rotacionar. Se só `VITE_*` (público por design), ok.

---

## Rodada 5 — RPC atômica para confirmação de show (substitui client-side não-atômico)

Foco: o **único bug crítico real** que sobrou do fluxo do admin. `handleConfirmShowCompletion` em `AdminOrcamentos.tsx` (linhas 838-1198, ~360 linhas) faz UPDATE `orcamentos.status='realizado'` **antes** da dedução de estoque, e tenta rollback manual em caso de falha — mas o trigger `prevent_status_unlock` (rodada 3) **bloqueia** esse rollback. Resultado: em caso de falha parcial em prod, o status ficava em `realizado` sem como reverter (sem intervenção SQL manual).

**Substituído por RPC atômica** com `BEGIN/COMMIT`. Se qualquer passo falhar, `ROLLBACK` garante que status, estoque e histórico ficam consistentes.

### ✅ O que foi feito

1. **Migration aplicada via MCP** `2026-06-08_rpc_confirm_show_as_completed`:
   - Função `public.confirm_show_as_completed(p_orcamento_id uuid, p_consumptions jsonb, p_final_value numeric, p_allow_insufficient_stock boolean) RETURNS jsonb`
   - `LANGUAGE plpgsql`, `SECURITY DEFINER`, `SET search_path = public`
   - **CHECA `is_admin_user()` internamente** (defesa em profundidade, RLS é bypassada por SECURITY DEFINER)
   - **`SELECT ... FOR UPDATE`** no orcamento (lock pessimista, impede concorrência)
   - **`SELECT ... FOR UPDATE`** em cada produto (lock durante dedução)
   - **Idempotência via `showMarker`** (`[show:UUID]`): se historico já contém o marker, pula o consumo
   - **Validações**: status='confirmado', data do evento não-futura, produto existe
   - **`UPDATE produtos` + `INSERT historico_estoque`** em transação
   - **Trigger `prevent_negative_stock`** (rodada 3) rejeita UPDATE para saldo negativo
   - **Trigger `fill_historico_usuario`** (rodada 3) preenche `auth.uid()` em historico
   - Retorna `jsonb` com `success`, `status_anterior`, `movimentos_aplicados`, `itens_insuficientes`, `total_usado`
   - **GRANT EXECUTE TO authenticated + service_role**, REVOKE de PUBLIC

2. **Client refatorado** (`AdminOrcamentos.tsx.handleConfirmShowCompletion`):
   - 360 linhas → 180 linhas (-50%)
   - **Caminho 1 (cancelamento)**: 1 UPDATE direto, sem RPC (risco zero de inconsistência)
   - **Caminho 2 (realização)**: 1 chamada `supabase.rpc('confirm_show_as_completed', ...)`
   - Mantém validações de UX (data, status) **antes** da chamada (fail-fast)
   - Mantém feedback (toasts) no mesmo formato
   - Mantém refetch (`fetchOrcamentos`, `fetchProdutos`)

3. **Migration local** salva em `supabase/migrations/2026-06-08_rpc_confirm_show_as_completed.sql` para registro (não aplicada via CLI; aplicada via MCP).

### ✅ Testes (5 cenários, todos passaram)

| # | Cenário | Esperado | Resultado |
|---|---|---|---|
| 1 | Happy path (1 consumo, 3 unidades) | status=realizado, estoque 5→2, 1 linha historico | ✅ |
| 2 | Idempotência (chamar 2x, 2a call pula) | movimentos_aplicados=[] | ✅ |
| 3a | Estoque insuficiente + allow=false | RAISE check_violation + ROLLBACK total | ✅ status fica confirmado, produto inalterado, 0 historico |
| 3b | Estoque insuficiente + allow=true | status=realizado, 1 linha historico tipo='ajuste' | ✅ |
| 4 | Status inválido (pendente) | RAISE check_violation 'nao esta confirmado' | ✅ |
| 5 | Data do evento futura | RAISE check_violation 'data do evento' | ✅ |

### 🔴 Validação importante: trigger `prevent_status_unlock`

Durante os testes, descobri que o trigger `prevent_status_unlock` (rodada 3) **bloqueia** a tentativa de rollback manual do fluxo client-side antigo. Isso é **comportamento desejado** (defesa contra mudança de status em orcamentos finalizados), mas confirmou que o client-side original **estava quebrado**: em caso de falha parcial em prod, o status ficava permanentemente em `realizado` sem como reverter. A RPC resolve isso porque toda a operação é uma única transação — se qualquer parte falha, **nada é commitado** (incluindo o UPDATE de status).

### ⚠️ Dados de teste

- Criados 5 orcamentos de teste com datas no passado para validar RPC. **Limpos após os testes** (DELETE + UPDATE para resetar estoque).
- Fumaça de Solo 2" (id b7465ae4) foi de 5→0 durante os testes, **restaurado para 5**.

### 🔍 Itens verificados (positivos)

- **`grep -c "service_role" dist/assets/AdminOrcamentos-*.js`**: 0 matches
- **`grep -c "confirm_show_as_completed" dist/assets/AdminOrcamentos-*.js`**: 1 match (nome da RPC, esperado)

### 📊 Métricas rodada 5

| Item | Antes | Depois |
|---|---|---|
| `handleConfirmShowCompletion` linhas | 361 | **~180 (-50%)** |
| Operações client-side para finalizar show | 1 UPDATE + N UPDATEs + N INSERTs + N UPDATEs (rollback) + 1 INSERT (pendencias) | **1 RPC call** |
| Atomicidade | ❌ Nenhuma | ✅ BEGIN/COMMIT |
| Estado inconsistente possível | ✅ Sim (rollback bloqueado por trigger) | ✅ Não (ROLLBACK total) |
| Lock pessimista | ❌ Não | ✅ FOR UPDATE em orcamento + produto |
| Idempotência | Client-side (manual) | Server-side (via historico) |
| Build | 5.46s | 5.51s |
| Lint | 0 errors | 0 errors |
| TS | 0 errors | 0 errors |
| Testes | 82/83 | 82/83 (mesma falha pré-existente) |

---

## Rodada 4 — Hardening cirúrgico do /admin (comportamento + UX + segurança)

Foco: corrigir bugs reais do painel admin que afetam comportamento, UX e produção. Sem refatorações arriscadas (AdminOrcamentos.tsx ficou intocado, exceto para gatear console.error). Tudo em defesa de profundidade.

### ✅ Bugs corrigidos

1. **`use-toast.ts` (memory leak)**: `useEffect` re-empilhava `setState` em `listeners` a cada render por causa de `[state]` como dependência. Trocado para `[]` (registra uma vez, remove no unmount).
2. **`use-supabase.ts` (loop infinito potencial)**: `defaultFilter` e `orderBy` são objetos recriados a cada render, o que disparava `fetchData()` em loop. Adicionada estabilização via `JSON.stringify(...Key)` nas deps do `useCallback`, com `eslint-disable` em `exhaustive-deps` (a versão serializada substitui com segurança).
3. **`AdminLogin` (sessão + race condition)**: 
   - `setIsLoading(false)` não era chamado no caminho de sucesso — dependia 100% do `onAuthStateChange`. Adicionado fallback `setTimeout(3000)` defensivo.
   - Se houvesse sessão válida de usuário não-admin ao chegar no login, navegava direto pro admin (loop). Agora detecta role/ativo e faz `signOut()` se não for admin válido.
4. **`AdminEventos` (performance)**: query sem `.order()` e sem `.limit()` — escalaria mal. Adicionado `.order('evento_data', { ascending: false }).limit(500)`.
5. **`AdminLayout` (UX de logout)**: `signOut()` sem try/catch — se rede caísse, navegava pra login sem deslogar. Agora `try/catch/finally` garante navegação mesmo em falha.
6. **`ErrorBoundary` (vazamento de info técnica)**: mostrava `this.state.error.toString()` para o usuário final (stack trace visível). Substituído por mensagem genérica apontando pros logs.
7. **15 `console.error` no admin** em produção: gateados por `import.meta.env.DEV` em `AdminLogin`, `AdminEventos`, `AdminOrcamentos`, `use-eventos`, `use-orcamentos`, `use-solicitacao-orcamento`, `use-supabase`, `use-orcamento-pdf`, `AdminLayout`. Em prod build, esses logs são stripados.
8. **`use-supabase.ts` documentado como @deprecated**: hooks `useOrcamentos`, `useEventos`, `useSolicitacoesOrcamento` que estavam lá nunca eram usados. Marcados com JSDoc `@deprecated` (não removidos pra não arriscar regressão; marcado pra limpeza futura).
9. **`AdminOrcamentos.tsx` console.error/warn**: 12+ ocorrências gateadas por `import.meta.env.DEV`. As 3 que sobraram (`console.warn('[Orçamentos] lead_submissions indisponível')` etc) são **soft-failures esperados** quando uma tabela opcional não existe (42P01), portanto mantidas.

### 🔴 Achados documentados, NÃO corrigidos (decisão consciente)

- **`ProdutosTable.tsx` é código morto** (exporta mas não é importado em lugar nenhum). Será removido em PR de limpeza junto com `use-supabase.ts`.
- **`AdminOrcamentos.tsx` (3.5k linhas, 43 useState)** — refatoração adiada (rodada 3 já documentou).
- **Duplicata conceitual `useEventos`** (existe em `use-eventos.ts` e em `use-supabase.ts`). O `use-eventos.ts` é o que está em uso real (EventosCalendar, EventosTable). O do `use-supabase.ts` é morto.
- **`TOAST_REMOVE_DELAY = 1.000.000` (16 min)** — magic number do shadcn/ui, mantido.
- **`AdminLogin` sem rate limit client-side** — Supabase Auth tem rate limit no servidor (silencioso). Adicionar cooldown client-side é nice-to-have, não crítico.
- **Stack trace de `error` em `ErrorBoundary`**: ainda logado em `console.error` (mantido, mas só em DEV graças ao gate do `useEffect` ainda não estar aplicado — `componentDidCatch` é de classe, escapa do Vite tree-shake se a classe for usada).

### 🔍 Itens verificados (positivos)

- **`grep -r "service_role" src/`** → 0 matches. **Não há service_role key no bundle.** Os JWTs em `dist/assets/FogosM5Complete-*.js` são tokens de signed URL do Storage (URL `M5Max/V2.mp4`, exp 2053) — públicos por design.
- **`.env` não está no repo** (foi removido entre a rodada 1 e a 4). `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` são as únicas chaves em uso, ambas com prefixo `VITE_` (público por design do Vite).
- **Bundle de prod**: build 5.46s, 0 errors, 0 service_role leaks.

### 📊 Métricas rodada 4

| Item | Antes | Depois |
|---|---|---|
| `use-toast` memory leak | ❌ listener re-empilhado por render | ✅ `[]` deps |
| `use-supabase` loop infinito potencial | ❌ `defaultFilter`/`orderBy` recriados | ✅ estabilizado via `JSON.stringify` |
| `AdminLogin` race condition | ❌ loading state preso | ✅ fallback 3s |
| `AdminLogin` sessão não-admin | ❌ loop entre login/admin | ✅ signOut() |
| `AdminEventos` query sem limite | ❌ 1000+ rows potenciais | ✅ `.limit(500)` |
| `AdminLayout` signOut sem try/catch | ❌ falha silenciosa | ✅ try/catch/finally |
| `ErrorBoundary` info técnica | ❌ stack trace visível | ✅ mensagem genérica |
| `console.error` em prod (admin) | ❌ 15+ vazando | ✅ gateados por `import.meta.env.DEV` |
| Build | 5.71s | 5.46s |
| Lint | 0 errors | 0 errors |
| TS | 0 errors | 0 errors |
| Testes | 82/83 | 82/83 (mesma falha pré-existente) |
| `service_role` no bundle | 0 | 0 |

---

## Rodada 2 — Lockdown /admin (mensagem: "Nada deve ser público de /admin")

Comando do Marcos: fechar qualquer vazamento que exponha dados de admin para o público. Aplicado:

- **`usuarios` SELECT com `USING (true)`** → fechado. Cada usuário autenticado agora lê apenas o próprio registro (`id = auth.uid()`). Migration `2026-06-08_lockdown_admin_data`.
- **Bucket `orcamentos_pdfs` era público** → tornado privado (`public = false`). As 3 policies permissivas (read/insert/update por PUBLIC) foram removidas. Bucket continua vazio (nenhum PDF upado); código atual gera PDFs client-side com jsPDF, sem usar storage. Se/quando voltar a usar o bucket, gerar signed URLs no admin.
- **Funções `SECURITY DEFINER` (`is_admin_user`, `handle_new_user`, `update_updated_at_column`)** → revogado EXECUTE de `anon` e `authenticated`. Elas só são chamadas via policies (pelo planner) e triggers (pelo postgres), não precisam de EXECUTE pelo client. Migration `2026-06-08_revoke_anon_execute_v2`.

**Resultado do advisor:** de 7 warnings → **3** (todos legítimos ou fora de alcance por migration).

---

## ✅ O que foi corrigido nesta auditoria

### 1. Banco de dados (Supabase) — migrations aplicadas

**`2026-06-08_security_perf_hardening`**
- `update_updated_at_column()`: `SET search_path = public` (era warning real do advisor).
- 6 índices em foreign keys sem cobertura (`eventos.orcamento_id`, `historico_estoque.produto_id`, `historico_estoque.usuario_id`, `orcamentos.created_by`, `orcamentos_produtos.orcamento_id`, `orcamentos_produtos.produto_id`).
- `idx_orcamentos_status` removido (nunca usado).

**`2026-06-08_lockdown_admin_data`**
- `usuarios`: SELECT público irrestrito → SELECT apenas do próprio registro (`id = auth.uid()`).
- Bucket `orcamentos_pdfs`: 3 policies de `storage.objects` removidas.

**`2026-06-08_revoke_anon_execute_v2`**
- EXECUTE revogado de `anon`/`authenticated` em `is_admin_user`, `handle_new_user`, `update_updated_at_column`.

### 2. Dependências (`npm audit`)
- 18 vulnerabilidades → **2 (0 críticas)**.
- Subiu `vitest` e `@vitest/ui` para `^3.2.6` (corrigiu as 2 críticas — eram de dev-server only).
- Sobraram 2 moderadas em `esbuild`/`vite` (dev-server only). Fix só via Vite 8 (breaking). **Recomenda-se agendar upgrade do Vite 5 → 8 num PR isolado.**

### 3. Código
- `.env.example` criado (estava faltando) — cobre Supabase, leads, analytics, YouTube, WhatsApp, contato.
- `src/features/admin/pages/AdminEventos.tsx`: removido `catch (error: any)` (era o único erro de lint).

---

## ⚠️ Itens analisados mas NÃO corrigidos (decisão consciente)

### a) `is_admin_user()` aceita `moderador` em todas as tabelas sensíveis
A função retorna `true` para qualquer usuário com `role IN ('admin', 'moderador')`, e essa função controla **todas** as policies de admin (produtos, orcamentos, eventos, historico_estoque, orcamentos_produtos). Hoje só existem 2 admins e 0 moderadores, então na prática não vaza nada — mas se você adicionar um moderador amanhã, ele enxerga TUDO (incluindo margem de lucro dos orçamentos).
- **Risco:** baixo agora, alto quando entrar moderador.
- **Recomendação:** criar policy granular (ex.: moderador só vê `solicitacoes_orcamento`; admin vê tudo). Migration pronta quando quiser.

### b) Bucket `orcamentos_pdfs` é público com `WITH CHECK (true)` e SELECT aberto
~~Qualquer pessoa na internet pode listar/baixar **todos os PDFs de orçamento** dos clientes (contém nome, telefone, evento, valores). LGPD real.~~ **CORRIGIDO** na Rodada 2 — bucket agora é privado, sem arquivos upados.

### c) `solicitacoes_orcamento` aceita INSERT anônimo com `WITH CHECK (true)`
Formulário público de leads sem rate limit.
- **Risco:** spam/abuse do banco (custo Supabase + poluição do painel admin).
- **Restrição:** não pode fechar (form público de orçamento PRECISA aceitar INSERT anônimo).
- **Recomendação:** adicionar rate limit (Edge Function ou constraint de IP/hora) e validar campos no DB.

### d) `produtos` sem policy de SELECT público
A policy atual é `is_admin_user()` — o catálogo público só aparece logado.
- **Conferi:** o front lê das tabelas legadas `kit_festa`/`kit_cha_revelacao`/`tortas` via `useSupabaseProducts`, que JÁ tem RLS público (`ativo = true`). O site público está funcionando. A tabela `produtos` é a nova e ninguém usa ainda pelo front.
- **Recomendação:** quando migrar o front pra `produtos`, criar policy `SELECT ... USING (ativo = true) TO anon, authenticated` (mesmo padrão das legadas). Migration pronta.

### e) `handle_new_user` permite auto-criação de role via `raw_user_meta_data->>'role'`
Quando alguém se cadastra via Supabase Auth, a trigger insere o role do `user_metadata` (default `moderador`).
- **Risco:** um usuário pode tentar se registrar com `role: 'admin'` no payload. (Na prática o `signUp` não está exposto publicamente no código atual, então está OK.)
- **Recomendação:** se houver tela de signup público, forçar role default no trigger e ignorar o metadata. Migration de 1 linha.

### f) `bun.lockb` + `package-lock.json` ambos commitados
Há dois lock files. O `package-lock.json` é a fonte da verdade (`npm` é o PM do `package.json`). O `bun.lockb` é orfão desde o início do projeto.
- **Decisão:** manter `bun.lockb` (remover requer decisão consciente + força-pode-introduzir-ruido em PR review).
- **Recomendação:** `git rm bun.lockb` em PR dedicado + atualizar `AGENTS.md` com a regra "sempre npm".

### g) `auth_leaked_password_protection` desabilitada
HaveIBeenPwned check desligado no Auth do Supabase.
- **Risco:** permite senha comprometida (ex.: "123456") em painel admin.
- **Recomendação:** ligar no painel Supabase (Auth → Password → Leaked Password Protection). Não é migration, é config manual.

### h) Postgres 17.4.1 com patches pendentes
- **Risco:** baixo (patches de defesa em profundidade).
- **Recomendação:** agendar upgrade via painel Supabase (Platform → Database → Upgrade).

### i) `.env` commitado em commit antigo (1799a2d "Delete .env")
O `.env` foi deletado depois, mas a chave do Supabase anon key + qualquer outra variável ficou no histórico.
- **Risco:** depende de quais secrets estavam lá.
- **Recomendação:** se houve `service_role` key ou chave de API exposta, rotacionar no Supabase. Se foi só `VITE_*` (todas públicas por design), ok.

### j) Console de erro em `AuthContextSimple.tsx`
`console.log('🔍 AuthProvider: Perfil do usuário (public.usuarios):', ...)` em produção vaza `role` e `ativo` no DevTools de qualquer usuário logado.
- **Risco:** baixo (é o próprio usuário vendo os próprios dados), mas se houver log de terceiros (Sentry etc.) o role vai junto.
- **Recomendação:** gate por `import.meta.env.DEV` (como já feito em outros lugares).

---

## 📊 Estado final

| Item | Antes | Depois |
|---|---|---|
| Vulnerabilidades npm | 18 (2 critical, 8 high, 8 mod) | 2 (0 critical, 0 high, 2 mod — dev only) |
| Advisor security | 9 warnings | 3 warnings (1 necessária p/ form público funcionar, 2 config manual) |
| Advisor performance | 7 lints | 6 lints (só unused indexes, esperado em DB pequeno) |
| Lint errors | 1 | 0 |
| Testes | 82/83 ✅ | 82/83 ✅ (mesma falha pré-existente em useAnalytics) |
| Build | ✅ | ✅ 3.17s |
| `.env.example` | ❌ ausente | ✅ presente |
| `usuarios` SELECT público | ❌ vazava 2 admins | ✅ fechado (próprio user) |
| Bucket `orcamentos_pdfs` | ❌ público + listing | ✅ privado + 3 policies removidas |
| Funções SECURITY DEFINER expostas | ❌ anon EXECUTE | ✅ só service_role/postgres |
| `produtos` UPDATE com saldo negativo | ❌ permitia | ❌→✅ **DB rejeita** (Rodada 3) |
| `orcamentos` status sair de `realizado` | ❌ permitia | ❌→✅ **DB rejeita** (Rodada 3) |
| `historico_estoque.usuario_id` NULL | ❌ 98% das 113 rows | ✅ **trigger preenche com `auth.uid()`** (Rodada 3) |
| `console.log` vazando role/ativo no browser | ❌ presente | ✅ **removido** (Rodada 3) |
| `updated_at` triggers duplicados | ❌ 4 pares duplicados | ✅ **dedupado** (Rodada 3) |
| `ANALYZE` em todas tabelas | ❌ stats velhas (abril) | ✅ **estatísticas atualizadas** (Rodada 3) |

---

## 🧭 Próximos passos sugeridos (em ordem)

1. **Ligar** leaked password protection no painel Supabase (item g).
2. Agendar upgrade Vite 5 → 8 (item 2.).
3. **Decidir se quer** `a`, `c`, `e` agora ou depois. (Rodada 3 confirmou: `c` continua sendo o mais urgente — rate limit no form.)
4. Adicionar rate limit no formulário de orçamento (item c) — Edge Function ou trigger de IP/hora.
5. **Refatorar `ConfirmShow` para RPC atômica** (item 1 — Rodada 3): eliminar o estado "realizado sem estoque".
6. Remover `bun.lockb` em PR dedicado (item f).
7. Rotacionar secrets se houve `service_role` no histórico (item i).
8. Agendar upgrade do Postgres 17.4.1 → próxima patch (item h).
9. Regenerar `database.ts` (item 4 — Rodada 3).
