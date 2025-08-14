import { model, models, Schema, Document } from 'mongoose';
import validator from 'validator';

export interface SupplierDto extends Document {
    name: string;
    contact_person?: string;
    phone: string;
    email: string;
    minimum_order_quantity: number;
}

const SupplierSchema = new Schema<SupplierDto>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name for this supplier.'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
            trim: true,
        },
        contact_person: {
            type: String,
            required: false,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number for this supplier.'],
            trim: true,
            validate: {
                validator: function (v: string) {
                    const digitsOnly = (v || '').replace(/\D/g, '');
                    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
                },
                message: 'Please provide a valid phone number with 10-15 digits',
            },
        },
        email: {
            type: String,
            required: [true, 'Please provide an email address for this supplier.'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        minimum_order_quantity: {
            type: Number,
            required: [true, 'Please provide a minimum order quantity for this supplier.'],
            min: [1, 'Minimum order quantity must be at least 1'],
        },
    },
    {
        timestamps: true,
    },
);

// SupplierSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
//     const Product = (await import('./product')).default;
//     const count = await Product.countDocuments({ supplier: this._id });
//     if (count > 0) return next(new Error('Cannot delete supplier while products reference it'));
//     next();
// });

const Supplier = models.Supplier || model<SupplierDto>('Supplier', SupplierSchema);
export default Supplier;
