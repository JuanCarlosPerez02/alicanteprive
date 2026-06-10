import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/public/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('C. Álvarez Sereix 11, 03001 Alicante');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('contact_title') };
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-2">
          Alicante Privé
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold">{t('title')}</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">{t('subtitle')}</p>
      </div>

      {/* Info + Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Contact info */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-sans">Email</p>
              <a href="mailto:info@alicanteprive.com" className="text-sm hover:text-gold transition-colors break-all">
                info@alicanteprive.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-sans">Teléfono</p>
              <a href="tel:+34603248668" className="text-sm hover:text-gold transition-colors">
                +34 603 248 668
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-sans">Dirección</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="not-italic text-sm text-muted-foreground hover:text-gold transition-colors"
              >
                C. Alvarez Sereix 11<br />
                Entreplanta derecha<br />
                03001 Alicante
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3 bg-card border border-border rounded-sm p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
