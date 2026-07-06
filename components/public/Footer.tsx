import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('nav');
  const tf = useTranslations('footer');

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-sans mb-1">
              Costa Blanca
            </p>
            <p className="font-heading text-xl font-semibold mb-3">Alicante Privé</p>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              {tf('tagline')}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs tracking-widest uppercase text-primary-foreground/40 mb-4 font-sans">
              {tf('nav_title')}
            </p>
            <nav className="space-y-2">
              {[
                { href: '/', label: t('home') },
                { href: '/propiedades', label: t('properties') },
                { href: '/vender', label: t('sell') },
                { href: '/contacto', label: t('contact') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-primary-foreground/60 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-widest uppercase text-primary-foreground/40 mb-4 font-sans">
              {tf('contact_title')}
            </p>
            <address className="not-italic text-sm text-primary-foreground/60 space-y-1">
              <p>C. Alvarez Sereix 11, Entreplanta derecha</p>
              <p>03001 Alicante</p>
              <p>
                <a
                  href="tel:+34603248668"
                  className="hover:text-gold transition-colors"
                >
                  +34 603 248 668
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@alicanteprive.com"
                  className="hover:text-gold transition-colors"
                >
                  info@alicanteprive.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs text-primary-foreground/30">
          © {new Date().getFullYear()} Alicante Privé. {tf('copyright')}
        </div>
      </div>
    </footer>
  );
}
