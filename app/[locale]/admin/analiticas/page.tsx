import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AnalyticsCharts, { type AnalyticsData } from '@/components/admin/AnalyticsCharts';

export const metadata = { title: 'Analíticas — Admin' };

interface Props {
  params: Promise<{ locale: string }>;
}

function groupByKey<T extends Record<string, string>>(
  items: T[],
  key: keyof T
): { [k: string]: number } {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    const val = item[key] as string;
    map[val] = (map[val] ?? 0) + 1;
  });
  return map;
}

export default async function AnaliticasPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  // Fetch all data in parallel
  const [
    { data: propiedades },
    { data: contactos },
    { data: intereses },
    { count: mensajesSinLeer },
  ] = await Promise.all([
    supabase.from('propiedades').select('id, estado, tipo, operacion, precio, created_at'),
    supabase.from('contactos').select('id, origen, created_at'),
    supabase.from('interes_propiedad').select('id, estado, origen, created_at'),
    supabase.from('mensajes').select('*', { count: 'exact', head: true }).eq('leido', false),
  ]);

  const props = propiedades ?? [];
  const contacts = contactos ?? [];
  const ints = intereses ?? [];

  // Propiedades by estado
  const estadoMap = groupByKey(props as { estado: string }[], 'estado');
  const byEstado = ['disponible', 'reservada', 'vendida', 'alquilada', 'oculta'].map(
    (estado) => ({ estado, count: estadoMap[estado] ?? 0 })
  );

  // Propiedades by tipo
  const tipoMap = groupByKey(props as { tipo: string }[], 'tipo');
  const byTipo = Object.entries(tipoMap)
    .map(([tipo, count]) => ({ tipo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Propiedades by operacion
  const opMap = groupByKey(props as { operacion: string }[], 'operacion');
  const byOperacion = ['venta', 'alquiler'].map((operacion) => ({
    operacion,
    count: opMap[operacion] ?? 0,
  }));

  // Contactos por mes (last 6 months)
  const now = new Date();
  const contactosByMes = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    const count = contacts.filter((c) => {
      const cd = new Date(c.created_at);
      return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
    }).length;
    return { mes: label, count };
  });

  // Contactos por origen
  const origenMap = groupByKey(contacts as { origen: string }[], 'origen');
  const contactosByOrigen = Object.entries(origenMap)
    .map(([origen, count]) => ({ origen, count }))
    .sort((a, b) => b.count - a.count);

  // Intereses por estado
  const interesEstadoMap = groupByKey(ints as { estado: string }[], 'estado');
  const interesesByEstado = Object.entries(interesEstadoMap).map(([estado, count]) => ({
    estado,
    count,
  }));

  // Totals
  const disponibles = props.filter((p) => (p as { estado: string }).estado === 'disponible');
  const valorDisponible = disponibles.reduce((sum, p) => sum + ((p as { precio: number }).precio ?? 0), 0);

  const analyticsData: AnalyticsData = {
    totals: {
      propiedades: props.length,
      disponibles: disponibles.length,
      contactos: contacts.length,
      mensajesSinLeer: mensajesSinLeer ?? 0,
      valorDisponible,
    },
    byEstado,
    byTipo,
    byOperacion,
    contactosByMes,
    contactosByOrigen,
    interesesByEstado,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Analíticas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Visión general del negocio — propiedades, contactos y leads
        </p>
      </div>

      <AnalyticsCharts data={analyticsData} />
    </div>
  );
}
