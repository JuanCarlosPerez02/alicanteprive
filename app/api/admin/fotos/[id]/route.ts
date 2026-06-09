import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

async function getAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, user } = await getAuth();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  // Delete from Storage if URL provided
  try {
    const body = await req.json();
    if (body?.url) {
      const url = new URL(body.url);
      const pathParts = url.pathname.split('/propiedades/');
      if (pathParts[1]) {
        const service = createServiceClient();
        await service.storage.from('propiedades').remove([pathParts[1]]);
      }
    }
  } catch {
    // URL parsing is best-effort
  }

  const { error } = await supabase.from('propiedad_fotos').delete().eq('id', id);
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
  const { error } = await supabase.from('propiedad_fotos').update(body).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
