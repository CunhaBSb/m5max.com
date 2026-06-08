# NOTES — Auditoria e correções (2026-06-08)

> Documento de passagem. Cada item diz **status** (✅ aplicado / ⚠️ decidido/não aplicado / 📋 decisão do Marcos).

---

## ✅ O que foi corrigido nesta auditoria

### 1. Banco de dados (Supabase) — migration `2026-06-08_security_perf_hardening`
- `update_updated_at_column()`: `SET search_path = public` (era warning real do advisor).
- 6 índices em foreign keys sem cobertura (`eventos.orcamento_id`, `historico_estoque.produto_id`, `historico_estoque.usuario_id`, `orcamentos.created_by`, `orcamentos_produtos.orcamento_id`, `orcamentos_produtos.produto_id`).
- `idx_orcamentos_status` removido (nunca usado).

### 2. Dependências (`npm audit`)
- 18 vulnerabilidades → **4 → 2 (0 críticas)**.
- Subiu `vitest` e `@vitest/ui` para `^3.2.6` (corrigiu as 2 críticas — eram de dev-server only).
- Sobraram 2 moderadas em `esbuild`/`vite` (dev-server only). Fix só via Vite 8 (breaking). **Recomenda-se agendar upgrade do Vite 5 → 8 num PR isolado.**

### 3. Código
- `.env.example` criado (estava faltando) — cobre Supabase, leads, analytics, YouTube, WhatsApp, contato.
- `src/features/admin/pages/AdminEventos.tsx`: removido `catch (error: any)` (era o único erro de lint).

---

## ⚠️ Itens analisados mas NÃO corrigidos (decisão consciente)

### a) `is_admin_user()` aceita `moderador` em todas as tabelas sensíveis
A função retorna `true` para qualquer usuário com `role IN ('admin', 'moderador')`, e essa função controla **todas** as policies de admin (produtos, orcamentos, eventos, historico_estoque, orcamentos_produtos). Hoje só existe 1 admin, então na prática não vaza nada — mas se você adicionar um moderador amanhã, ele enxerga TUDO (incluindo margem de lucro dos orçamentos).
- **Risco:** baixo agora, alto quando entrar moderador.
- **Recomendação:** criar policy granular (ex.: moderador só vê `solicitacoes_orcamento`; admin vê tudo). Migration pronta quando quiser.

### b) Bucket `orcamentos_pdfs` é público com `WITH CHECK (true)` e SELECT aberto
Qualquer pessoa na internet pode listar e baixar todos os PDFs de orçamento dos clientes (contém nome, telefone, evento, valores).
- **Risco:** LGPD real. PDFs de clientes vazando.
- **Recomendação:** tornar bucket privado + gerar signed URLs no admin. Migration pronta quando quiser.

### c) `solicitacoes_orcamento` aceita INSERT anônimo com `WITH CHECK (true)`
Formulário público de leads sem rate limit.
- **Risco:** spam/abuse do banco (custo Supabase + poluição do painel admin).
- **Recomendação:** adicionar rate limit (Edge Function ou constraint de IP/hora) e validar campos no DB.

### d) `produtos` sem policy de SELECT público
A policy atual é `is_admin_user()` — o catálogo público só aparece logado.
- **Risco:** ALTO se você pretende vender/mostrar produtos para visitantes anônimos. ⚠️ O site público hoje provavelmente está mostrando catálogo vazio.
- **Recomendação:** confirmar com o front se há leitura anônima. Se sim, criar policy `SELECT ... USING (ativo = true) TO anon, authenticated`. Migration pronta.

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
| Advisor security | 9 warnings | 7 warnings (3 de RLS/bucket — dec. consciente; 4 de SECURITY DEFINER — falso positivo) |
| Advisor performance | 7 lints | 6 lints (só unused indexes, esperado em DB pequeno) |
| Lint errors | 1 | 0 |
| Testes | 82/83 ✅ | 82/83 ✅ (mesma falha pré-existente em useAnalytics) |
| Build | ✅ | ✅ 3.17s |
| `.env.example` | ❌ ausente | ✅ presente |

---

## 🧭 Próximos passos sugeridos (em ordem)

1. **PRIORITÁRIO** — confirmar se a home pública está mostrando catálogo (issue `d`). Se sim, migration de SELECT público.
2. **PRIORITÁRIO** — tornar bucket `orcamentos_pdfs` privado (issue `b`).
3. **Ligar** leaked password protection no painel Supabase (issue `g`).
4. Agendar upgrade Vite 5 → 8 (issue `2.`).
5. Decidir se quer aplicar `a`, `c`, `e` agora ou depois.
6. Remover `bun.lockb` em PR dedicado (issue `f`).
