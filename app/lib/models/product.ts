import { Schema, model, models, Document } from 'mongoose';

export interface Product extends Document {
    name: string;
    sku: string;
    stock: number;
    lastUpdated: number;
    // poddy_trained: boolean;
    // diet: string[];
    // image_url: string;
    // likes: string[];
    // dislikes: string[];
}

const ProdutSchema = new Schema<Product>(
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
        stock: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Product = models.Product || model('Product', ProdutSchema);
export default Product;
