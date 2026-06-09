import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en', 'fr', 'de'],
  defaultLocale: 'es',
});

export type Locale = (typeof routing.locales)[number];
