import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Eye } from 'lucide-react';
import type { Mensaje } from '@/types';
import MensajeMarkReadButton from '@/components/admin/MensajeMarkReadButton';

export const metadata = { title: 'Mensajes — Admin' };

interface Props {
  searchParams: Promise<{ leido?: string }>;
}

export default async function AdminMensajesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('mensajes')
    .select('*, contacto:contactos(nombre, email), propiedad:propiedades(referencia)')
    .order('recibido_en', { ascending: false });

  if (sp.leido === 'false') {
    query = query.eq('leido', false);
  }

  const { data } = await query;
  const mensajes: Mensaje[] = (data as Mensaje[]) ?? [];
  const unreadCount = mensajes.filter((m) => !m.leido).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-semibold">Mensajes</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold min-w-[1.4rem]">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{mensajes.length} mensajes</p>
        </div>
        <Link
          href="mensajes/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nuevo mensaje
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="mensajes"
          className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
            sp.leido !== 'false'
              ? 'border-primary bg-primary/5 text-primary font-semibold'
              : 'border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          Todos
        </Link>
        <Link
          href="mensajes?leido=false"
          className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
            sp.leido === 'false'
              ? 'border-primary bg-primary/5 text-primary font-semibold'
              : 'border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          No leídos
        </Link>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Propiedad</th>
                <th className="px-4 py-3">Mensaje</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {mensajes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No hay mensajes
                  </td>
                </tr>
              )}
              {mensajes.map((mensaje) => (
                <tr
                  key={mensaje.id}
                  className={`border-b border-border last:border-0 transition-colors ${
                    !mensaje.leido ? 'bg-primary/[0.03] hover:bg-primary/[0.06]' : 'hover:bg-muted/20'
                  }`}
                >
                  <td className="px-4 py-3">
                    {mensaje.contacto ? (
                      <>
                        <p className="font-medium">{mensaje.contacto.nombre}</p>
                        <p className="text-xs text-muted-foreground">{mensaje.contacto.email ?? ''}</p>
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {mensaje.propiedad ? (
                      <span className="font-mono text-xs text-muted-foreground">
                        {mensaje.propiedad.referencia}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {mensaje.texto.length > 100
                        ? `${mensaje.texto.slice(0, 100)}…`
                        : mensaje.texto}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(mensaje.recibido_en).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <MensajeMarkReadButton id={mensaje.id} leido={mensaje.leido} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`mensajes/${mensaje.id}`}
                      className="inline-flex items-center gap-1 p-1.5 hover:bg-muted rounded-sm transition-colors text-muted-foreground hover:text-foreground"
                      title="Ver mensaje"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
