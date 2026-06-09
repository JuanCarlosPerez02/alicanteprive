import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContactoForm from '@/components/admin/ContactoForm';
import type { Contacto } from '@/types';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('contactos').select('nombre').eq('id', id).single();
  return { title: data ? `Editar ${data.nombre} — Admin` : 'Editar contacto — Admin' };
}

export default async function EditarContactoPage({ params }: Props) {
  const { locale, id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data } = await supabase.from('contactos').select('*').eq('id', id).single();
  if (!data) notFound();

  const contacto = data as Contacto;

  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}/admin/contactos/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al contacto
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold">{contacto.nombre}</h1>
      </div>

      <ContactoForm contacto={contacto} locale={locale} />
    </div>
  );
}
