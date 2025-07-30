'use client';
import React, { useActionState, useEffect, useState } from 'react';
import Inputs from '@/components/Inputs';
import { FaCheckCircle, FaSave } from 'react-icons/fa';
import { RestaurantModel } from '@/types/index';
import { updateRestaurantProfile } from '@/actions/restaurant.action';
import Loader from '@/components/Loader';

type Props = {
    restaurant: RestaurantModel;
};

const RestaurantProfile = ({ restaurant }: Props) => {
    const [showSuccess, setShowSuccess] = useState(false);

    const [form, setForm] = useState({
        restaurantName: restaurant.restaurantName || '',
        email: restaurant.email || '',
        phoneNumber: restaurant.phoneNumber || '',
        address: restaurant.address || '',
        emailUpdates: !!restaurant.emailUpdates,
    });
    const [state, formAction, isPending] = useActionState(updateRestaurantProfile, null);

    useEffect(() => {
        setForm({
            restaurantName: restaurant.restaurantName || '',
            email: restaurant.email || '',
            phoneNumber: restaurant.phoneNumber || '',
            address: restaurant.address || '',
            emailUpdates: !!restaurant.emailUpdates,
        });
    }, [restaurant]);

    useEffect(() => {
        if (state?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    return (
        <>
            {showSuccess && (
                <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
                    <FaCheckCircle className="mr-2" />
                    Profile updated successfully!
                </div>
            )}
            <form action={formAction} className="space-y-6">
                <div className="space-y-6">
                    <Inputs
                        label="Restaurant Name"
                        name="restaurantName"
                        placeholder="Enter your restaurant name"
                        value={form.restaurantName}
                        onChange={handleChange}
                        error={state?.errors?.restaurantName?.[0] || ''}
                    />
                    <Inputs
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={handleChange}
                        error={state?.errors?.email?.[0] || ''}
                    />
                    <Inputs
                        label="Phone Number"
                        type="number"
                        name="phoneNumber"
                        placeholder="Enter your phone number"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        error={state?.errors?.phoneNumber?.[0] || ''}
                    />
                    <Inputs
                        label="Address"
                        name="address"
                        placeholder="Enter your address"
                        value={form.address}
                        onChange={handleChange}
                        error={state?.errors?.address?.[0] || ''}
                    />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <h3 className="font-medium text-gray-800">Email Updates</h3>
                        <p className="text-sm text-gray-500">
                            Receive updates about your account via email
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={form.emailUpdates}
                            name="emailUpdates"
                            onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                    {isPending ? <Loader /> : <FaSave />}
                    {isPending ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </>
    );
};

export default RestaurantProfile;
