'use server';

import { z } from 'zod';
import { sendContactUsEmail } from 'app/shared/utils';

type ContactInput = z.infer<typeof ContactSchema>;
type ValueName = keyof ContactInput;

export type ContactFormServerState = {
    errors?: Partial<Record<ValueName, string[]>>;
    values?: Partial<Record<ValueName, string>>;
    success?: boolean;
    message?: string;
} | null;

const ContactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Provide a valid email'),
    message: z.string().min(10, 'Message is too short').max(500),
    general: z.string().optional(),
});

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
