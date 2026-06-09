import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  contacto_id: z.string().uuid(),
  propiedad_id: z.string().uuid(),
  origen: z.enum(['web', 'idealista', 'fotocasa', 'manual', 'otro']).default('manual'),
  estado: z.enum(['nuevo', 'contactado', 'visita_pendiente', 'visito', 'no_visito', 'descartado', 'cerrado']).default('nuevo'),
  notas: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { data: interes, error } = await supabase
      .from('interes_propiedad')
      .upsert(data, { onConflict: 'contacto_id,propiedad_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ interes }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error('[POST /api/admin/intereses]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
