import type { NextAuthConfig } from 'next-auth';
export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/sign-in',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            console.log('Checking authorization for:', nextUrl.pathname, auth);

            return !!auth?.user;
        },
    },
    providers: [],
};
