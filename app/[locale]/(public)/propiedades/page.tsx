import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPropiedadesList, PAGE_SIZE } from '@/lib/propiedades';
import { routing } from '@/i18n/routing';
import PropertyCard from '@/components/public/PropertyCard';
import FilterBar from '@/components/public/FilterBar';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCoverPhoto, getLocalizedText } from '@/lib/utils';
import type { MapProperty } from '@/components/public/PropertiesMapView';
import PropertiesMapWrapper from '@/components/public/PropertiesMapWrapper';
import { LayoutGrid, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('properties_title'),
    alternates: {
      canonical: `/${locale}/propiedades`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/propiedades`])),
    },
  };
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
  page?: string;
}

export default async function PropiedadesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: 'properties' });

  const isMapa = sp.vista === 'mapa';
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);

  // Cached per filter combination (invalidated on admin edits via PROPIEDADES_TAG).
  // The page stays dynamic for searchParams, but the Supabase query is reused.
  const { propiedades, total } = await getPropiedadesList({
    isMapa,
    page,
    operacion: sp.operacion,
    tipo: sp.tipo,
    zona: sp.zona,
    precio_min: sp.precio_min,
    precio_max: sp.precio_max,
    habitaciones: sp.habitaciones,
    orden: sp.orden,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Build URL helpers preserving current filters. `vista` switches view (and
  // resets the page); `pageNum` paginates within the current view.
  function buildUrl({ vista = sp.vista ?? '', pageNum = 0 }: { vista?: string; pageNum?: number }) {
    const cur = new URLSearchParams();
    if (sp.operacion) cur.set('operacion', sp.operacion);
    if (sp.tipo) cur.set('tipo', sp.tipo);
    if (sp.zona) cur.set('zona', sp.zona);
    if (sp.precio_min) cur.set('precio_min', sp.precio_min);
    if (sp.precio_max) cur.set('precio_max', sp.precio_max);
    if (sp.habitaciones) cur.set('habitaciones', sp.habitaciones);
    if (sp.orden) cur.set('orden', sp.orden);
    if (vista) cur.set('vista', vista);
    if (pageNum > 1) cur.set('page', String(pageNum));
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
            href={buildUrl({ vista: '' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors
              ${!isMapa ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Lista
          </Link>
          <Link
            href={buildUrl({ vista: 'mapa' })}
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
        {total} {total === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propiedades.map((p) => (
              <PropertyCard key={p.id} propiedad={p} locale={locale} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-4 mt-12" aria-label="Paginación">
              {page > 1 ? (
                <Link
                  href={buildUrl({ pageNum: page - 1 })}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-semibold border border-border rounded-sm hover:border-primary/50 hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('prev')}
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-sm font-semibold border border-border rounded-sm text-muted-foreground/40">
                  <ChevronLeft className="w-4 h-4" />
                  {t('prev')}
                </span>
              )}

              <span className="text-sm text-muted-foreground tabular-nums">
                {t('page_info', { page, total: totalPages })}
              </span>

              {page < totalPages ? (
                <Link
                  href={buildUrl({ pageNum: page + 1 })}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-semibold border border-border rounded-sm hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {t('next')}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-sm font-semibold border border-border rounded-sm text-muted-foreground/40">
                  {t('next')}
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-muted-foreground">{t('no_results')}</p>
        </div>
      )}
    </div>
  );
}
