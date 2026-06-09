import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Run next-intl locale routing first
  const i18nResponse = handleI18nRouting(request);

  // Refresh Supabase session and check auth for admin routes
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

  const pathname = request.nextUrl.pathname;
  const adminMatch = pathname.match(/^\/([a-z]{2})\/admin/);
  const isLoginPage = pathname.match(/^\/([a-z]{2})\/admin\/login/);

  if (adminMatch && !isLoginPage && !user) {
    const locale = adminMatch[1];
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  // Redirect authenticated users away from login page
  if (isLoginPage && user) {
    const locale = isLoginPage[1];
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  return i18nResponse;
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
