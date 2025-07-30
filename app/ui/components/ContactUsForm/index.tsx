'use client';

import React, { useActionState, useEffect, useState } from 'react';
import Inputs from '../Inputs';
import { handleContactForm } from '@/actions/contact.action';

const ContactUsForm = () => {
    const [state, formAction, isPending] = useActionState(handleContactForm, null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    return (
        <form
            action={formAction}
            noValidate
            className="space-y-6 bg-white rounded-lg p-8 shadow-xl"
        >
            {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{state?.message}</div>
            )}
            {state?.errors?.general && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                    {state.errors.general[0]}
                </div>
            )}
            <Inputs
                label="Name"
                type="text"
                name="name"
                id="name"
                required
                placeholder="Enter your name"
                defaultValue={state?.values?.name ?? ''}
                error={state?.errors?.name?.[0]}
            />
            <Inputs
                label="Email"
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter your email"
                defaultValue={state?.values?.email ?? ''}
                error={state?.errors?.email?.[0]}
            />

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    maxLength={500}
                    defaultValue={state?.values?.message ?? ''}
                    className={`mt-1 block w-full px-4 py-3 border ${
                        state?.errors?.message
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-md shadow-sm`}
                    placeholder="Tell us about your business needs..."
                    aria-invalid={!!state?.errors?.message}
                    aria-describedby={state?.errors?.message && 'contact-message-error'}
                ></textarea>
                {state?.errors?.message && (
                    <p id="contact-message-error" className="mt-1 text-xs text-red-600">
                        {state.errors.message[0]}
                    </p>
                )}
                <p className="mt-2 text-sm text-gray-500">Maximum 500 characters</p>
            </div>
            <div>
                <button
                    disabled={isPending}
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !rounded-button whitespace-nowrap"
                >
                    {isPending ? 'Sending...' : 'Send Message'}
                </button>
            </div>
        </form>
    );
};

export default ContactUsForm;
