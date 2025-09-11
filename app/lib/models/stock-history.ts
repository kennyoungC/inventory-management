import { Schema, model, models, Document } from 'mongoose';
import { SectionType } from '../types';

export interface StockHistoryDto extends Document {
    restaurant_id: Schema.Types.ObjectId;
    stock_created_by: Schema.Types.ObjectId;
    created_by_model: 'Staff' | 'Restaurant';
    product_id: Schema.Types.ObjectId;
    entry_type: SectionType;
    entry_id: string;
    entry_date: Date;
    quantity: number;
    measurement_unit: string;
    expiration_date: Date;
    additional_notes: string;
    previous_stock: number;
    new_stock: number;
    reason: string;
    batch_id: string;
}

const StockHistorySchema = new Schema<StockHistoryDto>(
    {
        restaurant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            index: true,
        },
        stock_created_by: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'created_by_model', // ✅ Use refPath instead of ref array
            index: true,
        },
        created_by_model: {
            type: String,
            required: true,
            enum: ['Staff', 'Restaurant'], // ✅ Define which models can be referenced
        },
        entry_type: {
            type: String,
            enum: ['addition', 'removal'],
            required: true,
        },
        entry_date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        measurement_unit: {
            type: String,
            required: [true, 'Please provide a measurement unit for this product.'],
        },

        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
        },
        expiration_date: {
            type: Date,
            allowNull: true,
            required: false,
        },
        previous_stock: {
            type: Number,
            required: true,
        },
        new_stock: {
            type: Number,
            required: true,
        },
        batch_id: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            maxlength: [200, 'Reason cannot exceed 200 characters'],
        },
        entry_id: {
            type: String,
            required: true,
            unique: true,
        },
        additional_notes: {
            type: String,
            maxlength: [500, 'Additional notes cannot exceed 500 characters'],
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
