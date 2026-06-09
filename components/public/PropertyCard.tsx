import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Bed, Bath, Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getLocalizedText, formatPrice, getCoverPhoto } from '@/lib/utils';
import type { Propiedad } from '@/types';

interface Props {
  propiedad: Propiedad;
  locale: string;
}

const STATUS_BADGE: Record<string, string> = {
  vendida: 'bg-gray-800 text-white',
  alquilada: 'bg-gray-800 text-white',
  reservada: 'bg-amber-700 text-white',
};

export default function PropertyCard({ propiedad, locale }: Props) {
  const tProps = useTranslations('properties');
  const tOps = useTranslations('operations');
  const tTypes = useTranslations('types');

  const coverUrl = getCoverPhoto(propiedad.propiedad_fotos ?? []);
  const titulo = getLocalizedText(propiedad.titulo, locale);
  const badgeClass = STATUS_BADGE[propiedad.estado];

  return (
    <Link
      href={`/propiedades/${propiedad.referencia}`}
      className="group block bg-card border border-border rounded-sm overflow-hidden card-hover"
    >
      {/* Photo */}
      <div className="relative h-56 bg-muted overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${tTypes(propiedad.tipo as Parameters<typeof tTypes>[0])} en ${tOps(propiedad.operacion as Parameters<typeof tOps>[0]).toLowerCase()}${propiedad.zona ? ` en ${propiedad.zona}` : ' en Alicante'} — ${titulo}`}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Sin foto
          </div>
        )}

        {/* Status badge */}
        {badgeClass && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-sm ${badgeClass}`}>
            {tProps(`status.${propiedad.estado}` as Parameters<typeof tProps>[0])}
          </span>
        )}

        {/* Operation badge */}
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-sm bg-gold text-gold-foreground">
          {tOps(propiedad.operacion)}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {propiedad.zona && (
          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
            {propiedad.zona}
          </p>
        )}
        <h3 className="font-heading text-lg font-semibold leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {titulo}
        </h3>

        <p className="text-2xl font-bold mb-4 text-primary">
          {formatPrice(propiedad.precio, locale)}
          {propiedad.operacion === 'alquiler' && (
            <span className="text-sm font-normal text-muted-foreground ml-1">/mes</span>
          )}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
          {propiedad.habitaciones && (
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {propiedad.habitaciones}
            </span>
          )}
          {propiedad.banos && (
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {propiedad.banos}
            </span>
          )}
          {propiedad.metros && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-4 h-4" />
              {propiedad.metros} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
