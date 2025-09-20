import { NotificationDto } from '@/models/notifications';
import { NotificationModel } from '../types';

export function toNotificationModel(doc: NotificationDto): NotificationModel {
    return {
        id: doc._id.toString(),
        restaurantId: doc.restaurant_id.toString(),
        title: doc.title,
        message: doc.message,
        type: doc.type,
        isRead: doc.is_read,
        isUrgent: doc.is_urgent,
        contextUrl: doc.context_url,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}
