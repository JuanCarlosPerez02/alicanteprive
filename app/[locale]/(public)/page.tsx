import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 300; // regenerate every 5 minutes
import PropertyCard from '@/components/public/PropertyCard';
import type { Metadata } from 'next';
import type { Propiedad } from '@/types';
import { Shield, Globe, Award, ArrowRight } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('home_title'), description: t('home_description') };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const supabase = createPublicClient();
  const { data: destacadas } = await supabase
    .from('propiedades')
    .select('id, referencia, titulo, precio, operacion, zona, tipo, estado, habitaciones, banos, metros, propiedad_fotos(url, es_portada, orden)')
    .eq('destacada', true)
    .eq('estado', 'disponible')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center min-h-[88vh] bg-primary text-primary-foreground px-6 text-center">

        {/* Background photo (LCP — preloaded) */}
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Navy tint: keeps the text legible and the photo on-brand */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/70 to-primary/95 pointer-events-none" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(oklch(0.74 0.09 82 / 0.18) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-gold/5 pointer-events-none" />

        {/* Corner decorators */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-gold/40 pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-gold/40 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gold/60" />
            <p className="text-xs tracking-[0.4em] uppercase text-gold font-sans font-medium">
              Alicante Privé
            </p>
            <div className="h-px w-8 bg-gold/60" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl leading-tight mb-6 [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]">
            {t('hero.title')}
          </h1>

          <p className="text-base md:text-lg text-primary-foreground/80 max-w-lg mb-10 leading-relaxed [text-shadow:0_1px_12px_rgb(0_0_0/0.3)]">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/propiedades"
              className="group flex items-center gap-2 px-8 py-3.5 bg-gold text-primary font-semibold rounded-sm hover:bg-gold/90 transition-colors text-sm tracking-wide"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contacto"
              className="px-8 py-3.5 border border-primary-foreground/25 text-primary-foreground font-semibold rounded-sm hover:border-primary-foreground/60 hover:bg-primary-foreground/5 transition-colors text-sm tracking-wide"
            >
              {t('hero.cta_contact')}
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
      </section>

      {/* ── Featured properties ───────────────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3 font-medium">
            {tNav('properties')}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            {t('featured_title')}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            {t('featured_subtitle')}
          </p>
        </div>

        {destacadas && destacadas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(destacadas as Propiedad[]).map((p) => (
              <PropertyCard key={p.id} propiedad={p} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-16 border border-border rounded-sm bg-muted/20">
            <p className="text-sm">{t('coming_soon')}</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-2 px-8 py-3 border border-primary text-primary font-semibold rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors text-sm tracking-wide"
          >
            {t('hero.cta')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* ── Why Alicante Privé ────────────────────────────── */}
      <section className="bg-muted/30 border-t border-border py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3 font-medium">
              Costa Blanca
            </p>
            <h2 className="font-heading text-3xl font-semibold">
              {t('why_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: t('feat1_title'), body: t('feat1_body') },
              { icon: Shield, title: t('feat2_title'), body: t('feat2_body') },
              { icon: Globe, title: t('feat3_title'), body: t('feat3_body') },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-7 bg-card border border-border rounded-sm hover:border-primary/30 hover:shadow-sm transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-primary/5 border border-primary/10 mb-5 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA bottom ───────────────────────────────────── */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="h-px w-12 bg-gold mx-auto mb-8" />
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">
            {t('cta_title')}
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            {t('cta_body')}
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-sm hover:opacity-90 transition-opacity text-sm tracking-wide"
          >
            {t('cta_button')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
