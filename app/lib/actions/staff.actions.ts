'use server';

import dbConnect from '../db';
import Staff, { StaffDto } from '@/models/staffs';
import { z } from 'zod';
import { auth } from 'auth';
import { revalidatePath } from 'next/cache';
import type { MongoDuplicateError, StaffModel } from '../types';
import { generateUniqueCode } from 'app/shared/utils/codeGenerators';
import { MapMongoDuplicateError } from 'app/shared/utils/mongoDuplicateError';
import { sendAccessCodeEmail } from 'app/shared/utils/mailUtils';

type StaffInput = z.infer<typeof FormSchema>;
type ValueName = keyof StaffInput;
export type State = {
    errors?: Partial<Record<ValueName, string[]>>;
    success?: boolean;
    message?: string;
    values?: Partial<Record<ValueName, string>>;
} | null;

const fieldNameMap: Record<string, string> = {
    email: 'email',
};
const FormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    jobTitle: z.string().min(1, 'Job title is required').trim(),
    fullName: z.string().min(1, 'Full name is required').trim(),
    general: z.string().optional(),
});

export async function addNewStaff(prevState: State, formData: FormData): Promise<State> {
    const data = Object.fromEntries(formData.entries());

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
    } catch (error) {
        const mongoError = error as MongoDuplicateError;

        const duplicateResult = MapMongoDuplicateError(mongoError, fieldNameMap);
        if (duplicateResult) {
            return { ...duplicateResult, values: data };
        }

        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return {
            errors: { general: [message] },
            message: 'Failed to create product',
            values: data,
        };
    }
}

export async function deleteStaff(staffId: string): Promise<State> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            errors: { general: ['You must be logged in to delete staff. Please Refresh Page'] },
            message: 'Authentication required',
        };
    }

    await dbConnect();

    try {
        const result = await Staff.deleteOne({ _id: staffId, restaurant_id: session.user.id });

        if (!result.acknowledged || result.deletedCount === 0) {
            return {
                errors: { general: ['Staff not found or you do not have permission to delete.'] },
                message: 'Staff not found',
            };
        }

        return { success: true, message: 'Staff deleted successfully' };
    } catch (error) {
        console.error('Error deleting staff:', error);
        return {
            errors: { general: ['Failed to delete staff. Please try again later.'] },
            message: 'Failed to delete staff',
        };
    }
}

export async function resetAccessCode(staffId: string): Promise<State> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            errors: {
                general: ['You must be logged in to reset access code. Please Refresh Page'],
            },
            message: 'Authentication required',
        };
    }

    await dbConnect();

    try {
        const code = await generateUniqueCode();
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        const staff = await Staff.findOneAndUpdate(
            { _id: staffId, restaurant_id: session.user.id },
            { access_code: code, code_expires_at: expires },
            { new: true },
        );

        if (!staff) {
            return {
                errors: { general: ['Staff not found or you do not have permission to reset.'] },
                message: 'Staff not found',
            };
        }

        await sendAccessCodeEmail(staff.email, code, expires);

        revalidatePath('/dashboard/staff-management');
        return { success: true, message: 'Access code reset successfully' };
    } catch (error) {
        console.error('Error resetting access code:', error);
        return {
            errors: { general: ['Failed to reset access code. Please try again later.'] },
            message: 'Failed to reset access code',
        };
    }
}

export async function getAllStaff(): Promise<StaffModel[]> {
    try {
        await dbConnect();

        const session = await auth();
        const restaurantId = session?.user?.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        const staffList = await Staff.find({ restaurant_id: restaurantId }).lean<StaffDto[]>();

        return staffList.map(staff => ({
            id: staff._id.toString(),
            restaurantId: staff.restaurant_id.toString(),
            fullName: staff.full_name,
            jobTitle: staff.job_title,
            isActive: staff.is_active,
            email: staff.email,
            lastLoginAt: staff.last_login_at?.toISOString() ?? '',
        }));
    } catch (error) {
        console.error('Error in getAllStaff:', error);
        throw new Error('Failed to fetch staff list');
    }
}
