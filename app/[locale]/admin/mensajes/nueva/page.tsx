import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MensajeForm from '@/components/admin/MensajeForm';
import type { Propiedad, Contacto } from '@/types';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ propiedad_id?: string }>;
}

export const metadata = { title: 'Nuevo mensaje — Admin' };

export default async function NuevoMensajePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { propiedad_id } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const [{ data: propiedades }, { data: contactos }] = await Promise.all([
    supabase
      .from('propiedades')
      .select('id, referencia, titulo, zona, precio, operacion')
      .neq('estado', 'oculta')
      .order('referencia'),
    supabase
      .from('contactos')
      .select('id, nombre, email, telefono, origen')
      .order('nombre'),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Nuevo mensaje</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registra una consulta recibida por Idealista, Fotocasa, teléfono u otro canal
        </p>
      </div>
      <MensajeForm
        propiedades={(propiedades ?? []) as Propiedad[]}
        contactos={(contactos ?? []) as Contacto[]}
        locale={locale}
        propiedadPreseleccionada={propiedad_id}
      />
    </div>
  );
}
