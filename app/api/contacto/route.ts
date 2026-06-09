import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  mensaje: z.string().min(5),
  propiedadId: z.string().uuid().optional(),
  propiedadReferencia: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const supabase = createServiceClient();

    // Find or create contacto
    let contactoId: string;

    const { data: existing } = await supabase
      .from('contactos')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();

    if (existing) {
      contactoId = existing.id;
    } else {
      const { data: nuevo, error } = await supabase
        .from('contactos')
        .insert({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono ?? null,
          origen: 'web',
        })
        .select('id')
        .single();

      if (error || !nuevo) throw error;
      contactoId = nuevo.id;
    }

    // Resolve propiedad_id by referencia if not provided directly
    let propiedadId = data.propiedadId ?? null;
    if (!propiedadId && data.propiedadReferencia) {
      const { data: prop } = await supabase
        .from('propiedades')
        .select('id')
        .eq('referencia', data.propiedadReferencia)
        .maybeSingle();
      propiedadId = prop?.id ?? null;
    }

    // Create interes_propiedad if we have a property
    if (propiedadId) {
      await supabase.from('interes_propiedad').upsert(
        { contacto_id: contactoId, propiedad_id: propiedadId, origen: 'web' },
        { onConflict: 'contacto_id,propiedad_id', ignoreDuplicates: true }
      );
    }

    // Create mensaje
    await supabase.from('mensajes').insert({
      contacto_id: contactoId,
      propiedad_id: propiedadId,
      origen: 'web',
      texto: data.mensaje,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error('[/api/contacto]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
