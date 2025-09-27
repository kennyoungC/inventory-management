import Notification, { NotificationDto } from '@/models/notifications';
import dbConnect from '../db';
import { NotificationModel } from '../types';
import { auth } from 'auth';
import { toNotificationModel } from '../transformers';

export async function listNotifications(): Promise<NotificationModel[]> {
    await dbConnect();
    const session = await auth();
    const restaurantId = session?.user?.id;
    if (!restaurantId) return [];

    const docs = await Notification.find({ restaurant_id: restaurantId })
        .sort({ createdAt: -1 })
        .lean<NotificationDto[]>();

    return docs.map(toNotificationModel);
}

export async function getNotificationCount(): Promise<number> {
    await dbConnect();
    const session = await auth();
    const restaurantId = session?.user?.id;
    if (!restaurantId) return 0;

    return Notification.countDocuments({ restaurant_id: restaurantId, is_read: false });
}

export async function clearNotifications() {
    await dbConnect();
    const session = await auth();
    const restaurantId = session?.user?.id;
    if (!restaurantId) return { success: false, message: 'Unauthorized' };

    const result = await Notification.deleteMany({ restaurant_id: restaurantId });
    return { success: true, deletedCount: result.deletedCount || 0 };
}
