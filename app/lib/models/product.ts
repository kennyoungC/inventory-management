import { Schema, model, models, Document } from 'mongoose';

export interface ProductDto extends Document {
    name: string;
    sku: string;
    category: string;
    measurement_unit: string;
    minimum_stock_level: number;
    current_stock_level: number;
    storage_location: string;
    supplier_id: Schema.Types.ObjectId;
    created_by: string;
}

const ProductSchema = new Schema<ProductDto>(
    {
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
        supplier_id: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
            required: false,
            index: true,
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
