import { generateSupplierReorderEmail } from './generateSupplierReorderEmail';
import { createNotification } from '@/actions/notification.actions';
import { getProductWithSupplier } from '@/data/product';
import Notification from '@/models/notifications';
import Restaurant from '@/models/restaurants';
import { NotificationTitle } from '@/types/index';

type AINotificationArgs = {
    productId: string;
    restaurantId: string;
    contextUrl: string;
};

export async function generateAiNotification({
    productId,
    restaurantId,
    contextUrl,
}: AINotificationArgs) {
    try {
        const productWithSupplier = await getProductWithSupplier(productId);

        const restaurant = await Restaurant.findById(restaurantId).select('restaurant_name');

        if (!restaurant || !productWithSupplier) return;

        const supplier = productWithSupplier.supplier;

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const existingAi = await Notification.findOne({
            restaurant_id: restaurantId,
            type: 'ai_agent',
            title: NotificationTitle.DraftReorderEmail,
            context_url: contextUrl,
            createdAt: { $gte: twentyFourHoursAgo },
        }).lean();

        if (!existingAi) {
            const draft = await generateSupplierReorderEmail({
                restaurantName: restaurant.restaurant_name,
                productName: productWithSupplier.name,
                currentStock: productWithSupplier.currentStock,
                minimumStockLevel: productWithSupplier.minimumStockLevel,
                measurementUnit: productWithSupplier.measurementUnit,
                supplierName: supplier?.name,
                supplierEmail: supplier?.email,
            });

            await createNotification({
                restaurantId,
                title: NotificationTitle.DraftReorderEmail,
                message: draft.summaryHtml,
                type: 'ai_agent',
                contextUrl,
                summary: draft.summary,
            });
        }
    } catch (err) {
        console.error('Failed to generate AI reorder email draft:', err);
    }
}
