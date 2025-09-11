import Supplier, { SupplierDto } from '@/models/supplier';
import dbConnect from '../db';
import { auth } from 'auth';
import { supplierModel } from '../types';
import { transformSupplierDto, transformSuppliersDto } from '@/transformers/product';

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

        return transformSuppliersDto(suppliers);
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

        if (!supplier) {
            return null;
        }

        return transformSupplierDto(supplier);
    } catch (error) {
        console.error('Error fetching supplier by ID:', error);
        throw new Error('Failed to fetch supplier');
    }
}
