import dbConnect from 'app/lib/db';
import StockHistory, { StockHistoryDto } from 'app/lib/models/stock-history';
import Product, { ProductDto } from 'app/lib/models/product';
import Notification from 'app/lib/models/notifications';

type ScanResult = {
    checked: number;
    notified: number;
};

export async function scanExpiringBatchesAndNotify(daysThreshold: number = 2): Promise<ScanResult> {
    await dbConnect();

    const now = new Date();
    const upper = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

    const batches = await StockHistory.find({
        entry_type: 'addition',
        expiration_date: { $ne: null, $gte: now, $lte: upper },
    })
        .select('product_id restaurant_id expiration_date')
        .sort({ expiration_date: 1 })
        .lean<StockHistoryDto[]>();

    // Group by product and restaurant; pick soonest expiration
    const keyToBatch = new Map<string, StockHistoryDto>();
    for (const b of batches) {
        const key = `${b.restaurant_id.toString()}::${b.product_id.toString()}`;
        if (!keyToBatch.has(key)) keyToBatch.set(key, b);
    }

    let notified = 0;

    for (const [key, batch] of keyToBatch.entries()) {
        const [restaurantId, productId] = key.split('::');

        const product = await Product.findById(productId)
            .select('name measurement_unit current_stock_level')
            .lean<ProductDto | null>();
        if (!product || !batch.expiration_date) continue;

        const msPerDay = 1000 * 60 * 60 * 24;
        const daysUntil = Math.ceil(
            (new Date(batch.expiration_date).getTime() - now.getTime()) / msPerDay,
        );
        if (daysUntil < 0) continue;

        // Idempotency: avoid duplicate expiring-soon notifications within 24h for this product
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const contextUrl = `/dashboard/inventory-management/product-details/${productId}`;
        const existing = await Notification.findOne({
            restaurant_id: restaurantId,
            type: 'inventory',
            title: 'Inventory Expiring Soon',
            context_url: contextUrl,
            createdAt: { $gte: twentyFourHoursAgo },
        }).lean();
        if (existing) continue;

        await Notification.create({
            restaurant_id: restaurantId,
            title: 'Inventory Expiring Soon',
            message: `${product.name} will expire in ${daysUntil} day${daysUntil === 1 ? '' : 's'}. Current stock: ${product.current_stock_level} ${product.measurement_unit}.`,
            type: 'inventory',
            is_urgent: daysUntil <= 1,
            context_url: contextUrl,
        });
        notified += 1;
    }

    return { checked: keyToBatch.size, notified };
}
