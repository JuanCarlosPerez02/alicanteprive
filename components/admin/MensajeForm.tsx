'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, UserPlus, User } from 'lucide-react';
import type { Contacto, Propiedad } from '@/types';
import { getLocalizedText, formatPrice } from '@/lib/utils';

interface Props {
  propiedades: Propiedad[];
  contactos: Contacto[];
  locale: string;
  propiedadPreseleccionada?: string; // propiedad_id to pre-select
}

type ContactoMode = 'search' | 'existing' | 'new';

type FormState = {
  texto: string;
  origen: string;
  propiedad_id: string;
  propiedad_search: string;
  // contact
  contacto_mode: ContactoMode;
  contacto_id: string;
  contacto_search: string;
  nuevo_nombre: string;
  nuevo_email: string;
  nuevo_telefono: string;
  nuevo_origen: string;
};

const ORIGEN_LABELS: Record<string, string> = {
  web: 'Web propia', idealista: 'Idealista', fotocasa: 'Fotocasa',
  manual: 'Manual / Teléfono', otro: 'Otro',
};

export default function MensajeForm({ propiedades, contactos, locale, propiedadPreseleccionada }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    texto: '',
    origen: 'manual',
    propiedad_id: propiedadPreseleccionada ?? '',
    propiedad_search: '',
    contacto_mode: 'search',
    contacto_id: '',
    contacto_search: '',
    nuevo_nombre: '',
    nuevo_email: '',
    nuevo_telefono: '',
    nuevo_origen: 'manual',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof FormState, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Filtered lists
  const filteredPropiedades = useMemo(() => {
    const q = form.propiedad_search.toLowerCase();
    if (!q) return propiedades;
    return propiedades.filter((p) =>
      p.referencia.toLowerCase().includes(q) ||
      (p.zona ?? '').toLowerCase().includes(q) ||
      getLocalizedText(p.titulo, 'es').toLowerCase().includes(q)
    );
  }, [form.propiedad_search, propiedades]);

  const filteredContactos = useMemo(() => {
    const q = form.contacto_search.toLowerCase();
    if (!q) return contactos;
    return contactos.filter((c) =>
      c.nombre.toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.telefono ?? '').toLowerCase().includes(q)
    );
  }, [form.contacto_search, contactos]);

  const selectedPropiedad = propiedades.find((p) => p.id === form.propiedad_id);
  const selectedContacto = contactos.find((c) => c.id === form.contacto_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload: Record<string, unknown> = {
      texto: form.texto,
      origen: form.origen,
      propiedad_id: form.propiedad_id || null,
    };

    if (form.contacto_mode === 'existing' && form.contacto_id) {
      payload.contacto_id = form.contacto_id;
    } else if (form.contacto_mode === 'new' && form.nuevo_nombre) {
      payload.nuevo_contacto = {
        nombre: form.nuevo_nombre,
        email: form.nuevo_email || null,
        telefono: form.nuevo_telefono || null,
        origen: form.nuevo_origen,
      };
    }

    let res: Response;
    try {
      res = await fetch('/api/admin/mensajes', {
        method: 'POST',
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

    let contacto_id: string | null = null;
    try {
      const body = await res.json();
      contacto_id = body.contacto_id ?? null;
    } catch { /* ignore */ }

    // Navigate to contact detail if a contact was involved
    if (contacto_id) {
      router.push(`/${locale}/admin/contactos/${contacto_id}`);
    } else {
      router.push(`/${locale}/admin/mensajes`);
    }
    router.refresh();
  }

  const inputClass = 'w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition';
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* ── Origen y mensaje ── */}
      <section className="bg-card border border-border rounded-sm p-5 space-y-4">
        <h2 className="font-heading text-base font-semibold">Mensaje recibido</h2>

        <div>
          <label className={labelClass}>Canal de origen *</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ORIGEN_LABELS).map(([val, label]) => (
              <button key={val} type="button"
                onClick={() => set('origen', val)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors
                  ${form.origen === val
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Texto del mensaje *</label>
          <textarea
            rows={5}
            value={form.texto}
            onChange={(e) => set('texto', e.target.value)}
            className={inputClass}
            placeholder="Pega aquí el mensaje recibido desde el portal o escríbelo directamente..."
            required
          />
        </div>
      </section>

      {/* ── Propiedad relacionada ── */}
      <section className="bg-card border border-border rounded-sm p-5 space-y-3">
        <h2 className="font-heading text-base font-semibold">Propiedad relacionada <span className="text-muted-foreground font-normal text-sm">(opcional)</span></h2>

        {selectedPropiedad ? (
          <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-sm">
            <div>
              <p className="text-sm font-semibold">{getLocalizedText(selectedPropiedad.titulo, 'es')}</p>
              <p className="text-xs text-muted-foreground">{selectedPropiedad.referencia} · {selectedPropiedad.zona ?? ''} · {formatPrice(selectedPropiedad.precio, 'es')}</p>
            </div>
            <button type="button" onClick={() => { set('propiedad_id', ''); set('propiedad_search', ''); }}
              className="p-1 hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={form.propiedad_search}
                onChange={(e) => set('propiedad_search', e.target.value)}
                placeholder="Buscar por referencia, zona o título..."
                className="w-full border border-border rounded-sm pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {form.propiedad_search && (
              <div className="border border-border rounded-sm overflow-hidden max-h-48 overflow-y-auto">
                {filteredPropiedades.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>
                ) : filteredPropiedades.slice(0, 8).map((p) => (
                  <button key={p.id} type="button"
                    onClick={() => { set('propiedad_id', p.id); set('propiedad_search', ''); }}
                    className="flex items-start gap-3 w-full text-left px-3 py-2.5 hover:bg-muted transition-colors border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{getLocalizedText(p.titulo, 'es')}</p>
                      <p className="text-xs text-muted-foreground">{p.referencia} · {p.zona ?? ''} · {formatPrice(p.precio, 'es')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Contacto ── */}
      <section className="bg-card border border-border rounded-sm p-5 space-y-4">
        <h2 className="font-heading text-base font-semibold">Contacto <span className="text-muted-foreground font-normal text-sm">(opcional)</span></h2>

        {/* Mode selector */}
        {form.contacto_mode === 'search' && !selectedContacto && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={form.contacto_search}
                onChange={(e) => set('contacto_search', e.target.value)}
                placeholder="Buscar contacto por nombre, email o teléfono..."
                className="w-full border border-border rounded-sm pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {form.contacto_search && (
              <div className="border border-border rounded-sm overflow-hidden max-h-48 overflow-y-auto">
                {filteredContactos.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>
                ) : filteredContactos.slice(0, 8).map((c) => (
                  <button key={c.id} type="button"
                    onClick={() => { setForm((f) => ({ ...f, contacto_id: c.id, contacto_mode: 'existing', contacto_search: '' })); }}
                    className="flex items-center gap-3 w-full text-left px-3 py-2.5 hover:bg-muted transition-colors border-b border-border last:border-0">
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{c.nombre}</p>
                      <p className="text-xs text-muted-foreground">{[c.email, c.telefono].filter(Boolean).join(' · ')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button type="button"
              onClick={() => setForm((f) => ({ ...f, contacto_mode: 'new', contacto_search: '' }))}
              className="flex items-center gap-2 text-xs text-primary font-semibold hover:underline">
              <UserPlus className="w-3.5 h-3.5" />
              Crear nuevo contacto
            </button>
          </div>
        )}

        {/* Selected existing contact */}
        {form.contacto_mode === 'existing' && selectedContacto && (
          <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold">{selectedContacto.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {[selectedContacto.email, selectedContacto.telefono].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>
            <button type="button"
              onClick={() => setForm((f) => ({ ...f, contacto_id: '', contacto_mode: 'search' }))}
              className="p-1 hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* New contact form */}
        {form.contacto_mode === 'new' && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-sm border border-border">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nuevo contacto</p>
              <button type="button"
                onClick={() => setForm((f) => ({ ...f, contacto_mode: 'search', nuevo_nombre: '', nuevo_email: '', nuevo_telefono: '' }))}
                className="text-xs text-muted-foreground hover:text-foreground">
                Cancelar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nombre *</label>
                <input value={form.nuevo_nombre} onChange={(e) => set('nuevo_nombre', e.target.value)}
                  className={inputClass} placeholder="Nombre completo" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={form.nuevo_email} onChange={(e) => set('nuevo_email', e.target.value)}
                  className={inputClass} placeholder="email@ejemplo.com" />
              </div>
              <div>
                <label className={labelClass}>Teléfono</label>
                <input type="tel" value={form.nuevo_telefono} onChange={(e) => set('nuevo_telefono', e.target.value)}
                  className={inputClass} placeholder="+34 600 000 000" />
              </div>
              <div>
                <label className={labelClass}>Origen</label>
                <select value={form.nuevo_origen} onChange={(e) => set('nuevo_origen', e.target.value)} className={inputClass}>
                  {Object.entries(ORIGEN_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Acciones ── */}
      {error && (
        <p className="text-destructive text-sm bg-red-50 border border-red-200 rounded-sm px-4 py-3">{error}</p>
      )}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 disabled:opacity-60 transition">
          {loading ? 'Guardando...' : 'Guardar mensaje'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
