import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

import bcrypt from 'bcrypt';
import Restaurant from './app/lib/models/restaurants';
import dbConnect from './app/lib/db';
import { setCodeSession } from './app/lib/session';
// import { setCodeSession } from './app/lib/session';

// Extend the User type to include 'role'
declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        role: string;
    }

    interface Session {
        user: User;
    }
}

export async function getRestuarantByEmail(email: string) {
    await dbConnect();
    const user = await Restaurant.findOne({
        email,
    }).select('+password');
    return user;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (typeof email !== 'string' || typeof password !== 'string') {
                    return null;
                }
                const user = await getRestuarantByEmail(email);
                if (!user) return null;
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return null;

                await setCodeSession(user.role, user._id.toString());

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },
    callbacks: {
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
            session.user.role = token.role as string;
            return session;
        },
    },
});
