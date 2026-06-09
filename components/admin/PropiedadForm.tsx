'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Languages, Loader2, CheckCircle2 } from 'lucide-react';
import type { Propiedad } from '@/types';

const MYMEMORY_EMAIL = 'jcperez@yodeyma.com';
const TARGET_LANGS = ['en', 'fr', 'de'];

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text.trim()) return '';
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}&de=${MYMEMORY_EMAIL}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData?.translatedText ?? text;
  } catch {
    return text;
  }
}

const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
];

const TIPOS = ['piso', 'casa', 'atico', 'villa', 'chalet', 'adosado', 'duplex', 'estudio', 'local'];
const ESTADOS = ['disponible', 'reservada', 'vendida', 'alquilada', 'oculta'];
const CARACTERISTICAS = [
  'ascensor', 'terraza', 'piscina', 'garaje', 'jardin',
  'aire_acondicionado', 'calefaccion', 'trastero', 'portero',
  'vistas_al_mar', 'primera_linea', 'amueblado', 'armarios',
  'exterior', 'luminoso',
];
const LABELS: Record<string, string> = {
  ascensor: 'Ascensor', terraza: 'Terraza', piscina: 'Piscina', garaje: 'Garaje',
  jardin: 'Jardín', aire_acondicionado: 'Aire acondicionado', calefaccion: 'Calefacción',
  trastero: 'Trastero', portero: 'Portero', vistas_al_mar: 'Vistas al mar',
  primera_linea: 'Primera línea', amueblado: 'Amueblado', armarios: 'Armarios empotrados',
  exterior: 'Exterior', luminoso: 'Luminoso',
};

type FormState = {
  referencia: string; operacion: string; tipo: string; precio: string;
  zona: string; direccion: string; metros: string; habitaciones: string;
  banos: string; estado: string; destacada: boolean;
  referencia_idealista: string; referencia_fotocasa: string;
  titulo: Record<string, string>; descripcion: Record<string, string>;
  caracteristicas: string[]; lat: string; lng: string;
};

function toFormState(p?: Propiedad): FormState {
  return {
    referencia: p?.referencia ?? '',
    operacion: p?.operacion ?? 'venta',
    tipo: p?.tipo ?? 'piso',
    precio: p?.precio?.toString() ?? '',
    zona: p?.zona ?? '',
    direccion: p?.direccion ?? '',
    metros: p?.metros?.toString() ?? '',
    habitaciones: p?.habitaciones?.toString() ?? '',
    banos: p?.banos?.toString() ?? '',
    estado: p?.estado ?? 'disponible',
    destacada: p?.destacada ?? false,
    referencia_idealista: p?.referencia_idealista ?? '',
    referencia_fotocasa: p?.referencia_fotocasa ?? '',
    titulo: (p?.titulo as Record<string, string>) ?? { es: '', en: '', fr: '', de: '' },
    descripcion: (p?.descripcion as Record<string, string>) ?? { es: '', en: '', fr: '', de: '' },
    caracteristicas: (p?.caracteristicas as string[]) ?? [],
    lat: p?.lat?.toString() ?? '',
    lng: p?.lng?.toString() ?? '',
  };
}

interface Props {
  propiedad?: Propiedad;
  locale: string;
}

