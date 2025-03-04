import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseServerClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is signed in and the current path is /auth/login, redirect to /dashboard
  if (user && req.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Define public routes that can be accessed without authentication
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify'];

  // If the user is not signed in and the current path is not a public route, redirect to /auth/login
  if (!user && !authRoutes.includes(req.nextUrl.pathname) && !req.nextUrl.pathname.startsWith('/about') && !req.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Allow the request to continue
  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 