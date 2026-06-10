import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Locale routing runs for every matched request (handles `/` → `/es`, etc.)
  const i18nResponse = handleI18nRouting(request);

  const pathname = request.nextUrl.pathname;
  const adminMatch = pathname.match(/^\/([a-z]{2})\/admin/);

  // Public pages (home, propiedades, contacto…) need no auth. Skipping the
  // Supabase round-trip here removes a blocking network call from every public
  // navigation and initial load — the main cause of the first-paint delay.
  if (!adminMatch) {
    return i18nResponse;
  }

  // Admin area only: validate the session. The network call lives here, where
  // navigations are infrequent, instead of on every public request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            i18nResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname.match(/^\/([a-z]{2})\/admin\/login/);
  const locale = adminMatch[1];

  if (!isLoginPage && !user) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  // Redirect authenticated users away from the login page
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  return i18nResponse;
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
