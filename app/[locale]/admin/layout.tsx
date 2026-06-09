import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';
import { SidebarProvider } from '@/components/admin/SidebarContext';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const { count: unreadMensajes } = await supabase
    .from('mensajes')
    .select('*', { count: 'exact', head: true })
    .eq('leido', false);

  return (
    <SidebarProvider>
      <AdminShell locale={locale} unreadMensajes={unreadMensajes ?? 0}>
        {children}
      </AdminShell>
    </SidebarProvider>
  );
}
