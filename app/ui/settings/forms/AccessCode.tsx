'use client';
import { updateAccessCode } from '@/app/lib/actions/session-starter.actions';
import { useRef, useState, useEffect, useActionState } from 'react';
import { FaSyncAlt, FaCheckCircle } from 'react-icons/fa';

const AccessCode = () => {
    const [accessCode, setAccessCode] = useState<string[]>(Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    // For feedback from server action
    const [state, formAction, isPending] = useActionState(updateAccessCode, null);

    // Success message auto-hide
    const [showSuccess, setShowSuccess] = useState(false);
    useEffect(() => {
        if (state?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    // Reset input on success
    useEffect(() => {
        if (state?.success) {
            setAccessCode(Array(6).fill(''));
        }
    }, [state?.success]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const digit = value.slice(-1);

        const newAccessCode = [...accessCode];
        newAccessCode[index] = digit;
        setAccessCode(newAccessCode);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (accessCode[index]) {
                const newAccessCode = [...accessCode];
                newAccessCode[index] = '';
                setAccessCode(newAccessCode);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    // Only allow update button if all digits entered
    const allDigitsEntered = accessCode.every(char => char);

    // Submit handler for the form
    function handleSubmit(formData: FormData) {
        formData.set('code', accessCode.join(''));
        return formAction(formData);
    }

    return (
        <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Quick Access Code</h3>
                <p className="text-sm text-gray-500 mt-1">6-digit code for Session Starter</p>
            </div>
            {showSuccess && (
                <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
                    <FaCheckCircle className="mr-2" />
                    {state?.message || 'Quick Access Code updated successfully!'}
                </div>
            )}
            <form
                action={handleSubmit}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100"
            >
                <div className="space-y-4">
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
                                className="w-12 h-12 text-center bg-white border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg font-semibold transition-all duration-200"
                                disabled={isPending}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {state?.error && (
                        <div className="text-center text-red-500 text-xs mb-3">{state.error}</div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={!allDigitsEntered || isPending}
                            className="update-code-btn px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSyncAlt />
                            {isPending ? 'Updating...' : 'Update Quick Access Code'}
                        </button>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                        Update your 6-digit code to start and end sessions quickly.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AccessCode;
