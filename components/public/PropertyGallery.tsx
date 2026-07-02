'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface Photo {
  url: string;
  orden: number;
  es_portada: boolean;
}

interface Props {
  fotos: Photo[];
  titulo: string;
  zona?: string;
  tipo?: string;
  operacion?: string;
}

export default function PropertyGallery({ fotos, titulo, zona, tipo, operacion }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const sorted = [...fotos].sort((a, b) => a.orden - b.orden);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + sorted.length) % sorted.length));
  }, [sorted.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % sorted.length));
  }, [sorted.length]);

  const mobilePrev = () => setMobileIndex((i) => (i - 1 + sorted.length) % sorted.length);
  const mobileNext = () => setMobileIndex((i) => (i + 1) % sorted.length);

  // Swipe navigation inside the lightbox (mobile)
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    // Lock background scroll while the lightbox is open
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, prev, next]);

  if (sorted.length === 0) {
    return (
      <div className="h-80 bg-muted flex items-center justify-center text-muted-foreground text-sm rounded-sm">
        Sin fotos
      </div>
    );
  }

  const cover = sorted[0];
  const rest = sorted.slice(1, 5);

  return (
    <>
      {/* ─── Mobile: single-image slider ─────────────────────────── */}
      <div className="md:hidden relative h-72 sm:h-80 bg-muted rounded-sm overflow-hidden">
        <button
          onClick={() => openLightbox(mobileIndex)}
          className="block w-full h-full"
          aria-label="Ampliar foto"
        >
          <Image
            src={sorted[mobileIndex].url}
            alt={mobileIndex === 0 && zona ? `${tipo ?? ''} ${operacion ?? ''} en ${zona} — ${titulo}`.trim() : `${titulo} — foto ${mobileIndex + 1}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority={mobileIndex === 0}
          />
        </button>

        {sorted.length > 1 && (
          <>
            {/* Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); mobilePrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
              aria-label="Anterior"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); mobileNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {sorted.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === mobileIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full tabular-nums">
              {mobileIndex + 1}/{sorted.length}
            </p>
          </>
        )}
      </div>

      {/* ─── Desktop: 1-large + 4-small grid ─────────────────────── */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[480px] lg:h-[540px] rounded-sm overflow-hidden">
        {/* Main photo */}
        <button
          onClick={() => openLightbox(0)}
          className="col-span-2 row-span-2 relative group overflow-hidden"
          aria-label="Ver foto 1"
        >
          <Image
            src={cover.url}
            alt={zona ? `${tipo ?? ''} ${operacion ?? ''} en ${zona} — ${titulo}`.trim() : titulo}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        {/* Secondary photos */}
        {rest.map((foto, i) => (
          <button
            key={foto.url}
            onClick={() => openLightbox(i + 1)}
            className="relative group overflow-hidden"
            aria-label={`Ver foto ${i + 2}`}
          >
            <Image
              src={foto.url}
              alt={`${titulo} — foto ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {i === rest.length - 1 && sorted.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold gap-2">
                <Expand className="w-4 h-4" />
                +{sorted.length - 5}
              </div>
            )}
          </button>
        ))}

        {/* Fill empty cells */}
        {rest.length < 4 &&
          Array.from({ length: 4 - rest.length }).map((_, i) => (
            <div key={i} className="bg-muted" />
          ))}
      </div>

      {/* ─── Lightbox (shared) ────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={closeLightbox}
        >
          {/* Top bar: counter + close */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 text-sm tabular-nums">
              {lightboxIndex + 1} / {sorted.length}
            </p>
            <button
              onClick={closeLightbox}
              aria-label="Cerrar"
              className="text-white/90 hover:text-white bg-white/10 hover:bg-white/25 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image area — fills the remaining space; image is centred & contained.
              All images stay mounted so the browser can prefetch them in parallel. */}
          <div
            className="relative flex-1 min-h-0"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {sorted.map((foto, i) => (
              <div
                key={foto.url}
                onClick={closeLightbox}
                className={`absolute inset-0 p-2 sm:p-6 transition-opacity duration-150 ${
                  i === lightboxIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={foto.url}
                    alt={i === lightboxIndex ? `${titulo} — foto ${i + 1}` : ''}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={i === lightboxIndex}
                  />
                </div>
              </div>
            ))}

            {sorted.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Anterior"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2 sm:p-3 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Siguiente"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2 sm:p-3 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail dots */}
          {sorted.length > 1 && (
            <div
              className="shrink-0 flex flex-wrap justify-center gap-1.5 px-4 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {sorted.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
