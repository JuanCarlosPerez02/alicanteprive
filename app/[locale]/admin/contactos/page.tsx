import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, User, Pencil } from 'lucide-react';
import ContactoDeleteButton from '@/components/admin/ContactoDeleteButton';
import type { Contacto } from '@/types';

export const metadata = { title: 'Contactos — Admin' };

const ORIGEN_COLORS: Record<string, string> = {
  web: 'bg-blue-100 text-blue-800',
  idealista: 'bg-orange-100 text-orange-800',
  fotocasa: 'bg-red-100 text-red-800',
  manual: 'bg-gray-100 text-gray-700',
  otro: 'bg-purple-100 text-purple-800',
};

interface Props {
  searchParams: Promise<{ q?: string; origen?: string }>;
}

export default async function AdminContactosPage({ searchParams }: Props) {
  const sp = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('contactos')
    .select('*, interes_propiedad(count)')
    .order('created_at', { ascending: false });

  if (sp.origen) query = query.eq('origen', sp.origen);
  if (sp.q) query = query.or(`nombre.ilike.%${sp.q}%,email.ilike.%${sp.q}%`);

  const { data } = await query;
  const contactos: Contacto[] = (data as Contacto[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Contactos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{contactos.length} en total</p>
        </div>
        <Link
          href="contactos/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nuevo contacto
        </Link>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3 mb-6">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Buscar por nombre o email..."
          className="border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring w-64"
        />
        <select
          name="origen"
          defaultValue={sp.origen ?? ''}
          className="border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none"
        >
          <option value="">Todos los orígenes</option>
          {['web', 'idealista', 'fotocasa', 'manual', 'otro'].map((o) => (
            <option key={o} value={o}>
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 border border-border rounded-sm text-sm hover:bg-muted transition-colors"
        >
          Filtrar
        </button>
        {(sp.q || sp.origen) && (
          <Link
            href="contactos"
            className="px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors self-center"
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3 text-center">Intereses</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No hay contactos
                  </td>
                </tr>
              )}
              {contactos.map((contacto) => {
                const interesCount = (contacto as any).interes_propiedad?.[0]?.count ?? 0;
                return (
                  <tr
                    key={contacto.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`contactos/${contacto.id}`}
                        className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        {contacto.nombre}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {contacto.email ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {contacto.telefono ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${ORIGEN_COLORS[contacto.origen] ?? 'bg-gray-100 text-gray-700'}`}
                      >
                        {contacto.origen}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(contacto.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-muted text-xs font-semibold tabular-nums">
                        {interesCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`contactos/${contacto.id}/editar`}
                          className="p-1.5 hover:bg-muted rounded-sm transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <ContactoDeleteButton id={contacto.id} nombre={contacto.nombre} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
