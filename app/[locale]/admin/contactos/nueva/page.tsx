import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ContactoForm from '@/components/admin/ContactoForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata = { title: 'Nuevo contacto — Admin' };

export default async function NuevoContactoPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Nuevo contacto</h1>
        <p className="text-sm text-muted-foreground mt-1">Crea un nuevo lead o cliente</p>
      </div>
      <ContactoForm locale={locale} />
    </div>
  );
}
