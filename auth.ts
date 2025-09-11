import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

import bcrypt from 'bcrypt';

import { getRestaurantByEmail } from './app/lib/actions/restaurant.action';
import { createCodeSession } from 'app/lib/session';

declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        role: 'staff' | 'admin';
    }

    interface Session {
        user: User;
    }
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
                const user = await getRestaurantByEmail(email);
                if (!user) return null;
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return null;

                await createCodeSession(user.role, user._id.toString());

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
        maxAge: 2 * 24 * 60 * 60,
    },
});
