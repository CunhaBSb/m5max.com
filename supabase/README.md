# Supabase Migrations

- Apply with Supabase CLI:
  - `supabase migration new rls_produtos_public_read` (already created as 2025-09-14_rls_produtos_public_read.sql)
  - `supabase db push` (dev) or integrate into your deploy pipeline.

- Contents:
  - Row Level Security enabling for `kit_festa`, `kit_cha_revelacao`, `tortas`.
  - Read policies (anon/authenticated) restricted to `ativo is true`.
  - Indexes to support filters and sorting used by the app.

- Safety: writes revoked from anon/authenticated by default.
