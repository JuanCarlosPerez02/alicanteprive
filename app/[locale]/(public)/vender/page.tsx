import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import VenderForm from '@/components/public/VenderForm';
import { BadgeEuro, Camera, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sell' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    alternates: {
      canonical: `/${locale}/vender`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/vender`])),
    },
  };
}

export default async function VenderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'sell' });

  const benefits = [
    { icon: BadgeEuro, title: t('benefit1_title'), body: t('benefit1_body') },
    { icon: Camera, title: t('benefit2_title'), body: t('benefit2_body') },
    { icon: Globe, title: t('benefit3_title'), body: t('benefit3_body') },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-2">
          {t('eyebrow')}
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold">{t('title')}</h1>
        <p className="text-muted-foreground mt-4 leading-relaxed">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Benefits */}
        <div className="lg:col-span-2 space-y-5">
          {benefits.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 p-5 bg-card border border-border rounded-sm">
              <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-sm bg-primary/5 border border-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-base font-semibold mb-1">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-card border border-border rounded-sm p-6">
          <h2 className="font-heading text-xl font-semibold mb-1">{t('form_title')}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t('form_subtitle')}</p>
          <VenderForm />
        </div>
      </div>
    </div>
  );
}
