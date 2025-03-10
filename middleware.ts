// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabaseAuthTokenName = 'sb-katscktlmaqbkuncezlq-auth-token'; // Replace with your actual cookie name
    console.log("Middleware triggered");
    // Create the Supabase client *within* the middleware function.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    const cookieValue = req.cookies.get(name)?.value;
                    console.log(`Middleware: Reading cookie - ${name}: ${cookieValue ? 'Present' : 'Not Found'}`);
                    if (name === supabaseAuthTokenName) {
                        console.log(`Middleware:  ${supabaseAuthTokenName} is present: ${cookieValue ? 'Yes' : 'No'}`);
                    }
                    return cookieValue;
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
        console.log(`Middleware: User object after supabase.auth.getUser():`, user);
    // If the user is signed in and the current path is /auth/login, redirect to /dashboard
    if (user && req.nextUrl.pathname === '/auth/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirect unauthenticated users from protected routes
    if (!user) {
        const protectedRoutes = ['/dashboard', '/profile', '/chat'];
        const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

        if (isProtectedRoute) {
            const redirectUrl = new URL('/auth/login', req.url);
            redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Otherwise, continue the request
    return res;
}

// Add config for matching paths
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