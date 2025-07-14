// import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from './auth.config';
import NextAuth from 'next-auth';
// import { getToken } from 'next-auth/jwt';
import { getCodeSession } from './app/lib/session';

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await auth();
    const pathname = req.nextUrl.pathname;

    if (!session && pathname !== '/sign-in') {
        const newUrl = new URL('/sign-in', req.nextUrl.origin);
        return Response.redirect(newUrl);
    }

    // For dashboard routes, require a staff/admin code session
    if (pathname.startsWith('/dashboard')) {
        const codeSession = await getCodeSession(req);

        console.log('codeSession exists:', codeSession);

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
