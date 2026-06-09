import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return { title: t('meta_title') };
}

export default async function PoliticaPrivacidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  const rights = [
    { label: t('s6_li1_label'), text: t('s6_li1_text') },
    { label: t('s6_li2_label'), text: t('s6_li2_text') },
    { label: t('s6_li3_label'), text: t('s6_li3_text') },
    { label: t('s6_li4_label'), text: t('s6_li4_text') },
    { label: t('s6_li5_label'), text: t('s6_li5_text') },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-2">
          Alicante Privé
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold">{t('title')}</h1>
        <p className="text-muted-foreground mt-3 text-sm">{t('updated')}</p>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">{t('s1_title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('s1_intro')}</p>
          <ul className="mt-3 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">{t('s1_name_label')}:</strong> Alicante Privé</li>
            <li><strong className="text-foreground">{t('s1_address_label')}:</strong> C. Alvarez Sereix 11, Entreplanta derecha, 03001 Alicante</li>
            <li>
              <strong className="text-foreground">Email:</strong>{' '}
              <a href="mailto:info@alicanteprive.com" className="hover:text-gold transition-colors underline">
                info@alicanteprive.com
              </a>
            </li>
            <li>
              <strong className="text-foreground">Tel:</strong>{' '}
              <a href="tel:+34603248668" className="hover:text-gold transition-colors underline">
                +34 603 248 668
              </a>
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">{t('s2_title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('s2_intro')}</p>
          <ul className="mt-3 space-y-1 text-muted-foreground list-disc list-inside">
            <li>{t('s2_li1')}</li>
            <li>{t('s2_li2')}</li>
            <li>{t('s2_li3')}</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">{t('s3_title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('s3_body')}</p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">{t('s4_title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('s4_body')}</p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">{t('s5_title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('s5_body')}</p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">{t('s6_title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('s6_intro')}</p>
          <ul className="mt-3 space-y-1 text-muted-foreground list-disc list-inside">
            {rights.map((r) => (
              <li key={r.label}>
                <strong className="text-foreground">{r.label}:</strong> {r.text}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            {t('s6_contact_pre')}{' '}
            <a href="mailto:info@alicanteprive.com" className="hover:text-gold transition-colors underline">
              info@alicanteprive.com
            </a>{' '}
            {t('s6_contact_mid')}
            <a href="https://www.aepd.es" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors underline">
              www.aepd.es
            </a>
            {t('s6_contact_post')}
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">{t('s7_title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('s7_body')}</p>
        </section>
      </div>
    </div>
  );
}
