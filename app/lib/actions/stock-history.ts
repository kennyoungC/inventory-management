'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import StockHistory from '@/models/stock-history';
import Product, { ProductDto } from '@/models/product';
import {
    generateBatchId,
    handleNotifications,
    validateAuthentication,
    generateEntryId,
} from 'app/shared/utils';
import dbConnect from '../db';

type StockHistoryInput = z.infer<typeof StockHistorySchema>;
type ValueName = keyof StockHistoryInput;
type DataType = Partial<Record<ValueName, string>>;
export type StockHistoryState = {
    errors?: Partial<Record<ValueName, Array<string>>>;
    success?: boolean;
    message?: string;
    values?: DataType;
} | null;

const StockHistorySchema = z
    .object({
        entryType: z.enum(['addition', 'removal']),
        productId: z.string().length(24, 'Invalid product ID'),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
        additionalNotes: z.string().max(500).optional(),
        measurementUnit: z.string().min(1, 'Measurement unit is required'),
        currentStock: z.coerce.number().min(0, 'Current stock must be at least 0'),
        expirationDate: z.preprocess(
            val => (val ? new Date(String(val)) : undefined),
            z.date().optional(),
        ),
        reason: z.string().max(500).optional(),
        general: z.string().optional(),
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

    const validateFields = StockHistorySchema.safeParse(data);

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Validation failed',
            values: data,
        };
    }

    const { entryType, productId, quantity, expirationDate, currentStock, measurementUnit } =
        validateFields.data;

    try {
        const { restaurantDetails } = await validateAuthentication();
        await dbConnect();

        const stockChange = entryType === 'addition' ? quantity : -quantity;
        const totalStock = currentStock + stockChange;

        console.log({ totalStock });

        if (entryType === 'removal' && totalStock < 0) {
            return {
                errors: { quantity: ['Insufficient stock available'] },
                message: 'Cannot remove more stock than available',
            };
        }

        const { productDoc } = await executeStockTransaction(validateFields.data, totalStock);

        await handleNotifications({
            productId,
            restaurantId: restaurantDetails.id,
            productName: productDoc.name,
            totalStock,
            measurementUnit,
            entryType,
            expirationDate,
            currentStock,
            minimumLevel: productDoc.minimum_stock_level,
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

async function executeStockTransaction(validatedData: StockHistoryInput, totalStock: number) {
    const {
        entryType,
        productId,
        quantity,
        additionalNotes,
        reason,
        expirationDate,
        currentStock,
        measurementUnit,
    } = validatedData;

    const { restaurantDetails, session, codeSession } = await validateAuthentication();

    const connection = await dbConnect();
    const mongoSession = await connection.connection.startSession();

    try {
        const result = await mongoSession.withTransaction(async () => {
            const entryId = generateEntryId();
            const batchId = await generateBatchId(entryType, restaurantDetails.id, productId);

            const [stockHistoryEntry] = await StockHistory.create(
                [
                    {
                        entry_id: entryId,
                        restaurant_id: restaurantDetails.id,
                        product_id: productId,
                        stock_created_by: codeSession?.id,
                        created_by_model: session.user.role === 'admin' ? 'Restaurant' : 'Staff',
                        entry_type: entryType,
                        entry_date: new Date(),
                        quantity: Math.abs(quantity),
                        measurement_unit: measurementUnit,
                        batch_id: batchId,
                        additional_notes: additionalNotes?.trim() ?? '',
                        previous_stock: currentStock,
                        new_stock: totalStock,
                        reason: reason?.trim() ?? '',
                        expiration_date:
                            entryType === 'addition' && expirationDate ? expirationDate : null,
                    },
                ],
                { session: mongoSession },
            );

            const productDoc = await Product.findByIdAndUpdate(
                productId,
                { current_stock_level: totalStock },
                {
                    new: true,
                    select: 'name minimum_stock_level',
                    session: mongoSession,
                },
            ).lean<ProductDto>();

            if (!productDoc) {
                throw new Error('Product not found or update failed');
            }

            return { stockHistoryEntry, productDoc };
        });

        return result;
    } finally {
        await mongoSession.endSession();
    }
}
