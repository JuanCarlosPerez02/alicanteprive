'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import SearchSelect from '@/components/ui/SearchSelect';
import type { SearchSelectOption } from '@/components/ui/SearchSelect';

const ORIGENES = ['web', 'idealista', 'fotocasa', 'manual', 'otro'] as const;
const ORIGEN_LABELS: Record<string, string> = {
  web: 'Web propia', idealista: 'Idealista', fotocasa: 'Fotocasa', manual: 'Manual', otro: 'Otro',
};

interface Props {
  id: string;
  currentTexto: string;
  currentContactoId: string | null;
  currentPropiedadId: string | null;
  currentOrigen: string;
  contactos: { id: string; nombre: string; email: string | null }[];
  propiedades: { id: string; referencia: string; titulo: Record<string, string> }[];
}

export default function MensajeEditForm({
  id, currentTexto, currentContactoId, currentPropiedadId, currentOrigen,
  contactos, propiedades,
}: Props) {
  const router = useRouter();

  const [texto, setTexto] = useState(currentTexto);
  const [contactoId, setContactoId] = useState(currentContactoId ?? '');
  const [propiedadId, setPropiedadId] = useState(currentPropiedadId ?? '');
  const [origen, setOrigen] = useState(currentOrigen);

  const [loading, setLoading] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const isDirty =
    texto !== currentTexto ||
    contactoId !== (currentContactoId ?? '') ||
    propiedadId !== (currentPropiedadId ?? '') ||
    origen !== currentOrigen;

  useEffect(() => {
    if (savedAt) {
      const t = setTimeout(() => setSavedAt(null), 3000);
      return () => clearTimeout(t);
    }
  }, [savedAt]);

  async function handleSave() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/mensajes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto,
          origen,
          contacto_id: contactoId || null,
          propiedad_id: propiedadId || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? `Error ${res.status}`);
        return;
      }
      setSavedAt(new Date());
      router.refresh();
    } catch {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  }

  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';
  const inputClass = 'w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition';

  const contactoOptions: SearchSelectOption[] = contactos.map((c) => ({
    id: c.id,
    label: c.nombre,
    sub: c.email ?? undefined,
  }));

  const propiedadOptions: SearchSelectOption[] = propiedades.map((p) => ({
    id: p.id,
    label: p.referencia,
    sub: (p.titulo as Record<string, string>)?.es ?? undefined,
  }));

  return (
    <div className="space-y-6">
      {/* Asociaciones */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Asociaciones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Contacto</label>
            <SearchSelect
              value={contactoId}
              onChange={setContactoId}
              options={contactoOptions}
              placeholder="Buscar contacto…"
              emptyLabel="— Sin contacto —"
            />
          </div>

          <div>
            <label className={labelClass}>Propiedad</label>
            <SearchSelect
              value={propiedadId}
              onChange={setPropiedadId}
              options={propiedadOptions}
              placeholder="Buscar propiedad…"
              emptyLabel="— Sin propiedad —"
            />
          </div>

          <div>
            <label className={labelClass}>Origen</label>
            <select
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              className={inputClass}
            >
              {ORIGENES.map((o) => (
                <option key={o} value={o}>{ORIGEN_LABELS[o]}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Texto */}
      <section className="bg-card border border-border rounded-sm p-5">
        <h2 className="font-heading text-base font-semibold mb-4">Mensaje</h2>
        <div>
          <label className={labelClass}>Contenido del mensaje</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={8}
            className={`${inputClass} resize-y leading-relaxed`}
            placeholder="Escribe el contenido del mensaje…"
          />
        </div>
      </section>

      {/* Actions */}
      {error && (
        <p className="text-destructive text-sm bg-destructive/5 border border-destructive/20 rounded-sm px-4 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !isDirty}
          className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {isDirty && !loading && (
          <span className="flex items-center gap-1.5 text-xs text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Sin guardar
          </span>
        )}
        {savedAt && !isDirty && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
          </span>
        )}
      </div>
    </div>
  );
}
