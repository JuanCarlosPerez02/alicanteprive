import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PropiedadForm from '@/components/admin/PropiedadForm';
import FotoManager from '@/components/admin/FotoManager';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('propiedades').select('referencia').eq('id', id).single();
  return { title: data ? `Editar ${data.referencia} — Admin` : 'Editar propiedad — Admin' };
}

export default async function EditarPropiedadPage({ params }: Props) {
  const { locale, id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data: propiedad } = await supabase
    .from('propiedades')
    .select('*, propiedad_fotos(*)')
    .eq('id', id)
    .single();

  if (!propiedad) notFound();

  const fotos = (propiedad.propiedad_fotos ?? []).sort(
    (a: { orden: number }, b: { orden: number }) => a.orden - b.orden
  );

  const titulo = typeof propiedad.titulo === 'object'
    ? (propiedad.titulo as Record<string, string>).es ?? propiedad.referencia
    : propiedad.referencia;

  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}/admin/propiedades/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la propiedad
      </Link>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {propiedad.referencia}
        </p>
        <h1 className="font-heading text-2xl font-bold line-clamp-2">{titulo}</h1>
      </div>

      <PropiedadForm propiedad={propiedad} locale={locale} />

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-heading text-base font-semibold">Fotos</h2>
        </div>
        <div className="p-5">
          <FotoManager propiedadId={id} initialFotos={fotos} />
        </div>
      </div>
    </div>
  );
}
