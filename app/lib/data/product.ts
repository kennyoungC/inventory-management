import { auth } from 'auth';
import dbConnect from '../db';
import { cache } from 'react';
import { ProductModel, ProductWithSupplierDto, ProductWithSupplierModel } from '../types';
import Product, { ProductDto } from '@/models/product';
import '@/models/supplier';
import {
    transformProductsWithSuppliers,
    transformProductWithSupplier,
} from '@/transformers/product';

export const getAllProducts = cache(async function (): Promise<ProductModel[]> {
    try {
        const session = await auth();
        const restaurantId = session?.user?.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        await dbConnect();
        const products = await Product.find({ restaurant_id: restaurantId }).lean<ProductDto[]>();

        const newProductModel = products.map(product => ({
            id: product._id.toString(),
            name: product.name,
            sku: product.sku,
            category: product.category,
            currentStock: product.current_stock_level,
            measurementUnit: product.measurement_unit,
            minimumStockLevel: product.minimum_stock_level,
            storageLocation: product.storage_location,
            createdBy: product.created_by,
            supplierId: product.supplier_id?.toString(),
        }));

        return newProductModel;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
});

export const getProductWithSupplier = cache(async function (
    productId: string,
): Promise<ProductWithSupplierModel | null> {
    try {
        const session = await auth();
        const restaurantId = session?.user?.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        await dbConnect();

        const productWithSupplier = await Product.findById(productId)
            .populate('supplier_id')
            .lean<ProductWithSupplierDto>();

        if (!productWithSupplier) {
            return null;
        }

        return transformProductWithSupplier(productWithSupplier);
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('Failed to fetch product');
    }
});

export const getAllProductsWithSuppliers = cache(async function (): Promise<
    ProductWithSupplierModel[]
> {
    try {
        const session = await auth();
        const restaurantId = session?.user?.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        await dbConnect();

        const productsWithSuppliers = await Product.find({ restaurant_id: restaurantId })
            .populate('supplier_id')
            .lean<ProductWithSupplierDto[]>();

        return transformProductsWithSuppliers(productsWithSuppliers);
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
});
