import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { getLocalizedText, formatPrice } from '@/lib/utils';
import PropertyGallery from '@/components/public/PropertyGallery';
import PropertyMap from '@/components/public/PropertyMap';
import ContactForm from '@/components/public/ContactForm';
import {
  Bed, Bath, Maximize2, MapPin, Tag,
  ArrowUpDown, Waves, Car, Leaf, Wind, Flame,
  Package, Shield, Eye, Anchor, Sofa, LayoutGrid,
  Sun, Sparkles, type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { Propiedad } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; referencia: string }>;
}): Promise<Metadata> {
  const { locale, referencia } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('propiedades')
    .select('titulo, descripcion, propiedad_fotos(url, es_portada)')
    .eq('referencia', referencia)
    .neq('estado', 'oculta')
    .single();

  if (!data) return {};

  const titulo = getLocalizedText(data.titulo, locale);
  const descripcion = getLocalizedText(data.descripcion, locale);
  const coverFoto = (data.propiedad_fotos as { url: string; es_portada: boolean }[])?.find((f) => f.es_portada);

  return {
    title: titulo,
    description: descripcion.substring(0, 160),
    openGraph: {
      title: titulo,
      description: descripcion.substring(0, 160),
      images: coverFoto ? [{ url: coverFoto.url }] : [],
    },
  };
}

const FEATURE_ICONS: Record<string, LucideIcon> = {
  ascensor: ArrowUpDown,
  terraza: Sun,
  piscina: Waves,
  garaje: Car,
  jardin: Leaf,
  aire_acondicionado: Wind,
  calefaccion: Flame,
  trastero: Package,
  portero: Shield,
  vistas_al_mar: Eye,
  primera_linea: Anchor,
  amueblado: Sofa,
  armarios: LayoutGrid,
  exterior: Sun,
  luminoso: Sparkles,
};

export default async function PropiedadPage({
  params,
}: {
  params: Promise<{ locale: string; referencia: string }>;
}) {
  const { locale, referencia } = await params;
  const t = await getTranslations({ locale, namespace: 'property' });
  const tOps = await getTranslations({ locale, namespace: 'operations' });
  const tTypes = await getTranslations({ locale, namespace: 'types' });
  const tFeatures = await getTranslations({ locale, namespace: 'features' });
  const tContact = await getTranslations({ locale, namespace: 'contact' });

  const supabase = await createClient();
  const { data } = await supabase
    .from('propiedades')
    .select('*, propiedad_fotos(*)')
    .eq('referencia', referencia)
    .neq('estado', 'oculta')
    .single();

  if (!data) notFound();

  const propiedad = data as Propiedad;
  const titulo = getLocalizedText(propiedad.titulo, locale);
  const descripcion = getLocalizedText(propiedad.descripcion, locale);
  const caracteristicas: string[] = Array.isArray(propiedad.caracteristicas)
    ? propiedad.caracteristicas
    : [];

  const isSold = ['vendida', 'alquilada'].includes(propiedad.estado);

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <a href={`/${locale}/propiedades`} className="hover:text-gold transition-colors">
          Propiedades
        </a>
        <span>/</span>
        <span className="text-foreground truncate">{titulo}</span>
      </nav>

      {/* Gallery */}
      <div className="mb-8">
        <PropertyGallery fotos={propiedad.propiedad_fotos ?? []} titulo={titulo} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title + price */}
          <div>
            {propiedad.zona && (
              <p className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
                <MapPin className="w-3.5 h-3.5" />
                {propiedad.zona}
              </p>
            )}
            <h1 className="font-heading text-3xl md:text-4xl font-semibold leading-snug mb-4">
              {titulo}
            </h1>

            {isSold && (
              <span className="inline-block bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-sm mb-4">
                {t(`${propiedad.estado}_label` as Parameters<typeof t>[0])}
              </span>
            )}

            <p className="text-3xl font-bold text-primary">
              {formatPrice(propiedad.precio, locale)}
              {propiedad.operacion === 'alquiler' && (
                <span className="text-base font-normal text-muted-foreground ml-1">/mes</span>
              )}
            </p>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Bed, label: t('beds'), value: propiedad.habitaciones },
              { icon: Bath, label: t('baths'), value: propiedad.banos },
              { icon: Maximize2, label: t('sqm'), value: propiedad.metros ? `${propiedad.metros} m²` : null },
              { icon: Tag, label: t('ref'), value: propiedad.referencia },
            ].map(({ icon: Icon, label, value }) =>
              value ? (
                <div key={label} className="bg-muted/50 rounded-sm px-4 py-3 flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-semibold text-sm">{value}</p>
                  </div>
                </div>
              ) : null
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm py-4 border-t border-border">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">{t('operation')}</span>
              <span className="font-medium">{tOps(propiedad.operacion)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">{t('type')}</span>
              <span className="font-medium">{tTypes(propiedad.tipo as Parameters<typeof tTypes>[0])}</span>
            </div>
            {propiedad.zona && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">{t('zone')}</span>
                <span className="font-medium">{propiedad.zona}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {descripcion && (
            <div>
              <h2 className="font-heading text-xl font-semibold mb-3">{t('description')}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{descripcion}</p>
            </div>
          )}

          {/* Features */}
          {caracteristicas.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">{t('features')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {caracteristicas.map((c) => {
                  const Icon = FEATURE_ICONS[c];
                  return (
                    <div key={c} className="flex items-center gap-2.5 text-sm py-2.5 px-3 bg-muted/40 rounded-sm">
                      {Icon
                        ? <Icon className="w-4 h-4 text-gold shrink-0" />
                        : <span className="w-4 h-4 shrink-0 flex items-center justify-center text-gold font-bold text-xs">✓</span>
                      }
                      <span>{tFeatures(c as Parameters<typeof tFeatures>[0])}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map */}
          {propiedad.lat && propiedad.lng && (
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">{t('location')}</h2>
              <PropertyMap lat={propiedad.lat} lng={propiedad.lng} titulo={titulo} />
              {propiedad.zona && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {propiedad.zona}{propiedad.direccion ? ` · ${propiedad.direccion}` : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar — Contact form */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-card border border-border rounded-sm p-6">
            <p className="text-gold text-xs tracking-[0.2em] uppercase font-sans mb-1">
              Alicante Privé
            </p>
            <h3 className="font-heading text-xl font-semibold mb-1">{t('contact_title')}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t('contact_subtitle')}</p>
            <ContactForm propiedadId={propiedad.id} propiedadReferencia={propiedad.referencia} />
          </div>
        </div>
      </div>
    </article>
  );
}
