'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
  AreaChart, Area,
} from 'recharts';

export interface AnalyticsData {
  totals: {
    propiedades: number;
    disponibles: number;
    contactos: number;
    mensajesSinLeer: number;
    valorDisponible: number;
  };
  byEstado: { estado: string; count: number }[];
  byTipo: { tipo: string; count: number }[];
  byOperacion: { operacion: string; count: number }[];
  contactosByMes: { mes: string; count: number }[];
  contactosByOrigen: { origen: string; count: number }[];
  interesesByEstado: { estado: string; count: number }[];
}

const GOLD = '#c9a84c';
const NAVY = '#1e2d54';
const PALETTE = ['#c9a84c', '#1e2d54', '#22c55e', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#14b8a6'];

const ESTADO_COLORS: Record<string, string> = {
  disponible: '#22c55e',
  reservada: '#f59e0b',
  vendida: '#3b82f6',
  alquilada: '#8b5cf6',
  oculta: '#9ca3af',
};

const INTERES_ORDER = ['nuevo', 'contactado', 'visita_pendiente', 'visito', 'no_visito', 'descartado', 'cerrado'];
const INTERES_LABELS: Record<string, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  visita_pendiente: 'Visita pdte.',
  visito: 'Visitó',
  no_visito: 'No visitó',
  descartado: 'Descartado',
  cerrado: 'Cerrado',
};

function fmtEur(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M €`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K €`;
  return `${n} €`;
}

function SummaryCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-sm p-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="font-heading text-3xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-sm p-5 ${className}`}>
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-sm px-3 py-2 text-xs shadow-md">
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.name === 'count' ? GOLD : undefined }}>
          {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  const { totals, byEstado, byTipo, byOperacion, contactosByMes, contactosByOrigen, interesesByEstado } = data;

  const sortedIntereses = [...interesesByEstado].sort(
    (a, b) => INTERES_ORDER.indexOf(a.estado) - INTERES_ORDER.indexOf(b.estado)
  );

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total propiedades" value={totals.propiedades} />
        <SummaryCard label="Disponibles" value={totals.disponibles} sub={`Valor: ${fmtEur(totals.valorDisponible)}`} />
        <SummaryCard label="Total contactos" value={totals.contactos} />
        <SummaryCard label="Mensajes sin leer" value={totals.mensajesSinLeer} />
      </div>

      {/* Row 2: Donut estado + Donut operacion + Bar tipo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="Propiedades por estado">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={byEstado.filter((d) => d.count > 0)}
                dataKey="count"
                nameKey="estado"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {byEstado.map((d) => (
                  <Cell key={d.estado} fill={ESTADO_COLORS[d.estado] ?? '#9ca3af'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs capitalize">{value}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Venta vs Alquiler">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={byOperacion.filter((d) => d.count > 0)}
                dataKey="count"
                nameKey="operacion"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {byOperacion.map((d, i) => (
                  <Cell key={d.operacion} fill={PALETTE[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs capitalize">{value}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Propiedades por tipo">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byTipo} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="tipo" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={GOLD} radius={[0, 2, 2, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Area chart contactos por mes */}
      <ChartCard title="Nuevos contactos por mes (últimos 6 meses)">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={contactosByMes} margin={{ left: 0, right: 8 }}>
            <defs>
              <linearGradient id="gradContacots" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GOLD} stopOpacity={0.2} />
                <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={GOLD}
              strokeWidth={2}
              fill="url(#gradContacots)"
              dot={{ fill: GOLD, r: 4 }}
              activeDot={{ r: 6, fill: NAVY }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Row 4: Leads por origen + Estado de leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Contactos por origen">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={contactosByOrigen} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="origen" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={48}>
                {contactosByOrigen.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Estado de intereses (leads)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sortedIntereses} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="estado"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={80}
                tickFormatter={(v) => INTERES_LABELS[v] ?? v}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0];
                  return (
                    <div className="bg-card border border-border rounded-sm px-3 py-2 text-xs shadow-md">
                      <p className="font-semibold">{INTERES_LABELS[item.name as string] ?? item.name}: {item.value}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" fill={NAVY} radius={[0, 2, 2, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
