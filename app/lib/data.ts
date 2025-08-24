import { auth } from 'auth';
import dbConnect from './db';
import Product, { ProductDto } from './models/product';
import Supplier, { SupplierDto } from './models/supplier';
import {
    ProductModel,
    ProductWithSupplierModel,
    ProductWithSupplierDto,
    supplierModel,
} from './types';

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

export async function getSupplierById(supplierId: string): Promise<supplierModel | null> {
    try {
        const session = await auth();
        const restaurantId = session?.user?.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        await dbConnect();

        const supplier = await Supplier.findOne({
            _id: supplierId,
            restaurant_id: restaurantId,
        }).lean<SupplierDto>();

        console.log({ supplier });

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

export async function getProductWithSupplier(
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

        return {
            id: productWithSupplier._id?.toString(),
            name: productWithSupplier.name,
            sku: productWithSupplier.sku,
            category: productWithSupplier.category,
            currentStock: productWithSupplier.current_stock_level,
            measurementUnit: productWithSupplier.measurement_unit,
            minimumStockLevel: productWithSupplier.minimum_stock_level,
            storageLocation: productWithSupplier.storage_location,
            createdBy: productWithSupplier.created_by,
            supplier: productWithSupplier.supplier_id
                ? {
                      id: productWithSupplier.supplier_id._id.toString(),
                      name: productWithSupplier.supplier_id.supplier_name,
                      email: productWithSupplier.supplier_id.supplier_email,
                      phone: productWithSupplier.supplier_id.supplier_phone_number,
                      contactPerson: productWithSupplier.supplier_id.supplier_contact_person,
                      minimumOrderQuantity: `${productWithSupplier.supplier_id.supplier_minimum_order_quantity} ${productWithSupplier.measurement_unit}`,
                  }
                : null,
        };
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw new Error('Failed to fetch product');
    }
}
