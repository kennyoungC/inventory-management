import { model, models, Schema, Document } from 'mongoose';
import validator from 'validator';

export interface SupplierDto extends Document {
    _id: Schema.Types.ObjectId;
    supplier_name: string;
    supplier_contact_person?: string;
    supplier_phone_number: string;
    supplier_email: string;
    restaurant_id: Schema.Types.ObjectId;
}

const SupplierSchema = new Schema<SupplierDto>(
    {
        supplier_name: {
            type: String,
            required: [true, 'Please provide a name for this supplier.'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
            trim: true,
        },
        supplier_contact_person: {
            type: String,
            required: false,
            trim: true,
        },
        supplier_phone_number: {
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
        supplier_email: {
            type: String,
            required: [true, 'Please provide an email address for this supplier.'],
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        restaurant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

SupplierSchema.index({ restaurant_id: 1, supplier_email: 1 }, { unique: true });
SupplierSchema.index({ restaurant_id: 1, supplier_name: 1 }, { unique: true });

const Supplier = models.Supplier || model<SupplierDto>('Supplier', SupplierSchema);
export default Supplier;
