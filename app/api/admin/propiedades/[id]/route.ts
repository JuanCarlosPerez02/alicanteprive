import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  referencia: z.string().min(1),
  operacion: z.enum(['venta', 'alquiler']),
  tipo: z.string().min(1),
  titulo: z.record(z.string(), z.string()),
  descripcion: z.record(z.string(), z.string()),
  precio: z.number().positive(),
  zona: z.string().optional(),
  direccion: z.string().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  metros: z.number().int().nullable().optional(),
  habitaciones: z.number().int().nullable().optional(),
  banos: z.number().int().nullable().optional(),
  caracteristicas: z.array(z.string()),
  estado: z.enum(['disponible', 'reservada', 'vendida', 'alquilada', 'oculta']),
  destacada: z.boolean(),
  referencia_idealista: z.string().optional(),
  referencia_fotocasa: z.string().optional(),
});

async function getAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, user } = await getAuth();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { error } = await supabase
      .from('propiedades')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error('[PUT /api/admin/propiedades/:id]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, user } = await getAuth();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { error } = await supabase.from('propiedades').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, user } = await getAuth();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  const { error } = await supabase.from('propiedades').update(body).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