export default function PropiedadForm({ propiedad, locale }: Props) {
  const isEdit = !!propiedad;
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(propiedad));
  const [activeLocale, setActiveLocale] = useState('es');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (savedAt) {
      const t = setTimeout(() => setSavedAt(null), 3000);
      return () => clearTimeout(t);
    }
  }, [savedAt]);

  async function handleAutoTranslate() {
    const tituloEs = form.titulo.es;
    const descripcionEs = form.descripcion.es;
    if (!tituloEs && !descripcionEs) return;
    setTranslating(true);
    const results = await Promise.all(
      TARGET_LANGS.map(async (lang) => {
        const [t, d] = await Promise.all([
          translateText(tituloEs, lang),
          translateText(descripcionEs, lang),
        ]);
        return { lang, titulo: t, descripcion: d };
      })
    );
    setForm((f) => {
      const nextTitulo = { ...f.titulo };
      const nextDesc = { ...f.descripcion };
      results.forEach(({ lang, titulo, descripcion }) => {
        nextTitulo[lang] = titulo;
        nextDesc[lang] = descripcion;
      });
      return { ...f, titulo: nextTitulo, descripcion: nextDesc };
    });
    setTranslating(false);
  }

  const set = (key: keyof FormState, val: unknown) => {
    setIsDirty(true);
    setForm((f) => ({ ...f, [key]: val }));
  };

  const setLang = (field: 'titulo' | 'descripcion', lang: string, val: string) => {
    setIsDirty(true);
    setForm((f) => ({ ...f, [field]: { ...f[field], [lang]: val } }));
  };

  const toggleCaract = (c: string) => {
    setIsDirty(true);
    set('caracteristicas', form.caracteristicas.includes(c)
      ? form.caracteristicas.filter((x) => x !== c)
      : [...form.caracteristicas, c]);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      precio: parseFloat(form.precio),
      metros: form.metros ? parseInt(form.metros) : null,
      habitaciones: form.habitaciones ? parseInt(form.habitaciones) : null,
      banos: form.banos ? parseInt(form.banos) : null,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
    };

    const url = isEdit
      ? `/api/admin/propiedades/${propiedad.id}`
      : '/api/admin/propiedades';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Error al guardar');
      setLoading(false);
      return;
    }

    if (!isEdit) {
      const { id } = await res.json();
      router.push(`/${locale}/admin/propiedades/${id}`);
    } else {
      setIsDirty(false);
      setSavedAt(new Date());
      router.refresh();
    }
    setLoading(false);
  }

  const inputClass = 'w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition';
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Identificación ──────────────────────── */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Identificación</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Referencia *</label>
            <input value={form.referencia} onChange={(e) => set('referencia', e.target.value)}
              className={inputClass} placeholder="AP-001" required disabled={isEdit} />
          </div>
          <div>
            <label className={labelClass}>Operación *</label>
            <select value={form.operacion} onChange={(e) => set('operacion', e.target.value)} className={inputClass}>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Tipo *</label>
            <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)} className={inputClass}>
              {TIPOS.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select value={form.estado} onChange={(e) => set('estado', e.target.value)} className={inputClass}>
              {ESTADOS.map((e) => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Precio (€) *</label>
            <input type="number" value={form.precio} onChange={(e) => set('precio', e.target.value)}
              className={inputClass} placeholder="350000" required min={0} />
          </div>
          <div>
            <label className={labelClass}>Zona</label>
            <input value={form.zona} onChange={(e) => set('zona', e.target.value)}
              className={inputClass} placeholder="Cabo de las Huertas" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Dirección</label>
            <input value={form.direccion} onChange={(e) => set('direccion', e.target.value)}
              className={inputClass} placeholder="Av. Costa Blanca, Alicante" />
          </div>
          <div className="flex items-center gap-3 self-end pb-2">
            <input type="checkbox" id="destacada" checked={form.destacada}
              onChange={(e) => set('destacada', e.target.checked)}
              className="w-4 h-4 accent-primary" />
            <label htmlFor="destacada" className="text-sm font-medium cursor-pointer">Propiedad destacada</label>
          </div>
        </div>
      </section>

      {/* ── Contenido (i18n) ─────────────────────── */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Título y descripción</h2>

        {/* Language tabs + translate button */}
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-border">
          <div className="flex gap-1">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setActiveLocale(code)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-sm transition-colors
                  ${activeLocale === code
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'}`}
              >
                {label}
                {form.titulo[code] && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={translating || (!form.titulo.es && !form.descripcion.es)}
            title="Traduce automáticamente el contenido en ES a EN, FR y DE"
            className="flex items-center gap-1.5 px-3 py-1.5 mb-1 text-xs font-semibold border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {translating
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Traduciendo...</>
              : <><Languages className="w-3.5 h-3.5" /> Auto-traducir desde ES</>}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Título ({activeLocale.toUpperCase()})</label>
            <input
              value={form.titulo[activeLocale] ?? ''}
              onChange={(e) => setLang('titulo', activeLocale, e.target.value)}
              className={inputClass}
              placeholder={`Título en ${activeLocale}`}
            />
          </div>
          <div>
            <label className={labelClass}>Descripción ({activeLocale.toUpperCase()})</label>
            <textarea
              rows={6}
              value={form.descripcion[activeLocale] ?? ''}
              onChange={(e) => setLang('descripcion', activeLocale, e.target.value)}
              className={inputClass}
              placeholder={`Descripción en ${activeLocale}`}
            />
          </div>
        </div>
      </section>

      {/* ── Dimensiones ──────────────────────────── */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Dimensiones</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Superficie (m²)</label>
            <input type="number" value={form.metros} onChange={(e) => set('metros', e.target.value)}
              className={inputClass} min={0} />
          </div>
          <div>
            <label className={labelClass}>Habitaciones</label>
            <input type="number" value={form.habitaciones} onChange={(e) => set('habitaciones', e.target.value)}
              className={inputClass} min={0} />
          </div>
          <div>
            <label className={labelClass}>Baños</label>
            <input type="number" value={form.banos} onChange={(e) => set('banos', e.target.value)}
              className={inputClass} min={0} />
          </div>
        </div>
      </section>

      {/* ── Características ──────────────────────── */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Características</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CARACTERISTICAS.map((c) => (
            <label key={c} className={`flex items-center gap-2 px-3 py-2 rounded-sm border cursor-pointer text-sm transition-colors
              ${form.caracteristicas.includes(c) ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border hover:border-primary/40'}`}>
              <input type="checkbox" className="sr-only"
                checked={form.caracteristicas.includes(c)}
                onChange={() => toggleCaract(c)} />
              {LABELS[c]}
            </label>
          ))}
        </div>
      </section>

      {/* ── Ubicación ────────────────────────────── */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Ubicación</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Latitud</label>
            <input type="number" step="any" value={form.lat} onChange={(e) => set('lat', e.target.value)}
              className={inputClass} placeholder="38.3780" />
          </div>
          <div>
            <label className={labelClass}>Longitud</label>
            <input type="number" step="any" value={form.lng} onChange={(e) => set('lng', e.target.value)}
              className={inputClass} placeholder="-0.4285" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Tip: busca la dirección en Google Maps, haz clic derecho y copia las coordenadas.
        </p>
      </section>

      {/* ── Portales ─────────────────────────────── */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Referencias en portales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Referencia Idealista</label>
            <input value={form.referencia_idealista} onChange={(e) => set('referencia_idealista', e.target.value)}
              className={inputClass} placeholder="12345678" />
          </div>
          <div>
            <label className={labelClass}>Referencia Fotocasa</label>
            <input value={form.referencia_fotocasa} onChange={(e) => set('referencia_fotocasa', e.target.value)}
              className={inputClass} placeholder="87654321" />
          </div>
        </div>
      </section>

      {/* ── Actions ──────────────────────────────── */}
      {error && <p className="text-destructive text-sm bg-red-50 border border-red-200 rounded-sm px-4 py-3">{error}</p>}

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 disabled:opacity-60 transition"
        >
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear propiedad'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
        {isEdit && isDirty && !loading && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Sin guardar
          </span>
        )}
        {isEdit && savedAt && !isDirty && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
          </span>
        )}
      </div>
    </form>
  );
}
