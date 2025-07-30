'use client';

import { FaCheckCircle, FaKey } from 'react-icons/fa';
import Inputs from '@/components/Inputs';
import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import { changePassword } from '@/actions/change-password.actions';
import Loader from '@/components/Loader';

const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [state, formAction, isPending] = useActionState(changePassword, null);

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div>
            {showSuccess && (
                <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
                    <FaCheckCircle className="mr-2" />
                    Password updated successfully!
                </div>
            )}
            <form action={formAction} className="space-y-6">
                <div className="relative mb-6">
                    <Inputs
                        type={showPassword ? 'text' : 'password'}
                        label="Current Password"
                        name="currentPassword"
                        placeholder="Enter your current password"
                        error={state?.errors?.currentPassword?.[0]}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-7/10 py-1 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                    >
                        <Image
                            src={showPassword ? '/Visibility.svg' : '/VisibilityOff.svg'}
                            alt="Show Password"
                            width={20}
                            height={20}
                        />
                    </button>
                </div>

                <div className="relative mb-6">
                    <Inputs
                        type={showPassword ? 'text' : 'password'}
                        label="New Password"
                        name="newPassword"
                        placeholder="Enter your new password"
                        error={state?.errors?.newPassword?.[0]}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-7/10 py-1 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                    >
                        <Image
                            src={showPassword ? '/Visibility.svg' : '/VisibilityOff.svg'}
                            alt="Show Password"
                            width={20}
                            height={20}
                        />
                    </button>
                </div>

                <div className="relative mb-6">
                    <Inputs
                        type={showPassword ? 'text' : 'password'}
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        placeholder="Confirm your new password"
                        error={state?.errors?.confirmNewPassword?.[0]}
                    />
                    <button
                        disabled={isPending}
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-7/10 py-1 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                    >
                        <Image
                            src={showPassword ? '/Visibility.svg' : '/VisibilityOff.svg'}
                            alt="Show Password"
                            width={20}
                            height={20}
                        />
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                    {isPending ? <Loader /> : <FaKey />}
                    {isPending ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
