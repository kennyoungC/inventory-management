'use server';

import { redirect } from 'next/navigation';
import dbConnect from '../db';
import Restaurant from '@/models/restaurants';
import Staff from '@/models/staffs';
import { clearCodeSession, createCodeSession } from '../session';
import { generateUniqueCode } from '@/utils/generateCode';
import { sendAccessCodeEmail } from '@/utils/sendAccessCodeEmail';
import { z } from 'zod';
import { auth } from 'auth';

type State = {
    error?: string;
    success?: boolean;
    message?: string;
} | null;

const AccessCodeSchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'Code must be exactly 6 digits'),
});

export default async function validateSession(state: unknown | null, formData: FormData) {
    const code = formData.get('code')?.toString() || '';

    const validate = AccessCodeSchema.safeParse({ code });
    if (!validate.success) {
        return { error: 'Invalid code format. Please enter a 6-digit code.' };
    }

    await dbConnect();

    const staff = await Staff.findOne({ access_code: code });
    if (staff) {
        if (staff.is_active) {
            // Already logged in, allow reuse
            await createCodeSession('staff', staff._id.toString());
            return { success: true, type: 'staff', name: staff.full_name };
        }
        if (staff.code_expires_at && staff.code_expires_at < new Date()) {
            return { error: 'This code has expired. Please request a new code.', type: 'expired' };
        }

        // First login with code: activate and allow session
        staff.is_active = true;
        staff.last_login_at = new Date();
        await staff.save();
        await createCodeSession('staff', staff._id.toString());
        return { success: true, type: 'staff', name: staff.full_name };
    }

    const restaurant = await Restaurant.findOne({ access_code: code });
    if (restaurant) {
        await createCodeSession('admin', restaurant._id.toString());
        return { success: true, type: 'admin', name: restaurant.restaurant_name };
    }

    return { error: 'Invalid code or code not found' };
}

export async function requestNewStaffCode(state: unknown | null, formData: FormData) {
    const email = formData.get('email')?.toString() ?? '';
    if (!email) return { error: 'Email is required.' };

    await dbConnect();
    const staff = await Staff.findOne({ email });
    if (!staff) return { error: 'Staff not found.' };

    const code = await generateUniqueCode();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    staff.access_code = code;
    staff.code_expires_at = expires;
    staff.is_active = false;
    await staff.save();

    await sendAccessCodeEmail(email, code, expires);

    return { success: true, message: 'A new code has been sent to your email.' };
}

export async function updateAccessCode(_prevState: State, formData: FormData): Promise<State> {
    const code = (formData.get('code') ?? '') as string;

    const validate = AccessCodeSchema.safeParse({ code });
    if (!validate.success) {
        return {
            error: validate.error.errors[0]?.message || 'Invalid access code.',
            message: 'Invalid access code.',
        };
    }

    await dbConnect();
    const session = await auth();
    const restaurantId = session?.user?.id;
    if (!restaurantId) {
        return { error: 'Not authorized', message: 'Not authorized' };
    }

    // (Optional) Forbid reusing the old code
    const restaurant = await Restaurant.findById(restaurantId);

    console.log('Updating access code for restaurant:', restaurant);
    console.log('Updating access code for code:', code);

    if (restaurant.access_code === Number(code)) {
        return { error: 'Old Access Code Detected.', message: 'Previous Access Code Detected.' };
    }

    restaurant.access_code = Number(code);
    await restaurant.save();

    return {
        success: true,
        message: 'Quick Access Code updated successfully!',
    };
}

export async function endSession() {
    await clearCodeSession();
    redirect('/session-starter');
}
