import { auth } from 'auth';
import dbConnect from './db';
import Product, { ProductDto } from './models/product';
import Supplier, { SupplierDto } from './models/supplier';
import { ProductModel, supplierModel } from './types';

export async function getAllSuppliers(): Promise<supplierModel[]> {
    try {
        const session = await auth();
        const restaurantId = session?.user?.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }
        await dbConnect();
        const suppliers = await Supplier.find({ restaurant_id: restaurantId }).lean<
            SupplierDto[]
        >();

        const newSupplierModel = suppliers.map(supplier => ({
            id: supplier._id.toString(),
            name: supplier.supplier_name,
            email: supplier.supplier_email,
            phone: supplier.supplier_phone_number,
            contactPerson: supplier.supplier_contact_person,
            minimumOrderQuantity: supplier.supplier_minimum_order_quantity,
        }));

        return newSupplierModel;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw new Error('Failed to fetch suppliers');
    }
}

export async function getSupplierById(id: string): Promise<supplierModel | null> {
    try {
        const session = await auth();
        const restaurantId = session?.user?.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        await dbConnect();

        const supplier = await Supplier.findOne({
            _id: id,
            restaurant_id: restaurantId,
        }).lean<SupplierDto>();

        if (!supplier) {
            return null;
        }

        return {
            id: supplier._id.toString(),
            name: supplier.supplier_name,
            email: supplier.supplier_email,
            phone: supplier.supplier_phone_number,
            contactPerson: supplier.supplier_contact_person,
            minimumOrderQuantity: supplier.supplier_minimum_order_quantity,
        };
    } catch (error) {
        console.error('Error fetching supplier by ID:', error);
        throw new Error('Failed to fetch supplier');
    }
}

export async function getAllProducts(): Promise<ProductModel[]> {
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
            supplierId: product.supplier_id.toString(),
        }));

        return newProductModel;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}
