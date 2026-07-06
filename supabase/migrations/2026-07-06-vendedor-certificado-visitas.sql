-- ============================================================
-- Migración 2026-07-06 — Ejecutar en: Supabase Dashboard → SQL Editor
--   1. Origen 'vendedor' para leads de captación
--   2. Certificado energético (obligatorio en publicidad, RD 235/2013)
--   3. Consentimiento RGPD con fecha
--   4. Contador de visitas por propiedad y día
-- ============================================================

-- 1. Nuevo origen de lead para propietarios que quieren vender
alter type origen_lead add value if not exists 'vendedor';

-- 2. Certificado energético
alter table propiedades add column if not exists certificado_energetico text
  check (
    certificado_energetico is null
    or certificado_energetico in ('A','B','C','D','E','F','G','en_tramite','exento')
  );

-- 3. RGPD: cuándo aceptó el contacto la política de privacidad
alter table contactos add column if not exists acepta_privacidad_at timestamptz;

-- 4. Visitas por propiedad y día (no toca `propiedades`, así el trigger
--    de updated_at no se dispara con cada visita)
create table if not exists propiedad_visitas (
  propiedad_id uuid not null references propiedades(id) on delete cascade,
  dia          date not null default current_date,
  visitas      integer not null default 1,
  primary key (propiedad_id, dia)
);

alter table propiedad_visitas enable row level security;

-- Solo el admin lee las visitas; las escrituras entran por la API con
-- service role (bypassa RLS), así que no hay política de insert público.
create policy "visitas_admin_read"
  on propiedad_visitas for select
  to authenticated
  using (true);

-- Incremento atómico, llamado vía RPC desde /api/vistas
create or replace function registrar_visita(prop_id uuid) returns void
language sql
security definer
set search_path = public
as $$
  insert into propiedad_visitas (propiedad_id, dia, visitas)
  values (prop_id, current_date, 1)
  on conflict (propiedad_id, dia)
  do update set visitas = propiedad_visitas.visitas + 1;
$$;
