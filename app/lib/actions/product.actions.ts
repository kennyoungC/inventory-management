'use server';

import dbConnect from '../db';
import Product from '../models/product';

export async function getProducts() {
    try {
        await dbConnect();
        const products = await Product.find({});
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch products');
    }
}

export async function createProduct(formData: FormData) {
    try {
        await dbConnect();
        const newProduct = await Product.create({
            name: formData.get('name'),
            sku: formData.get('sku'),
            stock: Number(formData.get('stock')),
        });
        return JSON.parse(JSON.stringify(newProduct));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create product');
    }
}
