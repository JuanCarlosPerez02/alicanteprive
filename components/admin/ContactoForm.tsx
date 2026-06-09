'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import type { Contacto } from '@/types';

const TIPOS_PROPIEDAD = [
  'piso', 'casa', 'atico', 'villa', 'chalet',
  'adosado', 'duplex', 'estudio', 'local',
];
const TIPOS_LABELS: Record<string, string> = {
  piso: 'Piso', casa: 'Casa', atico: 'Ático', villa: 'Villa', chalet: 'Chalet',
  adosado: 'Adosado', duplex: 'Dúplex', estudio: 'Estudio', local: 'Local',
};

type ZonaForm = { nombre: string; lat: string; lng: string; radio_km: string };

type FormState = {
  nombre: string;
  email: string;
  telefono: string;
  origen: string;
  notas: string;
  pref_activo: boolean;
  pref_operacion: string;
  pref_tipos: string[];
  pref_presupuesto_max: string;
  pref_metros_min: string;
  pref_habitaciones_min: string;
  pref_zonas: ZonaForm[];
};

function toFormState(c?: Contacto): FormState {
  const p = c?.preferencias ?? {};
  return {
    nombre: c?.nombre ?? '',
    email: c?.email ?? '',
    telefono: c?.telefono ?? '',
    origen: c?.origen ?? 'manual',
    notas: c?.notas ?? '',
    pref_activo: p.activo ?? false,
    pref_operacion: p.operacion ?? '',
    pref_tipos: p.tipo ?? [],
    pref_presupuesto_max: p.presupuesto_max?.toString() ?? '',
    pref_metros_min: p.metros_min?.toString() ?? '',
    pref_habitaciones_min: p.habitaciones_min?.toString() ?? '',
    pref_zonas: (p.zonas_preferidas ?? []).map((z) => ({
      nombre: z.nombre,
      lat: z.lat.toString(),
      lng: z.lng.toString(),
      radio_km: z.radio_km.toString(),
    })),
  };
}

interface Props {
  contacto?: Contacto;
  locale: string;
}

