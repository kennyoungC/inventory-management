'use server';

import { generateUniqueCode } from '@/app/utils/generateCode';
import { sendAccessCodeEmail } from '@/app/utils/sendAccessCodeEmail';
import dbConnect from '../db';
import Staff from '../models/staffs';
import { z } from 'zod';
import { auth } from '@/auth';
import { MongoDuplicateError } from './restaurant.action';
import { revalidatePath } from 'next/cache';

export type State = {
    errors?: {
        email?: Array<string>;
        jobTitle?: Array<string>;
        fullName?: Array<string>;
        general?: Array<string>;
    };
    success?: boolean;
    message?: string;
    values?: {
        email: string;
        jobTitle: string;
        fullName: string;
    };
} | null;

const fieldNameMap: Record<string, string> = {
    email: 'email',
    jobTitle: 'jobTitle',
    fullName: 'fullName',
};
const FormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    jobTitle: z.string().min(1, 'Job title is required').trim(),
    fullName: z.string().min(1, 'Full name is required').trim(),
});

export async function addNewStaff(prevState: State, formData: FormData): Promise<State> {
    const data = {
        email: formData.get('email')?.toString() ?? '',
        jobTitle: formData.get('jobTitle')?.toString() ?? '',
        fullName: formData.get('fullName')?.toString() ?? '',
    };

    const validateFields = FormSchema.safeParse(data);

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Add Staff',
            values: data,
        };
    }
    const { email, jobTitle, fullName } = validateFields.data;

    const session = await auth();

    if (!session?.user?.id) {
        return {
            errors: { general: ['You must be logged in to add staff. Please Refresh Page'] },
            message: 'Authentication required',
            values: data,
        };
    }

    await dbConnect();

    const code = await generateUniqueCode();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    try {
        await Staff.create({
            email,
            access_code: code,
            code_expires_at: expires,
            job_title: jobTitle,
            full_name: fullName,
            is_active: false,
            restaurant_id: session?.user?.id,
        });

        await sendAccessCodeEmail(email, code, expires);

        revalidatePath('/dashboard/staff-management');
        return { success: true, message: 'Staff added successfully' };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error instanceof Error) {
            const mongoError = error as MongoDuplicateError;
            if ('code' in mongoError && mongoError.code === 11000 && mongoError.keyValue) {
                const duplicateFieldRaw = Object.keys(mongoError.keyValue)[0];
                const duplicateField = fieldNameMap[duplicateFieldRaw] || duplicateFieldRaw;
                const duplicateValue = mongoError.keyValue[duplicateFieldRaw];

                return {
                    errors: {
                        [duplicateField]: [
                            `${duplicateField.toUpperCase()} "${duplicateValue}" already exists.`,
                        ],
                    },
                    message: 'Duplicate value error',
                    values: data,
                };
            }
        }
        return {
            errors: { general: ['Failed to add staff. Please try again later.'] },
            message: 'Failed to add staff',
            values: data,
        };
    }
}
