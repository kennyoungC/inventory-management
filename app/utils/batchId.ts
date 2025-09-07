// utils/batchId.ts

import StockHistory, { StockHistoryDto } from '@/models/stock-history';
import { SectionType } from '@/types/index';
import dbConnect from 'app/lib/db';

export async function generateBatchId(
    entryType: SectionType,
    restaurantId: string,
    productId: string,
): Promise<string> {
    const prefix = entryType === 'addition' ? 'A' : 'R';

    try {
        await dbConnect();

        const latestEntry = await StockHistory.findOne({
            restaurant_id: restaurantId,
            product_id: productId,
            batch_id: { $regex: `^${prefix}\\d{3}$` },
        })
            .sort({ batch_id: -1 })
            .select('batch_id')
            .lean<StockHistoryDto>();

        let nextNumber = 1;

        if (latestEntry?.batch_id) {
            const numberPart = latestEntry.batch_id.substring(1);
            const lastNumber = parseInt(numberPart, 10);

            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }

        return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
        console.error('Error generating batch ID:', error);
        const timestamp = Date.now().toString().slice(-3);
        return `${prefix}${timestamp}`;
    }
}
