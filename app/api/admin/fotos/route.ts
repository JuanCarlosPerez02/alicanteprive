import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const propiedadId = formData.get('propiedadId') as string;
  const orden = parseInt(formData.get('orden') as string) || 1;

  if (!file || !propiedadId) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'La foto supera el límite de 5MB' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${propiedadId}/${Date.now()}.${ext}`;

  const service = createServiceClient();
  const { error: storageError } = await service.storage
    .from('propiedades')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = service.storage
    .from('propiedades')
    .getPublicUrl(path);

  const { data: foto, error: dbError } = await supabase
    .from('propiedad_fotos')
    .insert({
      propiedad_id: propiedadId,
      url: publicUrl,
      orden,
      es_portada: orden === 1,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ foto });
}
