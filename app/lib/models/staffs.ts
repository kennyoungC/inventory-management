import { Schema, model, models, Document } from 'mongoose';
import validator from 'validator';

export interface Staff extends Document {
    restaurant_id: Schema.Types.ObjectId;
    full_name: string;
    email: string;
    access_code?: number;
    job_title: string;
    code_expires_at: Date;
    is_active: boolean;
    last_login_at?: Date;
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
        is_active: { type: Boolean, default: false },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        code_expires_at: { type: Date, required: true },
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
        last_login_at: { type: Date, default: null },
    },
    {
        timestamps: true,
    },
);

const Staff = models.Staff || model<Staff>('Staff', StaffSchema);
export default Staff;
