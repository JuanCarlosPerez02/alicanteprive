import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Gets the localized text from a JSONB {es, en, fr, de} field with fallback to 'es'. */
export function getLocalizedText(
  jsonb: Record<string, string> | null | undefined,
  locale: string,
  fallback = 'es'
): string {
  if (!jsonb) return '';
  return jsonb[locale] || jsonb[fallback] || Object.values(jsonb)[0] || '';
}

/** Formats price with thousands separator and optional currency. */
export function formatPrice(price: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

/** Agency WhatsApp number in international format, no '+' (wa.me links). */
export const WHATSAPP_PHONE = '34603248668';

/** Gets the cover photo URL from a property's fotos array. */
export function getCoverPhoto(fotos: { url: string; es_portada: boolean; orden: number }[]): string | null {
  if (!fotos || fotos.length === 0) return null;
  const portada = fotos.find((f) => f.es_portada);
  if (portada) return portada.url;
  return [...fotos].sort((a, b) => a.orden - b.orden)[0]?.url ?? null;
}
