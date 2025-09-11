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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.role = token.role as 'staff' | 'admin';
            return session;
        },
    },
    providers: [],
};
