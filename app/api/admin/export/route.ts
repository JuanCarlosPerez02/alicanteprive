import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Propiedad } from '@/types';

// CSV cell: always quoted, inner quotes doubled (descriptions contain
// newlines and semicolons).
function cell(v: unknown): string {
  if (v === null || v === undefined) return '""';
  return `"${String(v).replace(/"/g, '""')}"`;
}

const HEADERS = [
  'referencia', 'operacion', 'tipo', 'titulo', 'descripcion', 'precio',
  'zona', 'direccion', 'lat', 'lng', 'metros', 'habitaciones', 'banos',
  'caracteristicas', 'estado', 'destacada', 'referencia_idealista', 'fotos',
];

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data, error } = await supabase
    .from('propiedades')
    .select('*, propiedad_fotos(url, orden, es_portada)')
    .order('referencia', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = ((data as Propiedad[]) ?? []).map((p) => {
    const fotos = [...(p.propiedad_fotos ?? [])]
      .sort((a, b) => Number(b.es_portada) - Number(a.es_portada) || a.orden - b.orden)
      .map((f) => f.url);
    const titulo = (p.titulo as Record<string, string>)?.es ?? '';
    const descripcion = (p.descripcion as Record<string, string>)?.es ?? '';
    const caracteristicas = Array.isArray(p.caracteristicas)
      ? (p.caracteristicas as string[]).join(', ')
      : '';

    return [
      p.referencia, p.operacion, p.tipo, titulo, descripcion, p.precio,
      p.zona, p.direccion, p.lat, p.lng, p.metros, p.habitaciones, p.banos,
      caracteristicas, p.estado, p.destacada ? 'sí' : 'no',
      p.referencia_idealista, fotos.join(' | '),
    ].map(cell).join(';');
  });

  // BOM + semicolons → opens correctly in Spanish-locale Excel.
  const csv = '\uFEFF' + [HEADERS.map(cell).join(';'), ...rows].join('\r\n');
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="propiedades-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
