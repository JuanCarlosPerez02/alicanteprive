import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const zonaSchema = z.object({
  nombre: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  radio_km: z.number().positive(),
});

const prefSchema = z.object({
  activo: z.boolean().optional(),
  operacion: z.enum(['venta', 'alquiler']).nullable().optional(),
  tipo: z.array(z.string()).optional(),
  presupuesto_max: z.number().positive().nullable().optional(),
  metros_min: z.number().positive().nullable().optional(),
  habitaciones_min: z.number().int().positive().nullable().optional(),
  zonas_preferidas: z.array(zonaSchema).optional(),
}).default({});

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido').nullable().optional(),
  telefono: z.string().nullable().optional(),
  origen: z.enum(['web', 'idealista', 'fotocasa', 'manual', 'otro']).default('manual'),
  notas: z.string().nullable().optional(),
  preferencias: prefSchema,
});

async function getAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await getAuth();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { data: contacto, error } = await supabase
      .from('contactos')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ contacto }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('[POST /api/admin/contactos]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
