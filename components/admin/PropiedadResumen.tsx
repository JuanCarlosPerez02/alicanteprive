'use client';

import { ExternalLink, MapPin, Home, Ruler, Bath, BedDouble, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Propiedad } from '@/types';

const ESTADO_BADGE: Record<string, string> = {
  disponible: 'bg-emerald-100 text-emerald-800',
  reservada: 'bg-amber-100 text-amber-800',
  vendida: 'bg-blue-100 text-blue-800',
  alquilada: 'bg-violet-100 text-violet-800',
  oculta: 'bg-gray-200 text-gray-700',
};

const LABELS: Record<string, string> = {
  ascensor: 'Ascensor', terraza: 'Terraza', piscina: 'Piscina', garaje: 'Garaje',
  jardin: 'Jardín', aire_acondicionado: 'A/C', calefaccion: 'Calefacción',
  trastero: 'Trastero', portero: 'Portero', vistas_al_mar: 'Vistas al mar',
  primera_linea: 'Primera línea', amueblado: 'Amueblado', armarios: 'Armarios',
  exterior: 'Exterior', luminoso: 'Luminoso',
};

interface Props {
  propiedad: Propiedad;
  locale: string;
}

export default function PropiedadResumen({ propiedad: p, locale }: Props) {
  const titulo = typeof p.titulo === 'object'
    ? (p.titulo as Record<string, string>).es
      || (p.titulo as Record<string, string>).en
      || p.referencia
    : p.referencia;

  const descripcion = typeof p.descripcion === 'object'
    ? (p.descripcion as Record<string, string>).es
      || (p.descripcion as Record<string, string>).en
      || ''
    : '';

  const fotos = (p.propiedad_fotos ?? []).sort((a, b) => a.orden - b.orden);
  const cover = fotos.find((f) => f.es_portada)?.url ?? fotos[0]?.url;

  return (
    <div className="space-y-5">
      {/* Cover + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">
        {/* Cover photo */}
        <div className="aspect-[4/3] rounded-sm overflow-hidden bg-muted border border-border">
          {cover ? (
            <img src={cover} alt={titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[p.estado] ?? 'bg-muted text-muted-foreground'}`}>
              {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground capitalize">
              {p.tipo}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground capitalize">
              {p.operacion}
            </span>
            {p.destacada && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gold/15 text-amber-700 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Destacada
              </span>
            )}
          </div>

          {/* Price */}
          <p className="font-heading text-3xl font-bold text-primary">
            {formatPrice(p.precio, 'es')}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {p.metros && (
              <span className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4" /> {p.metros} m²
              </span>
            )}
            {p.habitaciones && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" /> {p.habitaciones} hab.
              </span>
            )}
            {p.banos && (
              <span className="flex items-center gap-1.5">
                <Bath className="w-4 h-4" /> {p.banos} baños
              </span>
            )}
          </div>

          {/* Location */}
          {(p.zona || p.direccion) && (
            <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{[p.zona, p.direccion].filter(Boolean).join(' — ')}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`/${locale}/propiedades/${p.referencia}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-sm hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver en la web
            </a>
          </div>
        </div>
      </div>

      {/* Description */}
      {descripcion && (
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Descripción</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">{descripcion}</p>
        </div>
      )}

      {/* Features */}
      {Array.isArray(p.caracteristicas) && p.caracteristicas.length > 0 && (
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Características</h3>
          <div className="flex flex-wrap gap-2">
            {(p.caracteristicas as string[]).map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 rounded-sm border border-border text-xs font-medium bg-muted/50"
              >
                {LABELS[c] ?? c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Photo strip */}
      {fotos.length > 1 && (
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Fotos ({fotos.length})
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {fotos.map((f) => (
              <img
                key={f.id}
                src={f.url}
                alt=""
                className="h-20 w-32 object-cover rounded-sm shrink-0 border border-border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
