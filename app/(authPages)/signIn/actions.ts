'use server';

export async function signIn(state: unknown | null, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('here the server log ', email, password);
    return { email, password };
}
