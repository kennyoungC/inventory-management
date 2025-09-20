import { Schema, model, models, Document } from 'mongoose';

export type NotificationType = 'ai_agent' | 'inventory';

export interface NotificationDto extends Document {
    _id: Schema.Types.ObjectId;
    restaurant_id: Schema.Types.ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    is_urgent: boolean;
    context_url?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDto>(
    {
        restaurant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a title for this notification.'],
            maxlength: [120, 'Title cannot be more than 120 characters'],
        },
        message: {
            type: String,
            required: [true, 'Please provide a message for this notification.'],
            maxlength: [1000, 'Message cannot be more than 1000 characters'],
        },
        type: {
            type: String,
            enum: ['ai_agent', 'inventory'],
            required: true,
            index: true,
        },
        is_read: {
            type: Boolean,
            default: false,
            index: true,
        },
        is_urgent: {
            type: Boolean,
            default: false,
        },
        context_url: {
            type: String,
            required: false,
        },
    },
    { timestamps: true },
);

NotificationSchema.index({ restaurant_id: 1, createdAt: -1 });

const Notification =
    models.Notification || model<NotificationDto>('Notification', NotificationSchema);
export default Notification;
