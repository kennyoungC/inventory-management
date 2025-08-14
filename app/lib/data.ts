import dbConnect from './db';
import Product from './models/product';
import Supplier from './models/supplier';
import { ProductModel, supplierModel } from './types';

export async function getAllSuppliers(): Promise<supplierModel[]> {
    try {
        await dbConnect();
        const suppliers = await Supplier.find({});
        return suppliers.map(supplier => ({
            id: supplier._id.toString(),
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            contactPerson: supplier.contact_person,
            minimumOrderQuantity: supplier.minimum_order_quantity,
        }));
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw new Error('Failed to fetch suppliers');
    }
}

export async function getSupplierById(id: string): Promise<supplierModel | null> {
    try {
        await dbConnect();

        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return null;
        }

        return {
            id: supplier._id.toString(),
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            contactPerson: supplier.contact_person,
            minimumOrderQuantity: supplier.minimum_order_quantity,
        };
    } catch (error) {
        console.error('Error fetching supplier by ID:', error);
        throw new Error('Failed to fetch supplier');
    }
}

export async function getAllProducts(): Promise<ProductModel[]> {
    try {
        await dbConnect();
        const products = await Product.find({});
        return products.map(product => ({
            id: product._id.toString(),
            name: product.name,
            price: product.price,
            sku: product.sku,
            description: product.description,
            category: product.category,
            currentStock: product.current_stock_level,
            measurementUnit: product.measurement_unit,
            minimumStockLevel: product.minimum_stock_level,
            storageLocation: product.storage_location,
            expirationPeriod: product.expiration_period,
            createdBy: product.created_by,
            supplierId: product.supplier_id.toString(),
            supplierName: product.supplier_name,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}
