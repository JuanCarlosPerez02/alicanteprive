-- ============================================================
-- Alicante Privé — Schema SQL para Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============ ENUMS ============
create type operacion_tipo as enum ('venta', 'alquiler');
create type propiedad_estado as enum ('disponible', 'reservada', 'vendida', 'alquilada', 'oculta');
create type origen_lead as enum ('web', 'idealista', 'fotocasa', 'manual', 'otro');
create type interes_estado as enum (
  'nuevo', 'contactado', 'visita_pendiente', 'visito', 'no_visito', 'descartado', 'cerrado'
);

-- ============ PROPIEDADES ============
create table propiedades (
  id                uuid primary key default gen_random_uuid(),
  referencia        text unique not null,
  operacion         operacion_tipo not null,
  tipo              text not null,
  titulo            jsonb not null default '{}'::jsonb,
  descripcion       jsonb not null default '{}'::jsonb,
  precio            numeric(12,2) not null,
  zona              text,
  direccion         text,
  lat               double precision,
  lng               double precision,
  metros            integer,
  habitaciones      integer,
  banos             integer,
  caracteristicas   jsonb not null default '[]'::jsonb,
  estado            propiedad_estado not null default 'disponible',
  destacada         boolean not null default false,
  referencia_idealista text,
  referencia_fotocasa  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table propiedad_fotos (
  id            uuid primary key default gen_random_uuid(),
  propiedad_id  uuid not null references propiedades(id) on delete cascade,
  url           text not null,
  orden         integer not null default 0,
  es_portada    boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ============ CONTACTOS / CLIENTES ============
create table contactos (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  email         text,
  telefono      text,
  origen        origen_lead not null default 'manual',
  notas         text,
  preferencias  jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============ INTERÉS ============
create table interes_propiedad (
  id               uuid primary key default gen_random_uuid(),
  contacto_id      uuid not null references contactos(id) on delete cascade,
  propiedad_id     uuid not null references propiedades(id) on delete cascade,
  origen           origen_lead not null default 'manual',
  estado           interes_estado not null default 'nuevo',
  motivo_no_compra text,
  notas            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (contacto_id, propiedad_id)
);

-- ============ MENSAJES ============
create table mensajes (
  id            uuid primary key default gen_random_uuid(),
  contacto_id   uuid references contactos(id) on delete set null,
  propiedad_id  uuid references propiedades(id) on delete set null,
  origen        origen_lead not null default 'web',
  texto         text not null,
  leido         boolean not null default false,
  recibido_en   timestamptz not null default now()
);

-- ============ ÍNDICES ============
create index idx_propiedades_estado on propiedades(estado);
create index idx_propiedades_operacion on propiedades(operacion);
create index idx_interes_propiedad_prop on interes_propiedad(propiedad_id);
create index idx_interes_propiedad_contacto on interes_propiedad(contacto_id);
create index idx_mensajes_leido on mensajes(leido);

-- ============ TRIGGER updated_at ============
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_propiedades_updated_at
  before update on propiedades
  for each row execute function set_updated_at();

create trigger trg_contactos_updated_at
  before update on contactos
  for each row execute function set_updated_at();

create trigger trg_interes_updated_at
  before update on interes_propiedad
  for each row execute function set_updated_at();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table propiedades       enable row level security;
alter table propiedad_fotos   enable row level security;
alter table contactos         enable row level security;
alter table interes_propiedad enable row level security;
alter table mensajes          enable row level security;

-- Propiedades: lectura pública (no ocultas), escritura solo auth
create policy "propiedades_public_read"
  on propiedades for select
  to anon, authenticated
  using (estado <> 'oculta');

create policy "propiedades_admin_all"
  on propiedades for all
  to authenticated
  using (true)
  with check (true);

-- Fotos: lectura pública de propiedades no ocultas, escritura solo auth
create policy "fotos_public_read"
  on propiedad_fotos for select
  to anon, authenticated
  using (
    exists (
      select 1 from propiedades p
      where p.id = propiedad_fotos.propiedad_id
        and p.estado <> 'oculta'
    )
  );

create policy "fotos_admin_all"
  on propiedad_fotos for all
  to authenticated
  using (true)
  with check (true);

-- Contactos: solo admin
create policy "contactos_admin_all"
  on contactos for all
  to authenticated
  using (true)
  with check (true);

-- Interés: solo admin
create policy "interes_admin_all"
  on interes_propiedad for all
  to authenticated
  using (true)
  with check (true);

-- Mensajes: solo admin (inserciones públicas se hacen via service role desde /api/contacto)
create policy "mensajes_admin_all"
  on mensajes for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Storage bucket para fotos de propiedades
-- ============================================================
-- Ejecutar en Supabase Dashboard → Storage → New bucket:
--   Nombre: propiedades
--   Public: true
--
-- Política de storage (permite subir solo a admins, leer a todos):
insert into storage.buckets (id, name, public)
values ('propiedades', 'propiedades', true)
on conflict do nothing;

create policy "fotos_storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'propiedades');

create policy "fotos_storage_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'propiedades');

create policy "fotos_storage_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'propiedades');
