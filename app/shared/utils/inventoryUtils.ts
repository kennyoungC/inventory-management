import dbConnect from 'app/lib/db';
import { getInitials } from 'app/shared/utils/textUtils';
import SkuCounter from '@/models/sku-counter';
import StockHistory from '@/models/stock-history';
import type { SectionType } from '@/types/index';

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
            .select('batch_id');

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

export async function generateSKU(name: string, category: string, restaurantId: string) {
    await dbConnect();

    const counter = await SkuCounter.findOneAndUpdate(
        { category, restaurant_id: restaurantId },
        { $inc: { lastSequence: 1 } },
        { new: true, upsert: true },
    );

    const sequence = counter.lastSequence.toString().padStart(3, '0');
    return `${getInitials(name)}-${getInitials(category)}-${sequence}`;
}
