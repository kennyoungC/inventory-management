'use server';

import dbConnect from '../db';
import Restaurant from '../models/restaurants';

export async function createRestaurant() {
    await dbConnect();

    try {
        const restaurant = await Restaurant.create({
            restaurant_name: 'My Cafe',
            email: 'contact@mystore.com',
            phone_number: 1234567890,
            access_code: 123456,
            password: 'Str0ngP@ss',
        });

        console.log('Created:', restaurant);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Validation failed:', error.message);
        } else {
            console.error('Validation failed:', error);
        }
    }
}
