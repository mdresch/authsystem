// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next(); // Need to create a response object

  // Create the Supabase client *within* the middleware function.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // VERY IMPORTANT: Use service role key
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
        });
        res.cookies.set({ //also set the cookie in the response
            name,
            value,
            ...options,
        });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res.cookies.set({ //also set the cookie in the response
                name,
                value: '',
                ...options,
          });
        },
      },
    }
  );

    const {
        data: { user },
    } = await supabase.auth.getUser();

  // If the user is signed in and the current path is /auth/login, redirect to /dashboard
  if (user && req.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url)); // Use new URL()
  }

    if (!user && (
        req.nextUrl.pathname === '/dashboard' ||
        req.nextUrl.pathname === '/profile' ||
        req.nextUrl.pathname === '/chat'
    )) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

  // Otherwise, continue the request
  return res;
}
//Add config for matching paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}