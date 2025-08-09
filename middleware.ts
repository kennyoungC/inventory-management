import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from './auth.config';
import NextAuth from 'next-auth';
import { getCodeSession } from './app/lib/session';

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Avoid infinite loop caused by internal requests from Server Components

    // const isInternalFrameworkRequest = req.headers.get('x-middleware-internal') === '1';
    // if (isInternalFrameworkRequest) {
    //     return NextResponse.next();
    // }

    // Protect auth-required pages
    const session = await auth();

    if (!session && !['/sign-in', '/register'].includes(pathname)) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl.origin));
    }

    // Dashboard-specific rules
    if (pathname.startsWith('/dashboard')) {
        const codeSession = await getCodeSession();

        if (!codeSession) {
            return NextResponse.redirect(new URL('/session-starter', req.url));
        }

        // Restrict certain routes for staff
        const staffRestrictedRoutes = [
            '/dashboard/settings',
            '/dashboard/staff-management',
            '/dashboard/notifications',
        ];
        if (
            codeSession.type === 'staff' &&
            staffRestrictedRoutes.some(route => pathname.startsWith(route))
        ) {
            return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js)).*)',
    ],
};
