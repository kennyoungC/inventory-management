import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Product from '@/app/lib/models/product';
import Restaurant from '@/app/lib/models/restaurants';

export async function GET() {
    try {
        await dbConnect();
        const restaurants = await Restaurant.find({});
        return NextResponse.json(restaurants);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newRestaurant = await Restaurant.create(body);
        return NextResponse.json(newRestaurant, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
    }
}
