import { Schema, model, models, Document } from 'mongoose';
import validator from 'validator';

export interface Staff extends Document {
    restaurant_id: Schema.Types.ObjectId;
    full_name: string;
    email: string;
    access_code?: number;
    job_title: string;
    role: 'admin' | 'staff';
    code_set: boolean;
    verification_token?: string;
    verification_expires?: Date;
}
const StaffSchema = new Schema<Staff>(
    {
        restaurant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            trim: true,
        },
        full_name: {
            type: String,
            required: [true, 'Please provide a name for this Restaurant.'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        job_title: {
            type: String,
            trim: true,
        },
        role: { type: String, enum: ['admin', 'staff'], required: true },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        code_set: {
            type: Boolean,
            default: false,
        },
        verification_token: { type: String, select: false },
        verification_expires: { type: Date, select: false },
        access_code: {
            type: Number,
            required: [true, 'Access code is required'],
            unique: true,
            sparse: true,
            validate: {
                validator: function (v: number) {
                    return /^\d{6}$/.test(v.toString());
                },
                message: 'Access code must be exactly 6 digits',
            },
        },
    },
    {
        timestamps: true,
    },
);

const Staff = models.Staff || model<Staff>('Staff', StaffSchema);
export default Staff;
