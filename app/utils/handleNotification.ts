import StockHistory from '@/models/stock-history';
import { createNotification } from '@/actions/notification.actions';
import { generateAiNotification } from './generateAiNotification';

type HandleNotificationsArgs = {
    productId: string;
    restaurantId: string;
    productName: string;
    totalStock: number;
    measurementUnit: string;
    entryType: string;
    expirationDate?: Date | null;
    currentStock: number;
    minimumLevel: number;
};

/** --- Utility Helpers --- **/

function shouldSendLowStock(
    currentStock: number,
    totalStock: number,
    minLevel: number,
    isFirstStock: boolean,
) {
    return !isFirstStock && currentStock >= minLevel && totalStock < minLevel;
}

function shouldSendExpiry(expirationDate?: Date | null) {
    if (!expirationDate) return null;
    const now = Date.now();
    const daysUntil = Math.ceil((expirationDate.getTime() - now) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 2 ? daysUntil : null;
}

/** --- Main Handler --- **/

export async function handleNotifications({
    productId,
    restaurantId,
    productName,
    totalStock,
    measurementUnit,
    entryType,
    expirationDate,
    currentStock,
    minimumLevel,
}: HandleNotificationsArgs) {
    const contextUrl = `/dashboard/inventory-management/product-details/${productId}`;
    const isFirstStock =
        currentStock === 0 && (await StockHistory.countDocuments({ product_id: productId })) === 0;

    /** 🔔 Low Stock Notifications */
    if (
        shouldSendLowStock(currentStock, totalStock, minimumLevel, isFirstStock) ||
        totalStock === 0
    ) {
        await createNotification({
            restaurantId,
            title: 'Inventory Low Stock',
            message: `${productName} is low on stock. Current stock: ${totalStock} ${measurementUnit}.`,
            type: 'inventory',
            isUrgent: totalStock === 0 || totalStock < minimumLevel,
            contextUrl,
        });

        // Generate AI reorder draft (throttled to once per 24h)
        await generateAiNotification({ productId, restaurantId, contextUrl });
    }

    /** ⏳ Expiration Notifications */
    if (entryType === 'addition') {
        const daysUntil = shouldSendExpiry(expirationDate);
        if (daysUntil !== null) {
            await createNotification({
                restaurantId,
                title: 'Inventory Expiring Soon',
                message: `${productName} will expire in ${daysUntil} day${daysUntil === 1 ? '' : 's'}. Current stock: ${totalStock} ${measurementUnit}.`,
                type: 'inventory',
                isUrgent: daysUntil <= 2,
                contextUrl,
            });
        }
    }
}
