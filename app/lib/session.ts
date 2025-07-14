'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { NextRequest } from 'next/server';

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) throw new Error('SESSION_SECRET is not set');
const encodedKey = new TextEncoder().encode(secretKey);

type Role = 'admin' | 'staff';

interface SessionPayload extends JWTPayload {
    id: string;
    type: Role;
    expiresAt: Date;
}

// Encrypts the payload into a JWT
export async function encrypt(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt)
        .sign(encodedKey);
}

// Decrypts the JWT string
export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload as SessionPayload;
    } catch (error) {
        console.error('Failed to verify session:', error);
        return null;
    }
}

// Gets session from the request cookies
export async function getCodeSession(req: NextRequest): Promise<SessionPayload | null> {
    const cookie = req.cookies.get('code_session')?.value;
    const session = await decrypt(cookie);
    if (!session) return null;

    const now = new Date();
    const expires = new Date(session.expiresAt);
    if (expires < now) return null;

    return session;
}

// Sets a session cookie with encrypted data
export async function setCodeSession(type: Role, id: string) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const token = await encrypt({ id, type, expiresAt });
    const cookieStore = await cookies();
    cookieStore.set('code_session', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
    });
}

// Deletes the session cookie
export async function clearCodeSession() {
    const cookieStore = await cookies();
    cookieStore.delete('code_session');
}
