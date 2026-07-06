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

  // Views window: last 30 days. Computed in a Server Component — runs once
  // per request on the server, not during React reconciliation.
  // eslint-disable-next-line react-hooks/purity
  const desde30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  // Fetch all data in parallel
  const [
    { data: propiedades },
    { data: contactos },
    { data: intereses },
    { count: mensajesSinLeer },
    { data: visitasRaw },
  ] = await Promise.all([
    supabase.from('propiedades').select('id, estado, tipo, operacion, precio, created_at'),
    supabase.from('contactos').select('id, origen, created_at'),
    supabase.from('interes_propiedad').select('id, estado, origen, created_at'),
    supabase.from('mensajes').select('*', { count: 'exact', head: true }).eq('leido', false),
    supabase
      .from('propiedad_visitas')
      .select('visitas, propiedad:propiedades(referencia, titulo)')
      .gte('dia', desde30),
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

  // Most viewed properties (last 30 days) — aggregate daily rows per property
  type VisitaRow = {
    visitas: number;
    propiedad: { referencia: string; titulo: Record<string, string> } | null;
  };
  const vistasPorProp = new Map<string, { referencia: string; titulo: string; total: number }>();
  ((visitasRaw as unknown as VisitaRow[]) ?? []).forEach((v) => {
    if (!v.propiedad) return;
    const key = v.propiedad.referencia;
    const cur = vistasPorProp.get(key);
    if (cur) cur.total += v.visitas;
    else
      vistasPorProp.set(key, {
        referencia: key,
        titulo: v.propiedad.titulo?.es ?? key,
        total: v.visitas,
      });
  });
  const masVistas = [...vistasPorProp.values()].sort((a, b) => b.total - a.total).slice(0, 8);

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

      {/* Most viewed properties (web) — last 30 days */}
      <div className="mt-6 bg-card border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-heading text-base font-semibold">
            Propiedades más vistas en la web
            <span className="ml-2 text-muted-foreground font-normal text-sm">(últimos 30 días)</span>
          </h2>
        </div>
        {masVistas.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground text-center">
            Aún no hay visitas registradas.
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {masVistas.map((v, i) => (
                <tr key={v.referencia} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-muted-foreground w-8 tabular-nums">{i + 1}</td>
                  <td className="px-2 py-3">
                    <span className="font-medium">{v.titulo}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{v.referencia}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">
                    {v.total} {v.total === 1 ? 'visita' : 'visitas'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
