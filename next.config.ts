import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  images: {
    remotePatterns: [
      new URL('https://*.supabase.co/storage/v1/object/public/**'),
      new URL('https://picsum.photos/**'),
    ],
  },
};

export default withNextIntl(nextConfig);
