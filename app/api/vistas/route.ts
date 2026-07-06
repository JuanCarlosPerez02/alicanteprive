import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const schema = z.object({ id: z.string().uuid() });

export async function POST(req: NextRequest) {
  try {
    const { id } = schema.parse(await req.json());
    const supabase = createServiceClient();
    const { error } = await supabase.rpc('registrar_visita', { prop_id: id });
    if (error) {
      console.error('[/api/vistas]', error.message);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
}
