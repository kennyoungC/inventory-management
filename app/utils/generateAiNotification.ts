import Notification from '@/models/notifications';
import Product from '@/models/product';
import Restaurant, { RestaurantDto } from '@/models/restaurants';
import { NotificationType, ProductWithSupplierDto } from '@/types/index';
import { generateAiReorderEmailDraft } from './generateAiReorderEmail';

async function createNotification(params: {
    restaurantId: string;
    title: string;
    message: string;
    type: NotificationType;
    isUrgent?: boolean;
    contextUrl: string;
}) {
    const { restaurantId, title, message, type, isUrgent = false, contextUrl } = params;
    await Notification.create({
        restaurant_id: restaurantId,
        title,
        message,
        type,
        is_urgent: isUrgent,
        context_url: contextUrl,
    });
}

export async function generateAiNotification({
    productId,
    restaurantId,
    contextUrl,
}: {
    productId: string;
    restaurantId: string;
    contextUrl: string;
}) {
    try {
        const product = await Product.findById(productId)
            .select('supplier_id minimum_stock_level current_stock_level name measurement_unit')
            .lean<ProductWithSupplierDto>();

        const restaurant = await Restaurant.findById(restaurantId)
            .select('restaurant_name')
            .lean<RestaurantDto>();

        if (product) {
            const supplier = product.supplier_id;
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const existingAi = await Notification.findOne({
                restaurant_id: restaurantId,
                type: 'ai_agent',
                title: 'Draft Reorder Email',
                context_url: contextUrl,
                createdAt: { $gte: twentyFourHoursAgo },
            }).lean();

            if (!existingAi) {
                const draft = await generateAiReorderEmailDraft({
                    restaurantName: restaurant?.restaurant_name ?? 'Your Restaurant',
                    productName: product.name,
                    currentStock: product.current_stock_level,
                    minimumStockLevel: product.minimum_stock_level,
                    measurementUnit: product.measurement_unit,
                    supplierName: supplier?.supplier_name ?? null,
                    supplierEmail: supplier?.supplier_email ?? null,
                    supplierMinimumOrderQuantity: supplier?.supplier_minimum_order_quantity ?? null,
                });

                console.log('Draft:', draft);
                let message = `${draft.subject}\n\n${draft.bodyText}`;
                if (draft.mailto) {
                    message += `\n\n👉 [Click here to send email](${draft.mailto})`;
                }

                await createNotification({
                    restaurantId,
                    title: 'Draft Reorder Email',
                    message,
                    type: 'ai_agent',
                    contextUrl,
                });
            }
        }
    } catch (err) {
        console.error('AI draft generation failed:', err);
    }
}
