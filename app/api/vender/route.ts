import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(6),
  direccion: z.string().min(3),
  tipo: z.string().min(1),
  metros: z.string().optional(),
  detalles: z.string().optional(),
  aceptaPrivacidad: z.literal(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const supabase = createServiceClient();
    const now = new Date().toISOString();

    // Find or create contacto (seller lead)
    let contactoId: string;
    const { data: existing } = await supabase
      .from('contactos')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();

    if (existing) {
      contactoId = existing.id;
      await supabase
        .from('contactos')
        .update({ telefono: data.telefono, acepta_privacidad_at: now })
        .eq('id', contactoId);
    } else {
      const { data: nuevo, error } = await supabase
        .from('contactos')
        .insert({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          origen: 'vendedor',
          acepta_privacidad_at: now,
        })
        .select('id')
        .single();
      if (error || !nuevo) throw error;
      contactoId = nuevo.id;
    }

    // Valuation request as a message so it shows up with the unread badge
    const texto = [
      '[SOLICITUD DE VALORACIÓN — VENDEDOR]',
      `Dirección/zona: ${data.direccion}`,
      `Tipo: ${data.tipo}`,
      data.metros ? `Superficie aprox.: ${data.metros} m²` : null,
      data.detalles ? `\n${data.detalles}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const { error: msgError } = await supabase.from('mensajes').insert({
      contacto_id: contactoId,
      origen: 'vendedor',
      texto,
    });
    if (msgError) throw msgError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error('[/api/vender]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
