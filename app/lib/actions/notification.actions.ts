import dbConnect from '../db';
import Notification, { NotificationType } from '@/models/notifications';
import { auth } from 'auth';

type CreateNotificationArgs = {
    restaurantId: string;
    title: string;
    message: string;
    type: NotificationType;
    isUrgent?: boolean;
    contextUrl?: string;
};

export async function createNotification({
    restaurantId,
    title,
    message,
    type,
    isUrgent = false,
    contextUrl,
}: CreateNotificationArgs) {
    await dbConnect();
    const notification = await Notification.create({
        restaurant_id: restaurantId,
        title,
        message,
        type,
        is_urgent: isUrgent,
        context_url: contextUrl,
    });

    return { success: true, data: notification };
}

export async function markNotificationAsRead(id: string) {
    await dbConnect();
    const session = await auth();
    const restaurantId = session?.user?.id;
    if (!restaurantId) return { success: false, message: 'Unauthorized' };

    const updated = await Notification.findOneAndUpdate(
        { _id: id, restaurant_id: restaurantId },
        { is_read: true },
    );
    if (!updated) return { success: false, message: 'Notification not found' };
    return { success: true, data: updated };
}

export async function deleteNotification(id: string) {
    await dbConnect();
    const session = await auth();
    const restaurantId = session?.user?.id;
    if (!restaurantId) return { success: false, message: 'Unauthorized' };

    const result = await Notification.deleteOne({ _id: id, restaurant_id: restaurantId });
    if (result.deletedCount === 0) {
        return { success: false, message: 'Notification not found' };
    }
    return { success: true, data: result };
}
