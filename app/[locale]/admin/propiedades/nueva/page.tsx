import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PropiedadForm from '@/components/admin/PropiedadForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata = { title: 'Nueva propiedad — Admin' };

export default async function NuevaPropiedadPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Nueva propiedad</h1>
        <p className="text-sm text-muted-foreground mt-1">Crea una nueva propiedad en el portfolio</p>
      </div>
      <PropiedadForm locale={locale} />
    </div>
  );
}
