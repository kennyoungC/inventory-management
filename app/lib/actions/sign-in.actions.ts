'use server';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { object, string } from 'zod';
import { clearCodeSession } from '../session';

type State = { message: string } | undefined;

const LoginSchema = object({
    email: string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
});

export async function logIn(prevState: State, formData: FormData): Promise<State> {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    const parsed = LoginSchema.safeParse({ email, password });
    if (!parsed.success) {
        return { message: 'Email/password are required and must be valid.' };
    }

    try {
        await signIn('credentials', {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: true,
            redirectTo: '/dashboard',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { message: 'Invalid credentials.' };
                default:
                    return { message: 'An unexpected error occurred.' };
            }
        }
        throw error;
    }
}
export async function logOut() {
    await clearCodeSession();
    await signOut({ redirectTo: '/sign-in' });
}
