import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import MensajeMarkReadButton from '@/components/admin/MensajeMarkReadButton';
import MensajeEditForm from '@/components/admin/MensajeEditForm';
import MensajeDeleteButton from '@/components/admin/MensajeDeleteButton';
import type { Mensaje, Contacto, Propiedad } from '@/types';
import { ArrowLeft, Calendar, Globe } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ from?: string }>;
}

const ORIGEN_LABELS: Record<string, string> = {
  web: 'Web propia',
  idealista: 'Idealista',
  fotocasa: 'Fotocasa',
  manual: 'Manual',
  otro: 'Otro',
};

export default async function MensajeDetailPage({ params, searchParams }: Props) {
  const { locale, id } = await params;
  const { from } = await searchParams;
  const backHref = from ?? `/${locale}/admin/mensajes`;
  const backLabel = from?.includes('/contactos/') ? 'Volver al contacto' : 'Volver a mensajes';
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data } = await supabase
    .from('mensajes')
    .select('*, contacto:contactos(id, nombre, email), propiedad:propiedades(id, referencia, titulo)')
    .eq('id', id)
    .single();

  if (!data) notFound();

  const mensaje = data as Mensaje & {
    contacto: Pick<Contacto, 'id' | 'nombre' | 'email'> | null;
    propiedad: Pick<Propiedad, 'id' | 'referencia' | 'titulo'> | null;
  };

  const [{ data: contactos }, { data: propiedades }] = await Promise.all([
    supabase.from('contactos').select('id, nombre, email').order('nombre'),
    supabase.from('propiedades').select('id, referencia, titulo').order('referencia'),
  ]);

  const fecha = new Date(mensaje.recibido_en).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold leading-snug">
            {mensaje.contacto ? `Mensaje de ${mensaje.contacto.nombre}` : 'Mensaje anónimo'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {fecha}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              {ORIGEN_LABELS[mensaje.origen] ?? mensaje.origen}
            </span>
            {mensaje.contacto && (
              <Link
                href={`/${locale}/admin/contactos/${mensaje.contacto.id}`}
                className="hover:text-primary transition-colors"
              >
                {mensaje.contacto.email}
              </Link>
            )}
            {mensaje.propiedad && (
              <Link
                href={`/${locale}/admin/propiedades/${mensaje.propiedad.id}`}
                className="font-mono hover:text-primary transition-colors"
              >
                {mensaje.propiedad.referencia}
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MensajeMarkReadButton id={mensaje.id} leido={mensaje.leido} />
          <MensajeDeleteButton id={mensaje.id} redirectTo={`/${locale}/admin/mensajes`} />
        </div>
      </div>

      {/* Edit form */}
      <MensajeEditForm
        id={mensaje.id}
        currentTexto={mensaje.texto}
        currentContactoId={mensaje.contacto_id ?? null}
        currentPropiedadId={mensaje.propiedad_id ?? null}
        currentOrigen={mensaje.origen}
        contactos={(contactos ?? []) as { id: string; nombre: string; email: string | null }[]}
        propiedades={(propiedades ?? []) as { id: string; referencia: string; titulo: Record<string, string> }[]}
      />
    </div>
  );
}
