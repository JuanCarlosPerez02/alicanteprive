import { getTranslations } from 'next-intl/server';
import { createPublicClient } from '@/lib/supabase/public';
import PropertyCard from '@/components/public/PropertyCard';
import FilterBar from '@/components/public/FilterBar';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { Propiedad } from '@/types';
import { getCoverPhoto, getLocalizedText } from '@/lib/utils';
import type { MapProperty } from '@/components/public/PropertiesMapView';
import PropertiesMapWrapper from '@/components/public/PropertiesMapWrapper';
import { LayoutGrid, Map } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('properties_title') };
}

interface SearchParams {
  operacion?: string;
  tipo?: string;
  zona?: string;
  precio_min?: string;
  precio_max?: string;
  habitaciones?: string;
  orden?: string;
  vista?: string;
}

export default async function PropiedadesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: 'properties' });

  const isMapa = sp.vista === 'mapa';

  const supabase = createPublicClient();

  // Shared filter/sort logic applied to whichever query branch runs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function withFilters(q: any): any {
    if (sp.operacion) q = q.eq('operacion', sp.operacion);
    if (sp.tipo) q = q.eq('tipo', sp.tipo);
    if (sp.zona) q = q.ilike('zona', `%${sp.zona}%`);
    if (sp.precio_min) q = q.gte('precio', Number(sp.precio_min));
    if (sp.precio_max) q = q.lte('precio', Number(sp.precio_max));
    if (sp.habitaciones) q = q.gte('habitaciones', Number(sp.habitaciones));
    if (sp.orden === 'precio_asc') q = q.order('precio', { ascending: true });
    else if (sp.orden === 'precio_desc') q = q.order('precio', { ascending: false });
    else q = q.order('created_at', { ascending: false });
    return q;
  }

  let propiedades: Propiedad[];

  if (isMapa) {
    // Map view: only fields needed for markers + cover photo, pre-filter by coordinates
    const { data } = await withFilters(
      supabase
        .from('propiedades')
        .select('id, referencia, titulo, precio, operacion, zona, lat, lng, propiedad_fotos(url, es_portada, orden)')
        .neq('estado', 'oculta')
        .not('lat', 'is', null)
        .not('lng', 'is', null)
    );
    propiedades = (data as unknown as Propiedad[]) ?? [];
  } else {
    // Grid view: fields needed by PropertyCard + cover photo
    const { data } = await withFilters(
      supabase
        .from('propiedades')
        .select('id, referencia, titulo, precio, operacion, zona, tipo, estado, habitaciones, banos, metros, propiedad_fotos(url, es_portada, orden)')
        .neq('estado', 'oculta')
    );
    propiedades = (data as unknown as Propiedad[]) ?? [];
  }

  // Build URL helpers for vista toggle (preserve all current filters)
  function buildUrl(vista: string) {
    const cur = new URLSearchParams();
    if (sp.operacion) cur.set('operacion', sp.operacion);
    if (sp.tipo) cur.set('tipo', sp.tipo);
    if (sp.zona) cur.set('zona', sp.zona);
    if (sp.precio_min) cur.set('precio_min', sp.precio_min);
    if (sp.precio_max) cur.set('precio_max', sp.precio_max);
    if (sp.habitaciones) cur.set('habitaciones', sp.habitaciones);
    if (sp.orden) cur.set('orden', sp.orden);
    if (vista) cur.set('vista', vista);
    const qs = cur.toString();
    return `/propiedades${qs ? `?${qs}` : ''}`;
  }

  // Serialize map properties (only those with coords)
  const mapProperties: MapProperty[] = propiedades
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      id: p.id,
      referencia: p.referencia,
      titulo: getLocalizedText(p.titulo, locale),
      precio: p.precio,
      operacion: p.operacion,
      zona: p.zona,
      lat: p.lat!,
      lng: p.lng!,
      coverUrl: getCoverPhoto(p.propiedad_fotos ?? []),
      locale,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-gold text-xs tracking-[0.25em] uppercase font-sans mb-2">Costa Blanca</p>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2 text-sm">{t('subtitle')}</p>
        </div>
        {/* Vista toggle */}
        <div className="flex items-center gap-1 border border-border rounded-sm p-0.5 shrink-0">
          <Link
            href={buildUrl('')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors
              ${!isMapa ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Lista
          </Link>
          <Link
            href={buildUrl('mapa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors
              ${isMapa ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Map className="w-3.5 h-3.5" />
            Mapa
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Suspense>
        <FilterBar />
      </Suspense>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        {propiedades.length} {propiedades.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
        {isMapa && mapProperties.length < propiedades.length && (
          <span className="ml-2 text-muted-foreground/60">
            · {mapProperties.length} con ubicación en el mapa
          </span>
        )}
      </p>

      {/* Content */}
      {isMapa ? (
        <PropertiesMapWrapper properties={mapProperties} />
      ) : propiedades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propiedades.map((p) => (
            <PropertyCard key={p.id} propiedad={p} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-muted-foreground">{t('no_results')}</p>
        </div>
      )}
    </div>
  );
}
