import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import PageTransition from '@/components/public/PageTransition';

// Namespaces used by public client components (Header, Footer, PropertyCard,
// FilterBar, LanguageSwitcher, ContactForm). The large `admin` namespace is
// intentionally excluded so it never ships to public visitors.
const PUBLIC_NAMESPACES = [
  'nav',
  'footer',
  'languages',
  'properties',
  'types',
  'operations',
  'contact',
  'sell',
] as const;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    PUBLIC_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]])
  );

  return (
    <NextIntlClientProvider messages={clientMessages}>
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
