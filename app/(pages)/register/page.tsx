'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useActionState, useEffect } from 'react';
import Inputs from '@/components/Inputs';
import { createRestaurant } from '@/actions/restaurant.action';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createRestaurant, null);

    useEffect(() => {
        if (state?.success && state?.values?.email) {
            router.push(`/sign-in?email=${encodeURIComponent(state.values.email)}`);
        }
    }, [state, router]);

    return (
        <div className="flex h-screen">
            {/* Left Section (Branding) - Hidden on mobile */}
            <div className="hidden md:flex w-1/2 relative">
                <div className="absolute inset-0">
                    <Image
                        src="/SignIn-Image.jpg"
                        width={1000}
                        height={1000}
                        alt="Kitchen Inventory System"
                        className="w-full h-full object-cover brightness-75"
                        priority
                    />
                </div>
                <div className="relative z-10 text-center px-8 pt-20">
                    <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                        Welcome to FoodStock
                    </h2>
                    <p className="text-xl text-white mb-8 drop-shadow-lg">
                        Your complete restaurant inventory management solution
                    </p>
                </div>
            </div>
            {/* Right Section (Register Form) */}
            <div className="w-full md:w-1/2 h-screen overflow-y-auto bg-white">
                <div className="max-w-xl mx-auto p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Create Your Account
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Complete the form below to get started with FoodStock
                        </p>
                    </div>
                    <form action={formAction} className="space-y-6">
                        <Inputs
                            label="Restaurant Name"
                            name="restaurantName"
                            placeholder="Enter your restaurant name"
                            error={state?.errors?.restaurantName?.[0]}
                            defaultValue={state?.values?.restaurantName}
                        />

                        <Inputs
                            type="email"
                            label="Email Address"
                            name="email"
                            placeholder="Enter your email address"
                            error={state?.errors?.email?.[0]}
                            defaultValue={state?.values?.email}
                        />
                        <Inputs
                            type="number"
                            label="Phone Number"
                            name="phoneNumber"
                            placeholder="Enter your phone number"
                            error={state?.errors?.phoneNumber?.[0]}
                            defaultValue={state?.values?.phoneNumber}
                        />
                        <Inputs
                            label="Address"
                            name="address"
                            placeholder="Enter your restaurant address"
                            error={state?.errors?.address?.[0]}
                            defaultValue={state?.values?.address}
                        />
                        <div>
                            <Inputs
                                type="number"
                                label="Quick Access Code"
                                name="accessCode"
                                maxLength={6}
                                placeholder="Enter your quick access code"
                                error={state?.errors?.accessCode?.[0]}
                                defaultValue={state?.values?.accessCode}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Set a 6-digit code for quick access to your restaurant management
                                system
                            </p>
                        </div>
                        <div className="relative mb-4">
                            <Inputs
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                name="password"
                                placeholder="Enter your password"
                                error={state?.errors?.password?.[0]}
                                defaultValue={state?.values?.password}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-7/10 py-1 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                            >
                                <Image
                                    src={showPassword ? '/Visibility.svg' : '/VisibilityOff.svg'}
                                    alt="Show Password"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </div>
                        {/* Confirm Password */}
                        <div className="relative mb-6">
                            <Inputs
                                type={showPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                name="confirmPassword"
                                placeholder="Enter your password"
                                error={state?.errors?.confirmPassword?.[0]}
                                defaultValue={state?.values?.confirmPassword}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-7/10 py-1 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                            >
                                <Image
                                    src={showPassword ? '/Visibility.svg' : '/VisibilityOff.svg'}
                                    alt="Show Password"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </div>
                        {/* Terms and Conditions */}
                        <div className="mb-6">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-600">
                                        I agree to the{' '}
                                        <Link href="#" className="text-blue-600 hover:underline">
                                            Terms of Service
                                        </Link>{' '}
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <i className="fa fa-circle-notch fa-spin mr-2"></i>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/sign-in"
                                className="font-medium text-blue-600 hover:text-blue-700"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
