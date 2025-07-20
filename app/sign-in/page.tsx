'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useActionState } from 'react';
import Inputs from '@/app/ui/components/Inputs/Inputs';
import { logIn } from '@/app/lib/actions/sign-in.actions';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(logIn, undefined);

    return (
        <div className="flex h-screen">
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

                <div className="relative z-10 text-center  justify-center items-center">
                    <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                        Welcome to FoodStock
                    </h2>
                    <p className="text-xl text-white mb-8 drop-shadow-lg">
                        Your complete restaurant inventory management solution
                    </p>
                </div>
            </div>
            <div className="w-full md:w-1/2 h-screen overflow-y-auto bg-white">
                <div className="max-w-xl mx-auto p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800">Sign In</h1>
                        <p className="text-gray-500 mt-2">Access your inventory dashboard</p>
                    </div>

                    <form action={formAction}>
                        <div className="mb-6">
                            <Inputs
                                type="email"
                                label="Email"
                                name="email"
                                placeholder="Enter your email or username"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <div className="relative">
                                <Inputs
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                    error={state?.message}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-7/10 py-1 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                >
                                    <Image
                                        src={
                                            showPassword ? '/Visibility.svg' : '/VisibilityOff.svg'
                                        }
                                        alt="Show Password"
                                        width={20}
                                        height={20}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end mb-6">
                            <a
                                href="#"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
                            >
                                Forgot Password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
                        >
                            {isPending ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            {`Don't have an account?`}{' '}
                            <Link
                                href="/register"
                                className="font-medium text-blue-600 hover:text-blue-700"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            &copy; {new Date().getFullYear()} FoodStock. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
