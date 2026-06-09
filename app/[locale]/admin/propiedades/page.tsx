import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Pencil, Star, Eye } from 'lucide-react';
import { getLocalizedText, formatPrice } from '@/lib/utils';
import type { Propiedad } from '@/types';
import PropiedadDeleteButton from '@/components/admin/PropiedadDeleteButton';
import PropiedadStatusSelect from '@/components/admin/PropiedadStatusSelect';

const ESTADO_BADGE: Record<string, string> = {
  disponible: 'bg-emerald-100 text-emerald-800',
  reservada: 'bg-amber-100 text-amber-800',
  vendida: 'bg-gray-200 text-gray-700',
  alquilada: 'bg-blue-100 text-blue-800',
  oculta: 'bg-red-100 text-red-700',
};

export default async function AdminPropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; operacion?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('propiedades')
    .select('*, propiedad_fotos(url, es_portada, orden)')
    .order('created_at', { ascending: false });

  if (sp.estado) query = query.eq('estado', sp.estado);
  if (sp.operacion) query = query.eq('operacion', sp.operacion);
  if (sp.q) query = query.or(`referencia.ilike.%${sp.q}%,zona.ilike.%${sp.q}%`);

  const { data } = await query;
  const propiedades: Propiedad[] = (data as Propiedad[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Propiedades</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{propiedades.length} en total</p>
        </div>
        <Link
          href="propiedades/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nueva propiedad
        </Link>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3 mb-6">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Buscar por referencia o zona..."
          className="border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring w-64"
        />
        <select name="estado" defaultValue={sp.estado ?? ''} className="border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none">
          <option value="">Todos los estados</option>
          {['disponible', 'reservada', 'vendida', 'alquilada', 'oculta'].map((e) => (
            <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
          ))}
        </select>
        <select name="operacion" defaultValue={sp.operacion ?? ''} className="border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none">
          <option value="">Venta y alquiler</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
        <button type="submit" className="px-4 py-2 border border-border rounded-sm text-sm hover:bg-muted transition-colors">
          Filtrar
        </button>
        {(sp.q || sp.estado || sp.operacion) && (
          <Link href="propiedades" className="px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors self-center">
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
                <th className="px-4 py-3">Ref.</th>
                <th className="px-4 py-3">Título / Zona</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-center">Dest.</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propiedades.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No hay propiedades
                  </td>
                </tr>
              )}
              {propiedades.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.referencia}</td>
                  <td className="px-4 py-3">
                    <Link href={`propiedades/${p.id}`} className="group/row block">
                      <p className="font-medium line-clamp-1 group-hover/row:text-primary transition-colors">{getLocalizedText(p.titulo, 'es')}</p>
                      {p.zona && <p className="text-xs text-muted-foreground">{p.zona}</p>}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {p.tipo} · {p.operacion}
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums">
                    {formatPrice(p.precio, 'es')}
                  </td>
                  <td className="px-4 py-3">
                    <PropiedadStatusSelect id={p.id} current={p.estado} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.destacada && <Star className="w-4 h-4 text-gold mx-auto fill-gold" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`propiedades/${p.id}`}
                        className="p-1.5 hover:bg-muted rounded-sm transition-colors text-muted-foreground hover:text-foreground"
                        title="Ver"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`propiedades/${p.id}/editar`}
                        className="p-1.5 hover:bg-muted rounded-sm transition-colors text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <PropiedadDeleteButton id={p.id} referencia={p.referencia} />
                    </div>
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
