import { Schema, model, models, Document, Types } from 'mongoose';

export interface StockHistoryDto extends Document {
    product_id: Schema.Types.ObjectId;
    restaurant_id: Schema.Types.ObjectId;
    staff_id: Schema.Types.ObjectId;
    action: 'add' | 'remove';
    quantity: number;
    previous_stock?: number;
    new_stock?: number;
    batch_id?: string;
    transaction_id: string;
    comments?: string;
}

const StockHistorySchema = new Schema<StockHistoryDto>(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            index: true,
        },
        restaurant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        staff_id: {
            type: Schema.Types.ObjectId,
            ref: 'Staff',
            required: true,
            index: true,
        },
        action: {
            type: String,
            enum: ['add', 'remove'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            // Positive for add, positive number for remove as absolute value
            min: [1, 'Quantity must be at least 1'],
        },
        previous_stock: {
            type: Number,
        },
        new_stock: {
            type: Number,
        },
        batch_id: {
            type: String,
        },
        transaction_id: {
            type: String,
            required: true,
            unique: true,
            default: () => new Types.ObjectId().toHexString(),
        },
        comments: {
            type: String,
            maxlength: [500, 'Comments cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    },
);

// Common query patterns
StockHistorySchema.index({ product_id: 1, createdAt: -1 });
StockHistorySchema.index({ restaurant_id: 1, createdAt: -1 });

const StockHistory =
    models.StockHistory || model<StockHistoryDto>('StockHistory', StockHistorySchema);
export default StockHistory;
