import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alicante Privé',
  description: 'Propiedades exclusivas en la Costa Blanca.',
};

// The document shell (<html>/<body>, fonts) lives in app/[locale]/layout.tsx so
// that the locale comes from the route param (static) instead of request
// headers. This root layout is a pass-through, which keeps locale pages
// statically prerenderable / ISR-cacheable.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
