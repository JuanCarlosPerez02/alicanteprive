import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: {
      default: t('site_name'),
      template: `%s — ${t('site_name')}`,
    },
    description: t('home_description'),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    ),
    openGraph: { siteName: t('site_name'), locale },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering for this locale segment (next-intl). Without this,
  // every page reads the locale from request headers and opts into dynamic
  // rendering, defeating `revalidate`/ISR.
  setRequestLocale(locale);

  // The client message provider lives in each route group ((public) / admin)
  // so the public bundle only ships the namespaces it actually uses.
  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
