import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // In a real app, verify the token here
    // For now, we'll check for a cookie or just allow basic navigation checks
    // Since we are using client-side auth state in context for this MVP phase,
    // middleware might be limited to checking for a session cookie if one existed.

    // Example:
    // const token = request.cookies.get('token')?.value;
    // const isLoginPage = request.nextUrl.pathname === '/login';

    // if (!token && !isLoginPage) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }

    // if (token && isLoginPage) {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
