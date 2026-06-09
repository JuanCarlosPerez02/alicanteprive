import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import KanbanBoard from '@/components/admin/KanbanBoard';
import type { Propiedad } from '@/types';

export const metadata = { title: 'Kanban — Admin' };

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function KanbanPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data } = await supabase
    .from('propiedades')
    .select('*, propiedad_fotos(*)')
    .order('created_at', { ascending: false });

  const propiedades = (data ?? []) as Propiedad[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Kanban de propiedades</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Arrastra las tarjetas entre columnas para cambiar el estado de cada propiedad
        </p>
      </div>

      <KanbanBoard propiedades={propiedades} locale={locale} />
    </div>
  );
}
