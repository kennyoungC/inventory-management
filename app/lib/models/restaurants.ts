import { Schema, model, models, Document } from 'mongoose';
import validator from 'validator';

export interface RestaurantDto extends Document {
    _id: Schema.Types.ObjectId;
    restaurant_name: string;
    email: string;
    address: string;
    phone_number: number;
    access_code: number;
    password: string;
    role: 'admin' | 'staff';
    email_updates?: boolean;
}

const RestaurantSchema = new Schema<RestaurantDto>(
    {
        restaurant_name: {
            type: String,
            required: [true, 'Please provide a name for this Restaurant.'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        phone_number: {
            type: Number,
            required: [true, 'Please provide a phone number'],
            validate: {
                validator: function (v: number) {
                    return /^\d{10,15}$/.test(v.toString());
                },
                message: 'Please provide a valid phone number (10-15 digits)',
            },
        },
        access_code: {
            type: Number,
            required: [true, 'Access code is required'],
            validate: {
                validator: function (v: number) {
                    return /^\d{6}$/.test(v.toString());
                },
                message: 'Access code must be exactly 6 digits',
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            validate: {
                validator: function (v: string) {
                    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(v);
                },
                message:
                    'Password must contain at least one uppercase, one lowercase, one number, and one special character',
            },
            select: false,
        },
        address: {
            type: String,
            required: [true, 'Please provide an address for this Restaurant.'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['admin', 'staff'],
            required: true,
            default: 'admin',
        },
        email_updates: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const Restaurant = models.Restaurant || model<RestaurantDto>('Restaurant', RestaurantSchema);
export default Restaurant;
