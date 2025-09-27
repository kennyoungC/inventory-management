'use server';

import { revalidatePath } from 'next/cache';
import { auth } from 'auth';
import Notification, { NotificationType } from '@/models/notifications';
import { toNotificationModel } from '../transformers';
import dbConnect from '../db';

type CreateNotificationArgs = {
    restaurantId: string;
    title: string;
    message: string;
    type: NotificationType;
    isUrgent?: boolean;
    contextUrl?: string;
    summary?: string;
};

export async function createNotification({
    restaurantId,
    title,
    message,
    summary,
    type,
    isUrgent = false,
    contextUrl,
}: CreateNotificationArgs) {
    await dbConnect();
    const notification = await Notification.create({
        restaurant_id: restaurantId,
        title,
        message,
        summary,
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
    revalidatePath('/dashboard/notifications');
    return { success: true, data: toNotificationModel(updated) };
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
    revalidatePath('/dashboard/notifications');
    return { success: true, data: result };
}
