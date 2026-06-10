import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/public';
import type { Propiedad } from '@/types';

// Shared tag for the public property list cache. Mutating routes call
// revalidateTag(PROPIEDADES_TAG) so admin edits show up immediately.
export const PROPIEDADES_TAG = 'propiedades';

export interface PropiedadFilters {
  isMapa: boolean;
  operacion?: string;
  tipo?: string;
  zona?: string;
  precio_min?: string;
  precio_max?: string;
  habitaciones?: string;
  orden?: string;
}

// Cookie-free query → safe to run inside an unstable_cache scope.
async function queryPropiedades(f: PropiedadFilters): Promise<Propiedad[]> {
  const supabase = createPublicClient();

  // Map view needs only marker fields + coords; grid view needs the card fields.
  const columns = f.isMapa
    ? 'id, referencia, titulo, precio, operacion, zona, lat, lng, propiedad_fotos(url, es_portada, orden)'
    : 'id, referencia, titulo, precio, operacion, zona, tipo, estado, habitaciones, banos, metros, propiedad_fotos(url, es_portada, orden)';

  // Filter methods all return the same builder type, so reassignment stays typed.
  let query = supabase.from('propiedades').select(columns).neq('estado', 'oculta');

  if (f.isMapa) query = query.not('lat', 'is', null).not('lng', 'is', null);
  if (f.operacion) query = query.eq('operacion', f.operacion);
  if (f.tipo) query = query.eq('tipo', f.tipo);
  if (f.zona) query = query.ilike('zona', `%${f.zona}%`);
  if (f.precio_min) query = query.gte('precio', Number(f.precio_min));
  if (f.precio_max) query = query.lte('precio', Number(f.precio_max));
  if (f.habitaciones) query = query.gte('habitaciones', Number(f.habitaciones));

  const sorted =
    f.orden === 'precio_asc'
      ? query.order('precio', { ascending: true })
      : f.orden === 'precio_desc'
        ? query.order('precio', { ascending: false })
        : query.order('created_at', { ascending: false });

  const { data } = await sorted;
  return (data as unknown as Propiedad[]) ?? [];
}

// Cached per filter combination (the filters object is part of the cache key),
// so the unfiltered view — the most visited — is served without re-hitting
// Supabase. Refreshes at most every 5 min, or instantly on tag invalidation.
export const getPropiedadesList = unstable_cache(
  queryPropiedades,
  ['propiedades-list'],
  { tags: [PROPIEDADES_TAG], revalidate: 300 }
);
