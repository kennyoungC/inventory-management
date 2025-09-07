'use server';

import StockHistory from '@/models/stock-history';
import Product from '@/models/product';
import { generateEntryId } from '@/utils/generateCode';
import dbConnect from '../db';
import { auth } from 'auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { generateBatchId } from '@/utils/batchId';
import { getCodeSession } from '../session';

type valueName =
    | 'entryType'
    | 'productId'
    | 'quantity'
    | 'additionalNotes'
    | 'expirationDate'
    | 'currentStock'
    | 'measurementUnit'
    | 'general'
    | 'reason';

export type StockHistoryState = {
    errors?: Partial<Record<valueName, Array<string>>>;
    success?: boolean;
    message?: string;
    values?: Partial<Record<valueName, string>>;
} | null;

const StockHistorySchema = z
    .object({
        entryType: z.enum(['addition', 'removal']),
        productId: z.string().length(24, 'Invalid product ID'),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
        additionalNotes: z.string().max(500).optional(),
        measurementUnit: z.string().min(1, 'Measurement unit is required'),
        currentStock: z.coerce.number().min(0, 'Current stock must be at least 0'),
        expirationDate: z.coerce.date().optional(),
        reason: z.string().max(500).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.entryType === 'removal' && !data.reason) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['reason'],
                message: 'Reason is required for removal entries',
            });
        }

        if (data.entryType === 'addition' && !data.expirationDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['expirationDate'],
                message: 'Expiration date is recommended for addition entries',
            });
        }
        if (data.entryType === 'removal' && !data.expirationDate) {
            return;
        }
    });

export async function createStockEntry(
    _prevState: StockHistoryState,
    formData: FormData,
): Promise<StockHistoryState> {
    const data = Object.fromEntries(formData.entries());
    console.log('Form Data:', data);

    const validateFields = StockHistorySchema.safeParse(data);

    if (!validateFields.success) {
        console.log('Validated Data:', validateFields.error.flatten().fieldErrors);
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Validation failed',
            values: data,
        };
    }

    const {
        entryType,
        productId,
        quantity,
        additionalNotes,
        reason,
        expirationDate,
        currentStock,
        measurementUnit,
    } = validateFields.data;

    try {
        const session = await auth();
        const restaurantId = session?.user.id;

        if (!restaurantId) {
            return { errors: { general: ['Authentication required'] }, message: 'Not authorized' };
        }
        const codeSession = await getCodeSession();
        await dbConnect();

        const entryId = generateEntryId();
        const batchId = await generateBatchId(entryType, restaurantId, productId);

        const stockChange = entryType === 'addition' ? quantity : -quantity;
        const newStock = currentStock + stockChange;

        if (entryType === 'removal' && newStock < 0) {
            return {
                errors: { quantity: ['Insufficient stock available'] },
                message: 'Cannot remove more stock than available',
            };
        }

        await StockHistory.create({
            entry_id: entryId,
            restaurant_id: restaurantId,
            product_id: productId,
            stock_created_by: codeSession?.id,
            created_by_model: session.user.role === 'admin' ? 'Restaurant' : 'Staff',
            entry_type: entryType,
            entry_date: new Date(),
            quantity: Math.abs(quantity),
            measurement_unit: measurementUnit,
            batch_id: batchId,
            additional_notes: additionalNotes ?? '',
            previous_stock: currentStock,
            new_stock: newStock,
            reason: reason ?? '',
            expiration_date: entryType === 'addition' && expirationDate ? expirationDate : null,
        });

        await Product.findByIdAndUpdate(productId, {
            current_stock_level: newStock,
        });

        revalidatePath(`/dashboard/inventory-management/product-details/${productId}`);
        return {
            success: true,
            message: `Stock ${entryType} completed successfully`,
        };
    } catch (error) {
        console.error('Stock entry error:', error);
        return {
            errors: { general: ['Failed to process stock entry'] },
            message: 'An error occurred',
        };
    }
}
