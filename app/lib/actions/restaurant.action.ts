'use server';

import { z } from 'zod';
import dbConnect from '../db';
import Restaurant, { RestaurantDto } from '../models/restaurants';
import bcrypt from 'bcrypt';
import { auth } from 'auth';
import type { MongoDuplicateError, RestaurantModel } from '../types';

type valueName =
    | 'restaurantName'
    | 'email'
    | 'phoneNumber'
    | 'accessCode'
    | 'address'
    | 'emailUpdates'
    | 'general'
    | 'password'
    | 'confirmPassword';

const fieldNameMap: Record<string, string> = {
    restaurant_name: 'restaurantName',
    email: 'email',
    phone_number: 'phoneNumber',
    access_code: 'accessCode',
    password: 'password',
    address: 'address',
};

export type State = {
    errors?: Partial<Record<valueName, string[]>>;
    success?: boolean;
    message?: string;
    values?: Partial<Record<valueName, string>>;
} | null;

const FormSchema = z
    .object({
        restaurantName: z.string().min(1, 'Restaurant name is required'),
        email: z
            .string()
            .email({ message: 'Please enter a valid email.' })
            .trim()
            .transform(value => value.toLowerCase()),
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

const UpdateProfileSchema = z.object({
    restaurantName: z.string().min(1, 'Restaurant name is required'),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    phoneNumber: z.string().regex(/^\d{10,15}$/, 'Phone number must be 10-15 digits'),
    address: z.string().min(1, 'Address is required').trim(),
    emailUpdates: z.preprocess(val => val === 'on' || val === true, z.boolean()),
});
export async function createRestaurant(prevState: State, formData: FormData): Promise<State> {
    const data = Object.fromEntries(formData.entries());

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

export async function getRestaurantById(): Promise<RestaurantModel | null> {
    try {
        await dbConnect();
        const session = await auth();
        const restaurantId = session?.user?.id;
        if (!restaurantId) return null;

        const restaurant = await Restaurant.findById(restaurantId).lean<RestaurantDto>();

        if (!restaurant) return null;
        return {
            id: restaurant._id.toString(),
            restaurantName: restaurant.restaurant_name,
            email: restaurant.email,
            phoneNumber: String(restaurant.phone_number),
            accessCode: String(restaurant.access_code),
            address: restaurant.address,
            emailUpdates: restaurant.email_updates,
        };
    } catch (error) {
        console.error('Error in getRestaurantById:', error);
        return null;
    }
}

export async function getRestaurantByEmail(email: string) {
    await dbConnect();
    const user = await Restaurant.findOne({
        email,
    }).select('+password');
    return user;
}

export async function updateRestaurantProfile(
    prevState: State,
    formData: FormData,
): Promise<State> {
    const data = Object.fromEntries(formData.entries());

    const validateFields = UpdateProfileSchema.safeParse(data);

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Validation failed',
            values: data,
        };
    }

    try {
        await dbConnect();
        const session = await auth();
        const restaurantId = session?.user?.id;
        if (!restaurantId)
            return { message: 'Not authorized', errors: { general: ['Not authorized'] } };

        const { restaurantName, email, phoneNumber, address, emailUpdates } = validateFields.data;

        console.log({ emailUpdates });

        const existing = await Restaurant.findOne({ email }).lean<RestaurantDto>();

        if (
            existing &&
            typeof existing._id !== 'undefined' &&
            existing._id?.toString() !== restaurantId
        ) {
            return {
                errors: { email: ['This email is already registered.'] },
                message: 'Validation failed',
                values: data,
            };
        }

        await Restaurant.findByIdAndUpdate(restaurantId, {
            restaurant_name: restaurantName,
            email,
            phone_number: phoneNumber,
            address,
            email_updates: emailUpdates,
        });

        return {
            success: true,
            message: 'Profile updated successfully.',
            values: {
                ...data,
                //TODO! WHAT IS THIS??
                phoneNumber,
            },
        };
    } catch (error) {
        console.error('Error updating restaurant profile:', error);
        return {
            errors: { general: ['Failed to update profile'] },
            message: 'Failed to update profile',
            values: data,
        };
    }
}
