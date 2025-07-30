'use server';

import { sendContactUsEmail } from '@/utils/sendContactUsEmail';
import { z } from 'zod';

const ContactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Provide a valid email'),
    message: z.string().min(10, 'Message is too short').max(500),
});

export type ContactFormServerState = {
    errors?: { name?: string[]; email?: string[]; message?: string[]; general?: string[] };
    values?: { name?: string; email?: string; message?: string };
    success?: boolean;
    message?: string;
} | null;

export async function handleContactForm(
    _prev: ContactFormServerState,
    formData: FormData,
): Promise<ContactFormServerState> {
    const data = {
        name: formData.get('name')?.toString() ?? '',
        email: formData.get('email')?.toString() ?? '',
        message: formData.get('message')?.toString() ?? '',
    };

    const validate = ContactSchema.safeParse(data);
    if (!validate.success) {
        return {
            errors: validate.error.flatten().fieldErrors,
            message: 'Please fill out the form correctly.',
            values: data,
        };
    }

    console.log('Contact form data:', data);

    try {
        await sendContactUsEmail(data);
        return { success: true, message: 'Thanks for reaching out! We’ll get back to you soon.' };
    } catch (err) {
        console.error('Error handling contact form:', err);
        return {
            errors: { general: ['Service error, please try again.'] },
            message: 'Failed to send.',
            values: data,
        };
    }
}
