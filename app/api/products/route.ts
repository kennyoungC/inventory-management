import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Product from '@/app/lib/models/product';

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({});
        return NextResponse.json(products);
    } catch (error) {
        console.warn(error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newProduct = await Product.create(body);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.warn(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
