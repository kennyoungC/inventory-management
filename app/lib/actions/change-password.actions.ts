'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';
import dbConnect from '../db';
import Restaurant from '../models/restaurants';
import { auth } from 'auth';

type PasswordChangeState = {
    errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmNewPassword?: string[];
        general?: string[];
    };
    success?: boolean;
    message?: string;
} | null;

const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(8, 'Be at least 8 characters long')
            .regex(/[a-zA-Z]/, 'Contain at least one letter.')
            .regex(/[0-9]/, 'Contain at least one number.')
            .regex(/[^a-zA-Z0-9]/, 'Contain at least one special character.'),
        confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine(data => data.newPassword === data.confirmNewPassword, {
        path: ['confirmNewPassword'],
        message: "Passwords don't match",
    });

export async function changePassword(
    _prevState: PasswordChangeState,
    formData: FormData,
): Promise<PasswordChangeState> {
    const fields = {
        currentPassword: (formData.get('currentPassword') || '').toString(),
        newPassword: (formData.get('newPassword') || '').toString(),
        confirmNewPassword: (formData.get('confirmNewPassword') || '').toString(),
    };

    const validate = ChangePasswordSchema.safeParse(fields);
    if (!validate.success) {
        return {
            errors: validate.error.flatten().fieldErrors,
            message: 'Validation failed',
        };
    }

    await dbConnect();
    const session = await auth();
    const restaurantId = session?.user?.id;
    if (!restaurantId) {
        return { errors: { general: ['Not authorized.'] }, message: 'Not authorized.' };
    }

    const restaurant = await Restaurant.findById(restaurantId).select('+password');
    if (!restaurant || !restaurant.password) {
        return { errors: { general: ['User not found.'] }, message: 'User not found.' };
    }

    const passwordMatches = await bcrypt.compare(
        fields.currentPassword,
        restaurant.password as string,
    );
    if (!passwordMatches) {
        return {
            errors: { currentPassword: ['Current password is incorrect.'] },
            message: 'Current password is incorrect.',
        };
    }

    const samePassword = await bcrypt.compare(fields.newPassword, restaurant.password as string);
    if (samePassword) {
        return {
            errors: { newPassword: ['You cannot use your old password.'] },
            message: 'Please choose a new password.',
        };
    }

    const newHashed = await bcrypt.hash(fields.newPassword, 10);

    restaurant.password = newHashed;
    await restaurant.save();

    return {
        success: true,
        message: 'Password updated successfully!',
    };
}
