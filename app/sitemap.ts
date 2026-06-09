import type { MetadataRoute } from 'next';
import { createServiceClient } from '@/lib/supabase/service';
import { routing } from '@/i18n/routing';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.alicanteprive.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient();
  const { data: propiedades } = await supabase
    .from('propiedades')
    .select('referencia, updated_at')
    .neq('estado', 'oculta');

  const staticPages = ['', '/propiedades', '/contacto'];

  const localeEntries = routing.locales.flatMap((locale) =>
    staticPages.map((path) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    }))
  );

  const propertyEntries = (propiedades ?? []).flatMap((p) =>
    routing.locales.map((locale) => ({
      url: `${BASE}/${locale}/propiedades/${p.referencia}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...localeEntries, ...propertyEntries];
}
