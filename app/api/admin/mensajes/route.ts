import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const nuevoContactoSchema = z.object({
  nombre: z.string().min(1),
  email: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  origen: z.enum(['web', 'idealista', 'fotocasa', 'manual', 'otro']),
});

const schema = z.object({
  texto: z.string().min(1, 'El mensaje no puede estar vacío'),
  origen: z.enum(['web', 'idealista', 'fotocasa', 'manual', 'otro']),
  propiedad_id: z.string().uuid().nullable().optional(),
  contacto_id: z.string().uuid().nullable().optional(),
  nuevo_contacto: nuevoContactoSchema.nullable().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    let contacto_id = data.contacto_id ?? null;

    // Create new contact if provided
    if (data.nuevo_contacto) {
      const { data: contacto, error } = await supabase
        .from('contactos')
        .insert({
          nombre: data.nuevo_contacto.nombre,
          email: data.nuevo_contacto.email ?? null,
          telefono: data.nuevo_contacto.telefono ?? null,
          origen: data.nuevo_contacto.origen,
          preferencias: {},
        })
        .select('id')
        .single();

      if (error) throw error;
      contacto_id = contacto.id;
    }

    // Create the message
    const { data: mensaje, error: msgError } = await supabase
      .from('mensajes')
      .insert({
        texto: data.texto,
        origen: data.origen,
        propiedad_id: data.propiedad_id ?? null,
        contacto_id,
        leido: false,
      })
      .select()
      .single();

    if (msgError) throw msgError;

    // Auto-create interes_propiedad if both contact and property are linked
    if (contacto_id && data.propiedad_id) {
      await supabase
        .from('interes_propiedad')
        .upsert(
          {
            contacto_id,
            propiedad_id: data.propiedad_id,
            origen: data.origen,
            estado: 'nuevo',
          },
          { onConflict: 'contacto_id,propiedad_id', ignoreDuplicates: true }
        );
    }

    return NextResponse.json({ mensaje, contacto_id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('[POST /api/admin/mensajes]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
