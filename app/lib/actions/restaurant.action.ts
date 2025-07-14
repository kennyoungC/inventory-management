'use server';

import { z } from 'zod';
import dbConnect from '../db';
import Restaurant from '../models/restaurants';
import bcrypt from 'bcrypt';

const fieldNameMap: Record<string, string> = {
    restaurant_name: 'restaurantName',
    email: 'email',
    phone_number: 'phoneNumber',
    access_code: 'accessCode',
    password: 'password',
    address: 'address',
};

export type State = {
    errors?: {
        restaurantName?: Array<string>;
        email?: Array<string>;
        phoneNumber?: Array<string>;
        accessCode?: Array<string>;
        password?: Array<string>;
        address?: Array<string>;
        confirmPassword?: Array<string>;
        general?: Array<string>;
    };
    success?: boolean;
    message?: string;
    values?: {
        restaurantName: string;
        email: string;
        phoneNumber: string;
        accessCode: string;
        password: string;
        confirmPassword?: string;
        address?: string;
    };
} | null;

export interface MongoDuplicateError extends Error {
    code?: number;
    keyValue?: Record<string, string>;
}

const FormSchema = z
    .object({
        restaurantName: z.string().min(1, 'Restaurant name is required'),
        email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
        phoneNumber: z.string().regex(/^\d{10,15}$/, 'Phone number must be 10-15 digits'),
        accessCode: z.string().regex(/^\d{6}$/, 'Access code must be exactly 6 digits'),
        password: z
            .string()
            .min(8, { message: 'Be at least 8 characters long' })
            .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
            .regex(/[0-9]/, { message: 'Contain at least one number.' })
            .regex(/[^a-zA-Z0-9]/, {
                message: 'Contain at least one special character.',
            })
            .trim(),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        address: z.string().min(1, 'Address is required').trim(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });
export async function createRestaurant(prevState: State, formData: FormData): Promise<State> {
    const data = {
        restaurantName: formData.get('restaurantName')?.toString() ?? '',
        email: formData.get('email')?.toString() ?? '',
        phoneNumber: formData.get('phoneNumber')?.toString() ?? '',
        accessCode: formData.get('accessCode')?.toString() ?? '',
        password: formData.get('password')?.toString() ?? '',
        confirmPassword: formData.get('confirmPassword')?.toString() ?? '',
        address: formData.get('address')?.toString() ?? '',
    };

    const validateFields = FormSchema.safeParse(data);

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Validation failed',
            values: data,
        };
    }

    const { accessCode, restaurantName, password, phoneNumber, email, address } =
        validateFields.data;

    // Convert phoneNumber and accessCode to numbers
    const phoneNumberNum = Number(phoneNumber);
    const accessCodeNum = Number(accessCode);

    // Additional server-side validation for numeric fields
    if (isNaN(phoneNumberNum)) {
        return {
            errors: { phoneNumber: ['Phone number must be a valid number'] },
            message: 'Validation failed',
            values: data,
        };
    }
    if (isNaN(accessCodeNum)) {
        return {
            errors: { accessCode: ['Access code must be a valid number'] },
            message: 'Validation failed',
            values: data,
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbConnect();

    try {
        await Restaurant.create({
            restaurant_name: restaurantName,
            email,
            phone_number: phoneNumberNum,
            access_code: accessCodeNum,
            password: hashedPassword,
            address,
            role: 'admin',
        });

        return {
            success: true,
            values: data,
            message: 'Registration successful',
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error('Validation failed:', error.message);

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

            return {
                errors: { general: [error.message] },
                message: 'Failed to create restaurant',
            };
        } else {
            console.error('Validation failed:', error);
            return {
                errors: { general: ['An unexpected error occurred'] },
                message: 'Failed to create restaurant',
                values: data,
            };
        }
    }
}
