'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from 'auth';
import Product, { ProductDto } from '@/models/product';
import Supplier from '@/models/supplier';
import { getCurrentSessionUser } from '@/data/session';
import { MapMongoDuplicateError, generateSKU } from 'app/shared/utils';
import dbConnect from '../db';
import { MongoDuplicateError } from '../types';

type ProductInput = z.infer<typeof ProductSchema>;
type ValueName = keyof ProductInput;

export type State = {
    errors?: Partial<Record<ValueName, Array<string>>>;
    success?: boolean;
    message?: string;
    values?: Partial<Record<ValueName, string>>;
} | null;

const fieldNameMap: Record<string, string> = {
    supplier_email: 'supplierEmail',
    supplier_name: 'supplierName',
};
const startingCurrentStock = 0;

const ProductSchema = z
    .object({
        name: z.string().min(1, 'Product name is required'),
        category: z.string().min(1, 'Category is required'),
        measurementUnit: z.string().min(1, 'Measurement unit is required'),
        minimumStockLevel: z.coerce
            .number()
            .int()
            .nonnegative()
            .min(1, 'Minimum stock level must above 0'),
        storageLocation: z.string().min(1, 'Storage location is required').trim(),
        additionalNotes: z.string().optional(),
        supplierType: z.enum(['internal', 'external']).optional(),
        supplierSelection: z.enum(['existing', 'new']).optional(),
        existingSupplierId: z.string().optional(),
        supplierName: z.string().optional(),
        supplierContactPerson: z.string().optional(),
        general: z.string().optional(),
        supplierPhoneNumber: z
            .string()
            .optional()
            .refine(
                val => {
                    if (!val || val.trim() === '') return true;
                    const digitsOnly = val.replace(/\D/g, '');
                    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
                },
                {
                    message: 'Phone number must contain 10-15 digits when provided',
                },
            ),
        supplierEmail: z
            .string()
            .optional()
            .transform(val => val?.toLowerCase()),
        supplierMinimumOrderQuantity: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.supplierType === 'external' && data.supplierSelection === 'new') {
            if (!data.supplierName) {
                ctx.addIssue({
                    path: ['supplierName'],
                    message: 'Supplier name is required',
                    code: z.ZodIssueCode.custom,
                });
            }
            if (!data.supplierContactPerson) {
                ctx.addIssue({
                    path: ['supplierContactPerson'],
                    message: 'Contact person is required',
                    code: z.ZodIssueCode.custom,
                });
            }
            if (!data.supplierPhoneNumber) {
                ctx.addIssue({
                    path: ['supplierPhoneNumber'],
                    message: 'Phone number is required',
                    code: z.ZodIssueCode.custom,
                });
            }
            if (!data.supplierEmail) {
                ctx.addIssue({
                    path: ['supplierEmail'],
                    message: 'Email is required',
                    code: z.ZodIssueCode.custom,
                });
            }
            if (!data.supplierMinimumOrderQuantity) {
                ctx.addIssue({
                    path: ['supplierMinimumOrderQuantity'],
                    message: 'Minimum order is required',
                    code: z.ZodIssueCode.custom,
                });
            }
        } else if (data.supplierType === 'external' && data.supplierSelection === 'existing') {
            if (!data.existingSupplierId) {
                ctx.addIssue({
                    path: ['existingSupplierId'],
                    message: 'Existing supplier is required',
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

export async function createProduct(_prevState: State, formData: FormData): Promise<State> {
    const data = Object.fromEntries(formData.entries());

    const validateFields = ProductSchema.safeParse(data);
    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Validation failed',
            values: data,
        };
    }

    const {
        name,
        category,
        measurementUnit,
        minimumStockLevel,
        storageLocation,
        supplierName,
        supplierPhoneNumber,
        supplierEmail,
        supplierContactPerson,
        additionalNotes,
        supplierType,
        supplierSelection,
        supplierMinimumOrderQuantity,
        existingSupplierId,
    } = validateFields.data;

    const session = await auth();
    if (!session?.user?.id) {
        return { errors: { general: ['Authentication required'] }, message: 'Not authorized' };
    }

    const user = await getCurrentSessionUser();

    if (!user) {
        return { errors: { general: ['User not found'] }, message: 'Not authorized' };
    }

    try {
        await dbConnect();

        let supplierIdToUse: string | undefined = existingSupplierId;
        const sku = await generateSKU(name, category, session?.user?.id);

        if (supplierType === 'external' && supplierSelection === 'new') {
            const errors: Record<string, string[]> = {};
            const [existingEmail, existingName] = await Promise.all([
                Supplier.findOne({
                    restaurant_id: session?.user?.id,
                    supplier_email: supplierEmail,
                }).lean(),
                Supplier.findOne({
                    restaurant_id: session?.user?.id,
                    supplier_name: supplierName,
                }).lean(),
            ]);
            if (existingEmail) {
                errors.supplierEmail = [`Email "${supplierEmail}" already exists`];
            }

            if (existingName) {
                errors.supplierName = [`Name "${supplierName}" already exists`];
            }

            if (Object.keys(errors).length > 0) {
                return {
                    errors,
                    message: 'Duplicate values found',
                    values: data,
                };
            }

            const created = await Supplier.create({
                supplier_name: supplierName,
                supplier_contact_person: supplierContactPerson,
                supplier_phone_number: supplierPhoneNumber,
                supplier_email: supplierEmail,
                supplier_minimum_order_quantity: Number(supplierMinimumOrderQuantity),
                restaurant_id: session?.user?.id,
            });
            supplierIdToUse = created._id.toString();
        }

        await Product.create({
            name,
            sku,
            category,
            measurement_unit: measurementUnit,
            minimum_stock_level: minimumStockLevel,
            current_stock_level: startingCurrentStock,
            storage_location: storageLocation,
            supplier_id: supplierIdToUse,
            created_by: user.name,
            restaurant_id: session?.user?.id,
            additional_notes: additionalNotes,
        });

        revalidatePath('/dashboard/product-management');
        return { success: true, message: 'Product created successfully' };
    } catch (error) {
        const mongoError = error as MongoDuplicateError;

        const duplicateResult = MapMongoDuplicateError(mongoError, fieldNameMap);
        if (duplicateResult) {
            return { ...duplicateResult, values: data };
        }

        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return {
            errors: { general: [message] },
            message: 'Failed to create product',
            values: data,
        };
    }
}

export async function deleteProduct(productId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            errors: { general: ['You must be logged in to delete products. Please Refresh Page'] },
            message: 'Authentication required',
        };
    }

    await dbConnect();

    try {
        const result = await Product.deleteOne({ _id: productId, restaurant_id: session.user.id });

        if (!result.acknowledged || result.deletedCount === 0) {
            return {
                errors: { general: ['Product not found or you do not have permission to delete.'] },
                message: 'Product not found',
            };
        }
        return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
        console.error('Error deleting product:', error);
        return {
            errors: { general: ['Failed to delete product. Please try again later.'] },
            message: 'Failed to delete product',
        };
    }
}

export async function editProduct(
    productId: string,
    _prevState: State,
    formData: FormData,
): Promise<State> {
    const data = Object.fromEntries(formData.entries());

    const validateFields = ProductSchema.safeParse(data);

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Validation failed',
            values: data,
        };
    }

    const session = await auth();

    if (!session?.user?.id) {
        return {
            errors: { general: ['You must be logged in to edit products. Please Refresh Page'] },
            message: 'Authentication required',
        };
    }

    try {
        await dbConnect();

        const {
            name,
            category,
            measurementUnit,
            minimumStockLevel,
            storageLocation,
            additionalNotes,
            existingSupplierId,
        } = validateFields.data;

        const currentProduct = await Product.findById(productId).lean<ProductDto>();

        let sku = currentProduct?.sku;
        if (name !== currentProduct?.name || category !== currentProduct?.category) {
            sku = await generateSKU(name, category, session?.user?.id);
        }

        await Product.findByIdAndUpdate(productId, {
            name,
            sku,
            category,
            measurement_unit: measurementUnit,
            minimum_stock_level: minimumStockLevel,
            current_stock_level: currentProduct?.current_stock_level,
            storage_location: storageLocation,
            additional_notes: additionalNotes,
            supplier_id: existingSupplierId,
        });

        revalidatePath('/dashboard/product-management/' + productId);
        return { success: true, message: 'Product updated successfully' };
    } catch (error) {
        console.error('Error updating product:', error);
        return {
            errors: { general: ['Failed to update product. Please try again later.'] },
            message: 'Failed to update product',
        };
    }
}
