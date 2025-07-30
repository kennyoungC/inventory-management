'use client';

import validateSession, { requestNewStaffCode } from '@/actions/session-starter.actions';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { useActionState } from 'react';

export default function SessionStarter() {
    const router = useRouter();
    const [accessCode, setAccessCode] = useState<string[]>(Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [state, formAction, isPending] = useActionState(validateSession, null);

    // New code request states
    const [showRequest, setShowRequest] = useState(false);
    const [requestEmail, setRequestEmail] = useState('');
    const [requestMessage, setRequestMessage] = useState('');
    const [requestError, setRequestError] = useState('');
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        if (state?.success) {
            router.push('/dashboard');
        }
    }, [state?.success, router]);

    // Handle request new code form
    async function handleRequestNewCode(e: FormEvent) {
        e.preventDefault();
        setRequestMessage('');
        setRequestError('');
        setIsRequesting(true);

        const formData = new FormData();
        formData.append('email', requestEmail);

        const res = await requestNewStaffCode(null, formData);
        setIsRequesting(false);

        if (res?.error) setRequestError(res.error);
        else {
            setRequestMessage(res.message || 'A new code has been sent.');
            setRequestEmail('');
            setAccessCode(Array(6).fill(''));
        }
    }

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        // Take only the last character if multiple characters are somehow entered
        const digit = value.slice(-1);

        const newAccessCode = [...accessCode];
        newAccessCode[index] = digit;
        setAccessCode(newAccessCode);

        // Auto-focus next input if a digit was entered
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newAccessCode.every(char => char !== '')) {
            setShowRequest(false);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (accessCode[index]) {
                // If current input has a value, clear it
                const newAccessCode = [...accessCode];
                newAccessCode[index] = '';
                setAccessCode(newAccessCode);
            } else if (index > 0) {
                // If current input is empty, go to previous input
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-6 px-6">
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-white">FoodStock</h1>
                    </div>
                    <p className="text-blue-100 text-center mt-1.5 text-xs">
                        Restaurant Management System
                    </p>
                </div>
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-1.5">Quick Access</h2>
                        <p className="text-gray-600 text-sm">
                            Enter your 6-digit access code to start your session
                        </p>
                    </div>
                    <form action={formAction}>
                        <div className="mb-6">
                            <div className="flex justify-center gap-2 mb-5">
                                {accessCode.map((char, index) => (
                                    <input
                                        key={index}
                                        ref={el => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        maxLength={1}
                                        value={char}
                                        onChange={e => handleChange(index, e)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                        className="w-10 h-12 text-center text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none"
                                    />
                                ))}
                            </div>
                            {/* Hidden input to store the complete code */}
                            <input type="hidden" name="code" value={accessCode.join('')} />

                            {state?.error && (
                                <div className="text-center text-red-500 text-xs mb-3">
                                    {state.error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={accessCode.some(char => char === '') || isPending}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                            >
                                {isPending ? 'Verifying...' : 'Start Session'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        {!showRequest && state?.error && state.type === 'expired' && (
                            <a
                                href="#"
                                className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                                onClick={e => {
                                    e.preventDefault();
                                    setShowRequest(true);
                                }}
                            >
                                Request a new code
                            </a>
                        )}

                        {showRequest && (
                            <form onSubmit={handleRequestNewCode} className="mt-2">
                                <input
                                    type="email"
                                    placeholder="Your staff email"
                                    value={requestEmail}
                                    onChange={e => setRequestEmail(e.target.value)}
                                    required
                                    className="w-full mb-2 px-3 py-2 border rounded"
                                />
                                <button
                                    type="submit"
                                    disabled={isRequesting}
                                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {isRequesting ? 'Sending...' : 'Send Code'}
                                </button>
                                {requestMessage && (
                                    <div className="text-green-600 text-xs mt-2">
                                        {requestMessage}
                                    </div>
                                )}
                                {requestError && (
                                    <div className="text-red-600 text-xs mt-2">{requestError}</div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowRequest(false)}
                                    className="block text-xs text-gray-500 mt-2 underline"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <span className="text-sm">Secure access for restaurant staff only</span>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                    &copy; {new Date().getFullYear()} FoodStock. All rights reserved.
                </p>
            </div>
        </div>
    );
}
