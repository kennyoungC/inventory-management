'use server';

import { redirect } from 'next/navigation';
import dbConnect from '../db';
import Restaurant from '../models/restaurants';
import Staff from '../models/staffs';
import { clearCodeSession, setCodeSession } from '../session';
import { generateUniqueCode } from '@/app/utils/generateCode';
import { sendAccessCodeEmail } from '@/app/utils/sendAccessCodeEmail';

export default async function validateSession(state: unknown | null, formData: FormData) {
    const code = formData.get('code')?.toString() || '';

    // 1. Validate code format
    if (!/^\d{6}$/.test(code)) {
        return { error: 'Please enter a valid 6-digit code' };
    }

    await dbConnect();

    // 2. Try to find staff with this code
    const staff = await Staff.findOne({ access_code: code });
    if (staff) {
        if (staff.is_active) {
            // Already logged in, allow reuse
            await setCodeSession('staff', staff._id.toString());
            return { success: true, type: 'staff', name: staff.full_name };
        }
        if (staff.code_expires_at && staff.code_expires_at < new Date()) {
            return { error: 'This code has expired. Please request a new code.', type: 'expired' };
        }

        // First login with code: activate and allow session
        staff.is_active = true;
        staff.last_login_at = new Date();
        await staff.save();
        await setCodeSession('staff', staff._id.toString());
        return { success: true, type: 'staff', name: staff.full_name };
    }

    // 3. Try to find restaurant (admin) with this code
    const restaurant = await Restaurant.findOne({ access_code: code });
    if (restaurant) {
        await setCodeSession('admin', restaurant._id.toString());
        return { success: true, type: 'admin', name: restaurant.restaurant_name };
    }

    // 4. If not found, return error
    return { error: 'Invalid code or code not found' };
}

export async function requestNewStaffCode(state: unknown | null, formData: FormData) {
    const email = formData.get('email')?.toString() ?? '';
    if (!email) return { error: 'Email is required.' };

    await dbConnect();
    const staff = await Staff.findOne({ email });
    if (!staff) return { error: 'Staff not found.' };

    const code = await generateUniqueCode();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    staff.access_code = code;
    staff.code_expires_at = expires;
    staff.is_active = false;
    await staff.save();

    await sendAccessCodeEmail(email, code, expires);

    return { success: true, message: 'A new code has been sent to your email.' };
}
//end session-starter.actions.ts
export async function endSession() {
    await clearCodeSession();
    redirect('/session-starter');
}
