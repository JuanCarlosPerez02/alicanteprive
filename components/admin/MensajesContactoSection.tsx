'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import type { Mensaje } from '@/types';

interface Props {
  mensajes: Mensaje[];
  locale: string;
  contactoId: string;
}

export default function MensajesContactoSection({ mensajes, locale, contactoId }: Props) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fromParam = encodeURIComponent(`/${locale}/admin/contactos/${contactoId}`);

  async function handleDelete() {
    if (!confirmId) return;
    setLoading(true);
    await fetch(`/api/admin/mensajes/${confirmId}`, { method: 'DELETE' });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-heading text-base font-semibold">
          Mensajes
          <span className="ml-2 text-muted-foreground font-normal text-sm">({mensajes.length})</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Mensaje</th>
              <th className="px-4 py-3">Propiedad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {mensajes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Sin mensajes registrados
                </td>
              </tr>
            ) : (
              mensajes.map((m) => (
                <tr
                  key={m.id}
                  className={`border-b border-border last:border-0 transition-colors ${
                    !m.leido ? 'bg-primary/[0.03] hover:bg-primary/[0.06]' : 'hover:bg-muted/20'
                  }`}
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(m.recibido_en).toLocaleDateString('es-ES', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className={`text-xs line-clamp-2 ${!m.leido ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {m.texto}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {m.propiedad ? (
                      <Link
                        href={`/${locale}/admin/propiedades/${m.propiedad_id}`}
                        className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {m.propiedad.referencia}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      m.leido ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      {m.leido ? 'Leído' : 'Sin leer'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <Link
                        href={`/${locale}/admin/mensajes/${m.id}?from=${fromParam}`}
                        className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm transition-colors"
                        title="Ver mensaje"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setConfirmId(m.id)}
                        className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-sm transition-colors"
                        title="Eliminar mensaje"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(o) => { if (!o) setConfirmId(null); }}
        title="¿Eliminar este mensaje?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
