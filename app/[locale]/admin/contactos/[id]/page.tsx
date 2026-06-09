import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Pencil, MessageSquarePlus } from 'lucide-react';
import ContactoDeleteButton from '@/components/admin/ContactoDeleteButton';
import InteresesContactoSection from '@/components/admin/InteresesContactoSection';
import MensajesContactoSection from '@/components/admin/MensajesContactoSection';
import type { Contacto, InteresPropiedad, Mensaje, PreferenciasContacto } from '@/types';

const ORIGEN_COLORS: Record<string, string> = {
  web: 'bg-blue-100 text-blue-800',
  idealista: 'bg-orange-100 text-orange-800',
  fotocasa: 'bg-red-100 text-red-800',
  manual: 'bg-gray-100 text-gray-700',
  otro: 'bg-purple-100 text-purple-800',
};

interface Props {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('contactos').select('nombre').eq('id', id).single();
  return { title: data ? `${data.nombre} — Contactos Admin` : 'Contacto — Admin' };
}

export default async function AdminContactoDetailPage({ params, searchParams }: Props) {
  const { locale, id } = await params;
  const { from } = await searchParams;

  const backHref = from ?? `/${locale}/admin/contactos`;
  const backLabel = from?.includes('/propiedades/') ? 'Volver a la propiedad' : 'Volver a contactos';
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data: contactoData } = await supabase
    .from('contactos')
    .select('*')
    .eq('id', id)
    .single();

  if (!contactoData) notFound();

  const contacto = contactoData as Contacto;

  const [{ data: interesesData }, { data: propiedadesData }, { data: mensajesData }] = await Promise.all([
    supabase
      .from('interes_propiedad')
      .select('*, propiedad:propiedades(referencia, titulo, zona, precio)')
      .eq('contacto_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('propiedades')
      .select('id, referencia, titulo')
      .order('referencia'),
    supabase
      .from('mensajes')
      .select('*, propiedad:propiedades(referencia)')
      .eq('contacto_id', id)
      .order('recibido_en', { ascending: false }),
  ]);

  const intereses = (interesesData ?? []) as InteresPropiedad[];
  const propiedades = (propiedadesData ?? []) as { id: string; referencia: string; titulo: string | Record<string, string> }[];
  const mensajes = (mensajesData ?? []) as Mensaje[];
  const pref = (contacto.preferencias ?? {}) as PreferenciasContacto;

  return (
    <div className="space-y-6">
      {/* Back link */}
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
          <h1 className="font-heading text-2xl font-bold">{contacto.nombre}</h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Link
            href={`/${locale}/admin/mensajes/nueva?contacto_id=${contacto.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            Nuevo mensaje
          </Link>
          <Link
            href={`/${locale}/admin/contactos/${contacto.id}/editar`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Link>
          <ContactoDeleteButton
            id={contacto.id}
            nombre={contacto.nombre}
            redirectOnDelete={`/${locale}/admin/contactos`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact info card */}
        <div className="bg-card border border-border rounded-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Información de contacto
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-28 text-muted-foreground shrink-0">Nombre</dt>
              <dd className="font-medium">{contacto.nombre}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 text-muted-foreground shrink-0">Email</dt>
              <dd>
                {contacto.email ? (
                  <a
                    href={`mailto:${contacto.email}`}
                    className="text-primary hover:underline"
                  >
                    {contacto.email}
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 text-muted-foreground shrink-0">Teléfono</dt>
              <dd>
                {contacto.telefono ? (
                  <a
                    href={`tel:${contacto.telefono}`}
                    className="text-primary hover:underline"
                  >
                    {contacto.telefono}
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 text-muted-foreground shrink-0">Origen</dt>
              <dd>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${ORIGEN_COLORS[contacto.origen] ?? 'bg-gray-100 text-gray-700'}`}
                >
                  {contacto.origen}
                </span>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 text-muted-foreground shrink-0">Registro</dt>
              <dd className="text-muted-foreground">
                {new Date(contacto.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
            {contacto.notas && (
              <div className="flex gap-3">
                <dt className="w-28 text-muted-foreground shrink-0">Notas</dt>
                <dd className="text-muted-foreground whitespace-pre-wrap">{contacto.notas}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Preferencias card */}
        <div className="bg-card border border-border rounded-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Preferencias
            </h2>
            {typeof pref.activo === 'boolean' && (
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${pref.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}
              >
                {pref.activo ? 'Perfil activo' : 'Perfil inactivo'}
              </span>
            )}
          </div>
          {Object.keys(pref).length === 0 || (!pref.operacion && !pref.tipo?.length && pref.presupuesto_max == null && pref.metros_min == null && pref.habitaciones_min == null && !pref.zonas_preferidas?.length) ? (
            <p className="text-sm text-muted-foreground">Sin preferencias registradas</p>
          ) : (
            <dl className="space-y-3 text-sm">
              {pref.operacion && (
                <div className="flex gap-3">
                  <dt className="w-32 text-muted-foreground shrink-0">Operación</dt>
                  <dd className="capitalize font-medium">{pref.operacion}</dd>
                </div>
              )}
              {pref.tipo && pref.tipo.length > 0 && (
                <div className="flex gap-3">
                  <dt className="w-32 text-muted-foreground shrink-0">Tipo</dt>
                  <dd className="flex flex-wrap gap-1">
                    {pref.tipo.map((t) => (
                      <span
                        key={t}
                        className="inline-block px-2 py-0.5 rounded bg-muted text-xs font-medium capitalize"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {pref.presupuesto_max != null && (
                <div className="flex gap-3">
                  <dt className="w-32 text-muted-foreground shrink-0">Presupuesto máx.</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatPrice(pref.presupuesto_max, 'es')}
                  </dd>
                </div>
              )}
              {pref.metros_min != null && (
                <div className="flex gap-3">
                  <dt className="w-32 text-muted-foreground shrink-0">Metros mín.</dt>
                  <dd>{pref.metros_min} m²</dd>
                </div>
              )}
              {pref.habitaciones_min != null && (
                <div className="flex gap-3">
                  <dt className="w-32 text-muted-foreground shrink-0">Habitaciones mín.</dt>
                  <dd>{pref.habitaciones_min}</dd>
                </div>
              )}
              {pref.zonas_preferidas && pref.zonas_preferidas.length > 0 && (
                <div className="flex gap-3">
                  <dt className="w-32 text-muted-foreground shrink-0">Zonas</dt>
                  <dd className="flex flex-col gap-1">
                    {pref.zonas_preferidas.map((z, i) => (
                      <span key={i} className="text-xs">
                        {z.nombre}{' '}
                        <span className="text-muted-foreground">({z.radio_km} km)</span>
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>

      {/* Propiedades de interés */}
      <InteresesContactoSection
        contactoId={id}
        intereses={intereses}
        propiedades={propiedades}
        locale={locale}
      />

      {/* Mensajes */}
      <MensajesContactoSection mensajes={mensajes} locale={locale} contactoId={id} />
    </div>
  );
}
