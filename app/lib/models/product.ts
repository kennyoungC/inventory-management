import { Schema, model, models, Document } from 'mongoose';

export interface ProductDto extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    sku: string;
    category: string;
    measurement_unit: string;
    minimum_stock_level: number;
    current_stock_level: number;
    storage_location: string;
    additional_notes: string;
    supplier_id: Schema.Types.ObjectId;
    restaurant_id: Schema.Types.ObjectId;
    stock_history: Schema.Types.ObjectId;
    created_by: string;
}

const ProductSchema = new Schema<ProductDto>(
    {
        restaurant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a name for this product.'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            required: [true, 'Please provide a category for this product.'],
        },
        measurement_unit: {
            type: String,
            required: [true, 'Please provide a measurement unit for this product.'],
        },
        minimum_stock_level: {
            type: Number,
            required: [true, 'Please provide a minimum stock level for this product.'],
        },
        current_stock_level: {
            type: Number,
            required: [true, 'Please provide a current stock level for this product.'],
        },
        storage_location: {
            type: String,
            required: [true, 'Please provide a storage location for this product.'],
        },
        additional_notes: {
            type: String,
            required: false,
        },
        supplier_id: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
            required: false,
            index: true,
        },
        stock_history: {
            type: Schema.Types.ObjectId,
            ref: 'StockHistory',
            required: false,
        },
        created_by: {
            type: String,
            required: [true, 'Please provide the name of the user who created this product.'],
        },
    },
    {
        timestamps: true,
    },
);

const Product = models.Product || model<ProductDto>('Product', ProductSchema);
export default Product;
