import StockHistory from '@/models/stock-history';
import { createNotification } from '@/actions/notification.actions';
import { generateAiNotification } from 'app/shared/utils/generateAiNotification';
import { NotificationTitle } from '@/types/index';
import { shouldSendExpiry } from 'app/shared/utils/dateUtils';

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

    if (
        (!isFirstStock && currentStock >= minimumLevel && totalStock < minimumLevel) ||
        totalStock === 0
    ) {
        await createNotification({
            restaurantId,
            title: NotificationTitle.InventoryLowStock,
            type: 'inventory',
            isUrgent: totalStock < minimumLevel,
            contextUrl,
            summary: `${productName} is low on stock.`,
            message: `${productName} is low on stock. Current stock: ${totalStock} ${measurementUnit}.`,
        });

        // Generate AI reorder draft (throttled to once per 24h)
        if ((entryType === 'removal' && totalStock < minimumLevel) || totalStock === 0) {
            await generateAiNotification({ productId, restaurantId, contextUrl });
        }
    }

    if (entryType === 'addition') {
        const daysUntil = shouldSendExpiry(expirationDate);
        if (daysUntil !== null) {
            await createNotification({
                restaurantId,
                title: NotificationTitle.InventoryExpiringSoon,
                message: `${productName} will expire in ${daysUntil} day${daysUntil === 1 ? '' : 's'}. Current stock: ${totalStock} ${measurementUnit}.`,
                summary: `${productName} will expire in ${daysUntil} day${daysUntil === 1 ? '' : 's'}.`,
                type: 'inventory',
                isUrgent: daysUntil <= 2,
                contextUrl,
            });
        }
    }
}
