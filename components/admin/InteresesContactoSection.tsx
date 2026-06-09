'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import SearchSelect from '@/components/ui/SearchSelect';
import type { SearchSelectOption } from '@/components/ui/SearchSelect';
import InteresContactoRow from './InteresContactoRow';
import type { InteresPropiedad } from '@/types';

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
  contactoId: string;
  intereses: InteresPropiedad[];
  propiedades: { id: string; referencia: string; titulo: string | Record<string, string> }[];
  locale: string;
}

export default function InteresesContactoSection({ contactoId, intereses, propiedades, locale }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [propiedadId, setPropiedadId] = useState('');
  const [estado, setEstado] = useState('nuevo');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const existingIds = intereses.map((i) => i.propiedad_id);

  const options: SearchSelectOption[] = propiedades
    .filter((p) => !existingIds.includes(p.id))
    .map((p) => {
      const titulo = typeof p.titulo === 'object'
        ? (p.titulo as Record<string, string>).es ?? p.referencia
        : p.referencia;
      return { id: p.id, label: titulo, sub: p.referencia };
    });

  function closeForm() {
    setShowForm(false);
    setPropiedadId('');
    setEstado('nuevo');
    setAddError('');
  }

  async function handleAdd() {
    if (!propiedadId) return;
    setAddLoading(true);
    setAddError('');
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
        setAddError(d.error ?? `Error ${res.status}`);
        return;
      }
      closeForm();
      router.refresh();
    } catch {
      setAddError('Error de red');
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
        <h2 className="font-heading text-base font-semibold">
          Propiedades de interés
          <span className="ml-2 text-muted-foreground font-normal text-sm">({intereses.length})</span>
        </h2>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
        >
          {showForm ? (
            <><X className="w-3.5 h-3.5" />Cancelar</>
          ) : (
            <><Plus className="w-3.5 h-3.5" />Añadir propiedad</>
          )}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Propiedad *
              </label>
              <SearchSelect
                value={propiedadId}
                onChange={setPropiedadId}
                options={options}
                placeholder="Buscar propiedad…"
                emptyLabel="— Seleccionar propiedad —"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Estado inicial
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
              disabled={!propiedadId || addLoading}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 disabled:opacity-50 transition h-[38px] whitespace-nowrap"
            >
              {addLoading ? 'Añadiendo…' : 'Añadir'}
            </button>
          </div>
          {addError && <p className="text-destructive text-xs mt-2">{addError}</p>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Propiedad</th>
              <th className="px-4 py-3">Zona</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Notas</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {intereses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Sin propiedades de interés registradas
                </td>
              </tr>
            ) : (
              intereses.map((interes) => (
                <InteresContactoRow
                  key={interes.id}
                  interes={interes}
                  locale={locale}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
