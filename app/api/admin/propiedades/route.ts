import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { PROPIEDADES_TAG } from '@/lib/propiedades';

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

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { data: propiedad, error } = await supabase
      .from('propiedades')
      .insert(data)
      .select('id')
      .single();

    if (error) throw error;
    revalidateTag(PROPIEDADES_TAG, { expire: 0 });
    return NextResponse.json({ id: propiedad.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.issues }, { status: 400 });
    }
    console.error('[POST /api/admin/propiedades]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
