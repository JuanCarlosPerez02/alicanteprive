import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Building2, Users, MessageSquare, CalendarClock } from 'lucide-react';

export default async function AdminDashboard() {
  const t = await getTranslations('admin');
  const supabase = await createClient();

  // Fetch basic counts
  const [
    { count: totalProps },
    { count: activeProps },
    { count: newContacts },
    { count: unreadMsgs },
  ] = await Promise.all([
    supabase.from('propiedades').select('*', { count: 'exact', head: true }),
    supabase
      .from('propiedades')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'disponible'),
    supabase
      .from('contactos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('mensajes').select('*', { count: 'exact', head: true }).eq('leido', false),
  ]);

  const stats = [
    {
      label: t('total_properties'),
      value: totalProps ?? 0,
      icon: Building2,
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      label: t('active_properties'),
      value: activeProps ?? 0,
      icon: Building2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('new_contacts'),
      value: newContacts ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t('unread_messages'),
      value: unreadMsgs ?? 0,
      icon: MessageSquare,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground mb-8">
        {t('dashboard_title')}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-sm p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-sm ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
