'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import SearchSelect from '@/components/ui/SearchSelect';
import type { SearchSelectOption } from '@/components/ui/SearchSelect';

const ESTADOS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'visita_pendiente', label: 'Visita pendiente' },
  { value: 'visito', label: 'Visitó' },
  { value: 'no_visito', label: 'No visitó' },
  { value: 'descartado', label: 'Descartado' },
  { value: 'cerrado', label: 'Cerrado' },
];

interface Props {
  propiedadId: string;
  contactos: { id: string; nombre: string; email: string | null }[];
  existingIds: string[];
}

export default function AnadirInteresadoForm({ propiedadId, contactos, existingIds }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [contactoId, setContactoId] = useState('');
  const [estado, setEstado] = useState('nuevo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const options: SearchSelectOption[] = contactos
    .filter((c) => !existingIds.includes(c.id))
    .map((c) => ({ id: c.id, label: c.nombre, sub: c.email ?? undefined }));

  async function handleAdd() {
    if (!contactoId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/intereses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propiedad_id: propiedadId,
          contacto_id: contactoId,
          estado,
          origen: 'manual',
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? `Error ${res.status}`);
        return;
      }
      setOpen(false);
      setContactoId('');
      setEstado('nuevo');
      router.refresh();
    } catch {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Añadir interesado
      </button>
    );
  }

  return (
    <div className="p-4 bg-muted/30 border border-border rounded-sm space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Añadir interesado</p>
        <button
          onClick={() => { setOpen(false); setError(''); }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Contacto *
          </label>
          <SearchSelect
            value={contactoId}
            onChange={setContactoId}
            options={options}
            placeholder="Buscar contacto…"
            emptyLabel="— Seleccionar contacto —"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition h-[38px]"
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!contactoId || loading}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 disabled:opacity-50 transition h-[38px] whitespace-nowrap"
        >
          {loading ? 'Añadiendo…' : 'Añadir'}
        </button>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
