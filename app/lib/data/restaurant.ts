import Restaurant, { RestaurantDto } from '@/models/restaurants';
import dbConnect from '../db';
import { auth } from 'auth';
import { RestaurantModel } from '../types';

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
