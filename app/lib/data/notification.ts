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
