import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  ()     => request.cookies.getAll(),
        setAll: (pairs: { name: string; value: string; options?: Record<string, unknown> }[]) => pairs.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Protect /client-portal
  if (pathname.startsWith('/client-portal') && !pathname.includes('?')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/client-portal';
      url.searchParams.set('signin', '1');
      // Let the page handle its own auth redirect (no server redirect needed)
    }
  }

  // Protect /admin
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    if (!user) {
      // Page handles its own auth state — allow through
    } else {
      const isAdmin = user.email?.endsWith('@mejasanmedia.com') || user.app_metadata?.role === 'admin';
      if (!isAdmin && pathname !== '/admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/client-portal/:path*', '/admin/:path*', '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
