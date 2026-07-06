import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { buscarClientesPotenciales } from '@/lib/matching';
import Link from 'next/link';
import { ArrowLeft, Pencil, Download } from 'lucide-react';
import PropiedadResumen from '@/components/admin/PropiedadResumen';
import InteresadosSection from '@/components/admin/InteresadosSection';
import MatchingTab from '@/components/admin/MatchingTab';
import PropiedadDeleteButton from '@/components/admin/PropiedadDeleteButton';
import type { Contacto, InteresPropiedad } from '@/types';

interface Props {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function PropiedadDetailPage({ params, searchParams }: Props) {
  const { locale, id } = await params;
  const { from } = await searchParams;
  const backHref = from ?? `/${locale}/admin/propiedades`;
  const backLabel = from?.includes('/contactos/') ? 'Volver al contacto' : 'Volver a propiedades';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data: propiedad } = await supabase
    .from('propiedades')
    .select('*, propiedad_fotos(*)')
    .eq('id', id)
    .single();

  if (!propiedad) notFound();

  const [{ data: interesesData }, { data: contactosData }, { data: todosContactos }] =
    await Promise.all([
      supabase
        .from('interes_propiedad')
        .select('*, contacto:contactos(*)')
        .eq('propiedad_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('contactos')
        .select('*')
        .eq('preferencias->>activo', 'true'),
      supabase
        .from('contactos')
        .select('id, nombre, email')
        .order('nombre'),
    ]);

  const intereses = (interesesData ?? []) as InteresPropiedad[];
  const matches = buscarClientesPotenciales(propiedad, (contactosData ?? []) as Contacto[]);

  const titulo = typeof propiedad.titulo === 'object'
    ? (propiedad.titulo as Record<string, string>).es ?? propiedad.referencia
    : propiedad.referencia;

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
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {propiedad.referencia}
          </p>
          <h1 className="font-heading text-2xl font-bold line-clamp-2">{titulo}</h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <a
            href={`/api/admin/export?id=${id}`}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar CSV
          </a>
          <Link
            href={`/${locale}/admin/propiedades/${id}/editar`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Link>
          <PropiedadDeleteButton id={id} referencia={propiedad.referencia} />
        </div>
      </div>

      {/* Overview */}
      <PropiedadResumen propiedad={propiedad} locale={locale} />

      {/* Interesados — add + edit inline */}
      <InteresadosSection
        propiedadId={id}
        intereses={intereses}
        contactos={(todosContactos ?? []) as { id: string; nombre: string; email: string | null }[]}
        locale={locale}
      />

      {/* Clientes potenciales */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-heading text-base font-semibold">
            Clientes potenciales
            <span className="ml-2 text-muted-foreground font-normal text-sm">({matches.length})</span>
          </h2>
        </div>
        <div className="p-5">
          <MatchingTab matches={matches} locale={locale} propiedadId={id} />
        </div>
      </div>
    </div>
  );
}
