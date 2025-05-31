'use server';

export default async function validateSession(state: unknown | null, formData: FormData) {
    const code = formData.get('code')?.toString() || '';

    // Here you can add your validation logic
    if (code.length !== 6) {
        return { error: 'Please enter a 6-digit code' };
    }
    console.log('log server here ', code);
    // For now, just return the code. You can add actual validation later
    return { code };
}
