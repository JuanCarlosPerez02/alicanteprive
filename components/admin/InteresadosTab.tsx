import Link from 'next/link';
import InteresEstadoSelect from './InteresEstadoSelect';
import type { InteresPropiedad } from '@/types';


interface Props {
  intereses: InteresPropiedad[];
  locale: string;
  propiedadId: string;
}

export default function InteresadosTab({ intereses, locale, propiedadId }: Props) {
  const fromParam = encodeURIComponent(`/${locale}/admin/propiedades/${propiedadId}`);
  if (intereses.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        No hay leads registrados para esta propiedad todavía
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="pb-3 pr-4">Contacto</th>
            <th className="pb-3 pr-4">Teléfono</th>
            <th className="pb-3 pr-4">Origen</th>
            <th className="pb-3 pr-4">Estado</th>
            <th className="pb-3 pr-4">Notas</th>
            <th className="pb-3">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {intereses.map((i) => (
            <tr key={i.id} className="hover:bg-muted/30 transition-colors">
              <td className="py-3 pr-4">
                <Link
                  href={`/${locale}/admin/contactos/${i.contacto_id}?from=${fromParam}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {i.contacto?.nombre ?? '—'}
                </Link>
                {i.contacto?.email && (
                  <p className="text-xs text-muted-foreground">{i.contacto.email}</p>
                )}
              </td>
              <td className="py-3 pr-4 text-muted-foreground">
                {i.contacto?.telefono ?? '—'}
              </td>
              <td className="py-3 pr-4 capitalize text-muted-foreground">{i.origen}</td>
              <td className="py-3 pr-4">
                <InteresEstadoSelect id={i.id} current={i.estado} />
              </td>
              <td className="py-3 pr-4 max-w-xs">
                <p className="text-xs text-muted-foreground truncate">{i.notas ?? '—'}</p>
              </td>
              <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(i.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
