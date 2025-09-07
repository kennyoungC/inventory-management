import { getInitials } from '@/utils/getInitials';
import dbConnect from '../db';
import SkuCounter from '@/models/sku-counter';

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