export default function ContactoForm({ contacto, locale }: Props) {
  const isEdit = !!contacto;
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(contacto));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPref, setShowPref] = useState(!!contacto?.preferencias && Object.keys(contacto.preferencias).length > 0);

  const set = (key: keyof FormState, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleTipo = (t: string) =>
    set('pref_tipos', form.pref_tipos.includes(t)
      ? form.pref_tipos.filter((x) => x !== t)
      : [...form.pref_tipos, t]);

  const addZona = () =>
    set('pref_zonas', [...form.pref_zonas, { nombre: '', lat: '', lng: '', radio_km: '10' }]);

  const removeZona = (i: number) =>
    set('pref_zonas', form.pref_zonas.filter((_, idx) => idx !== i));

  const updateZona = (i: number, key: keyof ZonaForm, val: string) =>
    set('pref_zonas', form.pref_zonas.map((z, idx) => idx === i ? { ...z, [key]: val } : z));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const preferencias: Record<string, unknown> = {};
    if (showPref) {
      preferencias.activo = form.pref_activo;
      if (form.pref_operacion) preferencias.operacion = form.pref_operacion;
      if (form.pref_tipos.length) preferencias.tipo = form.pref_tipos;
      if (form.pref_presupuesto_max) preferencias.presupuesto_max = parseFloat(form.pref_presupuesto_max);
      if (form.pref_metros_min) preferencias.metros_min = parseInt(form.pref_metros_min);
      if (form.pref_habitaciones_min) preferencias.habitaciones_min = parseInt(form.pref_habitaciones_min);
      const zonas = form.pref_zonas.filter((z) => z.nombre && z.lat && z.lng && z.radio_km);
      if (zonas.length) {
        preferencias.zonas_preferidas = zonas.map((z) => ({
          nombre: z.nombre,
          lat: parseFloat(z.lat),
          lng: parseFloat(z.lng),
          radio_km: parseFloat(z.radio_km),
        }));
      }
    }

    const payload = {
      nombre: form.nombre,
      email: form.email || null,
      telefono: form.telefono || null,
      origen: form.origen,
      notas: form.notas || null,
      preferencias,
    };

    const url = isEdit ? `/api/admin/contactos/${contacto.id}` : '/api/admin/contactos';
    const method = isEdit ? 'PUT' : 'POST';

    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      setError('Error de red al conectar con el servidor');
      setLoading(false);
      return;
    }

    if (!res.ok) {
      let message = `Error ${res.status}`;
      try {
        const data = await res.json();
        message = data.error ?? message;
      } catch { /* response was not JSON */ }
      setError(message);
      setLoading(false);
      return;
    }

    if (!isEdit) {
      let created: { id: string } | null = null;
      try {
        const body = await res.json();
        created = body.contacto;
      } catch { /* ignore */ }
      if (created?.id) {
        router.push(`/${locale}/admin/contactos/${created.id}`);
      } else {
        router.push(`/${locale}/admin/contactos`);
      }
    } else {
      router.push(`/${locale}/admin/contactos/${contacto.id}`);
      router.refresh();
    }
    setLoading(false);
  }

  const inputClass = 'w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition';
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Datos básicos ── */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Datos de contacto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nombre completo *</label>
            <input value={form.nombre} onChange={(e) => set('nombre', e.target.value)}
              className={inputClass} placeholder="Nombre y apellidos" required />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
              className={inputClass} placeholder="email@ejemplo.com" />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input type="tel" value={form.telefono} onChange={(e) => set('telefono', e.target.value)}
              className={inputClass} placeholder="+34 600 000 000" />
          </div>
          <div>
            <label className={labelClass}>Origen del lead</label>
            <select value={form.origen} onChange={(e) => set('origen', e.target.value)} className={inputClass}>
              {['web', 'idealista', 'fotocasa', 'manual', 'otro'].map((o) => (
                <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Notas internas</label>
            <textarea rows={3} value={form.notas} onChange={(e) => set('notas', e.target.value)}
              className={inputClass} placeholder="Notas privadas sobre este contacto..." />
          </div>
        </div>
      </section>

      {/* ── Perfil de búsqueda (toggle) ── */}
      <section className="bg-card border border-border rounded-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-base font-semibold">Perfil de búsqueda</h2>
          <button type="button" onClick={() => setShowPref((p) => !p)}
            className="text-xs text-primary font-semibold hover:underline">
            {showPref ? 'Ocultar' : 'Añadir perfil de búsqueda'}
          </button>
        </div>

        {showPref && (
          <div className="space-y-5">
            {/* Activo toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.pref_activo}
                onChange={(e) => set('pref_activo', e.target.checked)}
                className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium">Perfil activo (incluir en matching)</span>
            </label>

            {/* Operación */}
            <div>
              <label className={labelClass}>Tipo de operación</label>
              <div className="flex gap-2">
                {[['', 'Indiferente'], ['venta', 'Compra'], ['alquiler', 'Alquiler']].map(([val, label]) => (
                  <button key={val} type="button"
                    onClick={() => set('pref_operacion', val)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors
                      ${form.pref_operacion === val
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipos */}
            <div>
              <label className={labelClass}>Tipo de propiedad (puede ser varios)</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {TIPOS_PROPIEDAD.map((t) => (
                  <label key={t}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border cursor-pointer text-xs transition-colors
                      ${form.pref_tipos.includes(t) ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-border hover:border-primary/40'}`}>
                    <input type="checkbox" className="sr-only" checked={form.pref_tipos.includes(t)} onChange={() => toggleTipo(t)} />
                    {TIPOS_LABELS[t]}
                  </label>
                ))}
              </div>
            </div>

            {/* Numeric ranges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Presupuesto máx. (€)</label>
                <input type="number" min={0} value={form.pref_presupuesto_max}
                  onChange={(e) => set('pref_presupuesto_max', e.target.value)}
                  className={inputClass} placeholder="500000" />
              </div>
              <div>
                <label className={labelClass}>Metros mín. (m²)</label>
                <input type="number" min={0} value={form.pref_metros_min}
                  onChange={(e) => set('pref_metros_min', e.target.value)}
                  className={inputClass} placeholder="80" />
              </div>
              <div>
                <label className={labelClass}>Habitaciones mín.</label>
                <input type="number" min={1} max={10} value={form.pref_habitaciones_min}
                  onChange={(e) => set('pref_habitaciones_min', e.target.value)}
                  className={inputClass} placeholder="2" />
              </div>
            </div>

            {/* Zonas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Zonas preferidas</label>
                <button type="button" onClick={addZona}
                  className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Añadir zona
                </button>
              </div>
              {form.pref_zonas.length === 0 && (
                <p className="text-xs text-muted-foreground">Sin zonas. Las zonas permiten hacer matching geográfico.</p>
              )}
              {form.pref_zonas.map((zona, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 p-3 bg-muted/30 rounded-sm">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
                    <input value={zona.nombre} onChange={(e) => updateZona(i, 'nombre', e.target.value)}
                      className={inputClass} placeholder="Cabo de las Huertas" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Latitud</label>
                    <input type="number" step="any" value={zona.lat} onChange={(e) => updateZona(i, 'lat', e.target.value)}
                      className={inputClass} placeholder="38.378" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Longitud</label>
                    <input type="number" step="any" value={zona.lng} onChange={(e) => updateZona(i, 'lng', e.target.value)}
                      className={inputClass} placeholder="-0.428" />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Radio (km)</label>
                      <input type="number" min={1} value={zona.radio_km} onChange={(e) => updateZona(i, 'radio_km', e.target.value)}
                        className={inputClass} placeholder="10" />
                    </div>
                    <button type="button" onClick={() => removeZona(i)}
                      className="p-2 mb-0.5 hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showPref && (
          <p className="text-xs text-muted-foreground">Sin perfil de búsqueda definido. Añade uno para que aparezca en el matching de propiedades.</p>
        )}
      </section>

      {/* ── Acciones ── */}
      {error && (
        <p className="text-destructive text-sm bg-red-50 border border-red-200 rounded-sm px-4 py-3">{error}</p>
      )}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 disabled:opacity-60 transition">
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear contacto'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
