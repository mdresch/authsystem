// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/chat'];

export async function middleware(req: NextRequest) {
    const isAuthenticated = req.cookies.get('sb-katscktlmaqbkuncezlq-auth-token.1') !== undefined;
    // Redirect to login if not authenticated
    
    const protectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

    if (protectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    
    }


export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/protected/:path*'
    ],
};


