'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, getLocalizedText } from '@/lib/utils';
import InteresEstadoSelect from './InteresEstadoSelect';
import ConfirmDialog from './ConfirmDialog';
import type { InteresPropiedad } from '@/types';

interface Props {
  interes: InteresPropiedad;
  locale: string;
}

export default function InteresContactoRow({ interes: i, locale }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [notas, setNotas] = useState(i.notas ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const titulo = i.propiedad
    ? getLocalizedText(i.propiedad.titulo, 'es') ?? i.propiedad.referencia
    : null;
  const fromParam = encodeURIComponent(`/${locale}/admin/contactos/${i.contacto_id}`);

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`/api/admin/intereses/${i.id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/intereses/${i.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas: notas || null }),
      });
      if (!res.ok) { setError('Error al guardar'); return; }
      setEditing(false);
      router.refresh();
    } catch {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setNotas(i.notas ?? '');
    setEditing(false);
    setError('');
  }

  const inputClass =
    'w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition';

  return (
    <>
      <tr className={`border-b border-border last:border-0 transition-colors ${editing ? 'bg-primary/5' : 'hover:bg-muted/20'}`}>
        <td className="px-4 py-3">
          {i.propiedad ? (
            <Link
              href={`/${locale}/admin/propiedades/${i.propiedad_id}?from=${fromParam}`}
              className="font-medium hover:text-primary transition-colors"
            >
              <p className="line-clamp-1">{titulo}</p>
              <p className="text-xs font-mono text-muted-foreground">{i.propiedad.referencia}</p>
            </Link>
          ) : (
            <span className="text-muted-foreground font-mono text-xs">{i.propiedad_id}</span>
          )}
        </td>
        <td className="px-4 py-3 text-muted-foreground text-xs">{i.propiedad?.zona ?? '—'}</td>
        <td className="px-4 py-3 font-semibold tabular-nums text-xs">
          {i.propiedad?.precio != null ? formatPrice(i.propiedad.precio, 'es') : '—'}
        </td>
        <td className="px-4 py-3">
          <InteresEstadoSelect id={i.id} current={i.estado} />
        </td>
        <td className="px-4 py-3 max-w-xs">
          <p className="text-xs text-muted-foreground truncate">{i.notas ?? '—'}</p>
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {new Date(i.created_at).toLocaleDateString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-0.5">
            <button
              onClick={() => setConfirmOpen(true)}
              className="p-1.5 rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEditing((v) => !v)}
              className={`p-1.5 rounded-sm transition-colors ${editing ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              title={editing ? 'Cerrar' : 'Editar notas'}
            >
              {editing ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            </button>
          </div>
        </td>
      </tr>

      {editing && (
        <tr className="border-b border-border bg-primary/5">
          <td colSpan={7} className="px-4 py-3">
            <div className="flex gap-3 items-end max-w-2xl">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Notas
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={2}
                  className={`${inputClass} resize-none`}
                  placeholder="Notas sobre este interés…"
                />
              </div>
              <div className="flex gap-2 pb-0.5 shrink-0">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-sm hover:opacity-90 disabled:opacity-50 transition whitespace-nowrap"
                >
                  {loading ? 'Guardando…' : 'Guardar'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
            {error && <p className="text-destructive text-xs mt-1.5">{error}</p>}
          </td>
        </tr>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`¿Eliminar el interés en ${titulo ?? 'esta propiedad'}?`}
        description="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}
