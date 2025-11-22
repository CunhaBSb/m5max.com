-- RLS and Indexes for Produtos (kit_festa, kit_cha_revelacao, tortas)

-- Enable RLS
alter table if exists public.kit_festa enable row level security;
alter table if exists public.kit_cha_revelacao enable row level security;
alter table if exists public.tortas enable row level security;

-- Policies: kit_festa
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='kit_festa' and policyname='read_active_anon'
  ) then
    create policy read_active_anon
      on public.kit_festa
      for select
      to anon
      using (ativo is true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='kit_festa' and policyname='read_active_auth'
  ) then
    create policy read_active_auth
      on public.kit_festa
      for select
      to authenticated
      using (ativo is true);
  end if;
end $$;

-- Policies: kit_cha_revelacao
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='kit_cha_revelacao' and policyname='read_active_anon'
  ) then
    create policy read_active_anon
      on public.kit_cha_revelacao
      for select
      to anon
      using (ativo is true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='kit_cha_revelacao' and policyname='read_active_auth'
  ) then
    create policy read_active_auth
      on public.kit_cha_revelacao
      for select
      to authenticated
      using (ativo is true);
  end if;
end $$;

-- Policies: tortas
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='tortas' and policyname='read_active_anon'
  ) then
    create policy read_active_anon
      on public.tortas
      for select
      to anon
      using (ativo is true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='tortas' and policyname='read_active_auth'
  ) then
    create policy read_active_auth
      on public.tortas
      for select
      to authenticated
      using (ativo is true);
  end if;
end $$;

-- Optional: prevent writes from anon/authenticated
revoke insert, update, delete on public.kit_festa from anon, authenticated;
revoke insert, update, delete on public.kit_cha_revelacao from anon, authenticated;
revoke insert, update, delete on public.tortas from anon, authenticated;

-- Indexes (support filters/sorting)
create index if not exists kit_festa_ativo_idx on public.kit_festa (ativo);
create index if not exists kit_festa_valor_active_idx on public.kit_festa (valor) where ativo is true;
create index if not exists kit_festa_nome_idx on public.kit_festa (nome_kit);
create index if not exists kit_festa_created_idx on public.kit_festa (created_at);

create index if not exists kit_cha_revelacao_ativo_idx on public.kit_cha_revelacao (ativo);
create index if not exists kit_cha_revelacao_valor_active_idx on public.kit_cha_revelacao (valor) where ativo is true;
create index if not exists kit_cha_revelacao_nome_idx on public.kit_cha_revelacao (nome_kit);
create index if not exists kit_cha_revelacao_created_idx on public.kit_cha_revelacao (created_at);

create index if not exists tortas_ativo_idx on public.tortas (ativo);
create index if not exists tortas_nome_idx on public.tortas (nome_torta);
