import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const zonaSchema = z.object({
  nombre: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  radio_km: z.number().positive(),
});

const schema = z.object({
  nombre: z.string().min(1),
  email: z.string().email().nullable().optional(),
  telefono: z.string().nullable().optional(),
  origen: z.enum(['web', 'idealista', 'fotocasa', 'manual', 'otro']),
  notas: z.string().nullable().optional(),
  preferencias: z.object({
    activo: z.boolean().optional(),
    operacion: z.enum(['venta', 'alquiler']).nullable().optional(),
    tipo: z.array(z.string()).optional(),
    presupuesto_max: z.number().positive().nullable().optional(),
    metros_min: z.number().positive().nullable().optional(),
    habitaciones_min: z.number().int().positive().nullable().optional(),
    zonas_preferidas: z.array(zonaSchema).optional(),
  }).default({}),
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
      .from('contactos')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('[PUT /api/admin/contactos/:id]', err);
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

  const { error } = await supabase.from('contactos').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
