'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';

const TIPOS = [
  'piso', 'casa', 'atico', 'villa', 'chalet',
  'adosado', 'duplex', 'estudio', 'local',
];

const PRICE_STEPS = [
  100_000, 150_000, 200_000, 250_000, 300_000,
  400_000, 500_000, 750_000, 1_000_000, 1_500_000,
];

function fmt(n: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(n);
}

interface DropdownProps {
  label: string;
  active?: boolean;
  children: React.ReactNode;
}

function Dropdown({ label, active, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-sm border transition-colors whitespace-nowrap
          ${active
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-background text-foreground hover:border-primary/50'
          }`}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-sm shadow-lg py-1 min-w-[200px]">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export default function FilterBar() {
  const t = useTranslations('properties');
  const tTypes = useTranslations('types');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [zonaInput, setZonaInput] = useState(params.get('zona') ?? '');

  const cur = {
    operacion: params.get('operacion') ?? '',
    tipo: params.get('tipo') ?? '',
    zona: params.get('zona') ?? '',
    precio_min: params.get('precio_min') ?? '',
    precio_max: params.get('precio_max') ?? '',
    habitaciones: params.get('habitaciones') ?? '',
    orden: params.get('orden') ?? '',
  };

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      // preserve vista param
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  // Debounce zona: update URL only after user stops typing for 400ms
  useEffect(() => {
    const currentZona = params.get('zona') ?? '';
    if (zonaInput === currentZona) return;
    const timer = setTimeout(() => update('zona', zonaInput), 400);
    return () => clearTimeout(timer);
  }, [zonaInput, params, update]);

  const clearZona = () => {
    setZonaInput('');
    update('zona', '');
  };

  const clearAll = () => {
    setZonaInput('');
    const next = new URLSearchParams();
    const vista = params.get('vista');
    if (vista) next.set('vista', vista);
    router.replace(`${pathname}${next.toString() ? '?' + next.toString() : ''}`, { scroll: false });
  };

  const activeFilters = [
    cur.tipo, cur.zona, cur.precio_min, cur.precio_max, cur.habitaciones, cur.orden,
  ].filter(Boolean).length;

  const inputClass = 'w-full border border-border rounded-sm px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary/60 transition-colors';
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="mb-8">
      {/* Row 1: Operation toggles + mobile button */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {(['', 'venta', 'alquiler'] as const).map((op) => {
          const label = op === '' ? t('filters.all_operations') : op === 'venta' ? 'Venta' : 'Alquiler';
          return (
            <button
              key={op}
              onClick={() => update('operacion', op)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-sm border transition-colors
                ${cur.operacion === op
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
            >
              {label}
            </button>
          );
        })}

        {/* Desktop separator */}
        <div className="w-px h-5 bg-border mx-1 hidden md:block" />

        {/* Desktop: inline filter dropdowns */}
        <div className="hidden md:flex flex-wrap items-center gap-2">
          <Dropdown
            label={cur.tipo ? tTypes(cur.tipo as Parameters<typeof tTypes>[0]) : t('filters.type')}
            active={!!cur.tipo}
          >
            <button onClick={() => update('tipo', '')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${!cur.tipo ? 'font-semibold text-primary' : ''}`}>
              {t('filters.all_types')}
            </button>
            {TIPOS.map((tipo) => (
              <button key={tipo} onClick={() => update('tipo', tipo)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${cur.tipo === tipo ? 'font-semibold text-primary' : ''}`}>
                {tTypes(tipo as Parameters<typeof tTypes>[0])}
              </button>
            ))}
          </Dropdown>

          <Dropdown
            label={cur.precio_min || cur.precio_max
              ? `${cur.precio_min ? fmt(+cur.precio_min) : '0'} – ${cur.precio_max ? fmt(+cur.precio_max) : '∞'}`
              : t('filters.price_range')}
            active={!!(cur.precio_min || cur.precio_max)}
          >
            <div className="px-4 py-3 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">{t('filters.min_price')}</p>
                <select value={cur.precio_min} onChange={(e) => update('precio_min', e.target.value)}
                  className="w-full border border-border rounded-sm px-2 py-1.5 text-sm focus:outline-none">
                  <option value="">Sin mínimo</option>
                  {PRICE_STEPS.map((p) => <option key={p} value={p}>{fmt(p)}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">{t('filters.max_price')}</p>
                <select value={cur.precio_max} onChange={(e) => update('precio_max', e.target.value)}
                  className="w-full border border-border rounded-sm px-2 py-1.5 text-sm focus:outline-none">
                  <option value="">Sin máximo</option>
                  {PRICE_STEPS.map((p) => <option key={p} value={p}>{fmt(p)}</option>)}
                </select>
              </div>
            </div>
          </Dropdown>

          <Dropdown label={cur.habitaciones ? `${cur.habitaciones}+ hab.` : t('filters.bedrooms')} active={!!cur.habitaciones}>
            <button onClick={() => update('habitaciones', '')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted ${!cur.habitaciones ? 'font-semibold text-primary' : ''}`}>
              {t('filters.any_bedrooms')}
            </button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => update('habitaciones', String(n))}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted ${cur.habitaciones === String(n) ? 'font-semibold text-primary' : ''}`}>
                {n}+ hab.
              </button>
            ))}
          </Dropdown>

          <div className="relative">
            <input
              type="text"
              value={zonaInput}
              onChange={(e) => setZonaInput(e.target.value)}
              placeholder="Zona"
              className="border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary/50 w-32 transition-colors"
            />
            {zonaInput && (
              <button onClick={clearZona} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <Dropdown label={cur.orden === 'precio_asc' ? '↑ Precio' : cur.orden === 'precio_desc' ? '↓ Precio' : t('sort.newest')} active={!!cur.orden}>
            {[
              { value: '', label: t('sort.newest') },
              { value: 'precio_asc', label: t('sort.price_asc') },
              { value: 'precio_desc', label: t('sort.price_desc') },
            ].map((opt) => (
              <button key={opt.value} onClick={() => update('orden', opt.value)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted ${cur.orden === opt.value ? 'font-semibold text-primary' : ''}`}>
                {opt.label}
              </button>
            ))}
          </Dropdown>

          {activeFilters > 0 && (
            <button onClick={clearAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-3.5 h-3.5" />
              Limpiar ({activeFilters})
            </button>
          )}
        </div>

        {/* Mobile: single "Filtros" toggle button */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          {activeFilters > 0 && (
            <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-sm border transition-colors
              ${mobileOpen || activeFilters > 0
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-foreground hover:border-primary/50'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFilters > 0 && (
              <span className="ml-0.5 bg-white/20 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile expanded filter panel */}
      {mobileOpen && (
        <div className="md:hidden rounded-sm border border-border bg-card p-4 space-y-4 shadow-sm">
          <div>
            <label className={labelClass}>Tipo de propiedad</label>
            <select value={cur.tipo} onChange={(e) => update('tipo', e.target.value)} className={inputClass}>
              <option value="">{t('filters.all_types')}</option>
              {TIPOS.map((tipo) => (
                <option key={tipo} value={tipo}>{tTypes(tipo as Parameters<typeof tTypes>[0])}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Precio mín.</label>
              <select value={cur.precio_min} onChange={(e) => update('precio_min', e.target.value)} className={inputClass}>
                <option value="">Sin mínimo</option>
                {PRICE_STEPS.map((p) => <option key={p} value={p}>{fmt(p)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Precio máx.</label>
              <select value={cur.precio_max} onChange={(e) => update('precio_max', e.target.value)} className={inputClass}>
                <option value="">Sin máximo</option>
                {PRICE_STEPS.map((p) => <option key={p} value={p}>{fmt(p)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Habitaciones mín.</label>
            <div className="flex gap-2">
              {['', '1', '2', '3', '4', '5'].map((n) => (
                <button
                  key={n}
                  onClick={() => update('habitaciones', n)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-sm border transition-colors
                    ${cur.habitaciones === n
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'}`}
                >
                  {n === '' ? 'Todos' : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Zona</label>
            <input
              type="text"
              value={zonaInput}
              onChange={(e) => setZonaInput(e.target.value)}
              placeholder="Ej: Cabo de las Huertas"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Ordenar por</label>
            <select value={cur.orden} onChange={(e) => update('orden', e.target.value)} className={inputClass}>
              <option value="">{t('sort.newest')}</option>
              <option value="precio_asc">{t('sort.price_asc')}</option>
              <option value="precio_desc">{t('sort.price_desc')}</option>
            </select>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            Ver resultados
          </button>
        </div>
      )}
    </div>
  );
}
