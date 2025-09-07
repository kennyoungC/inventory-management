import React from 'react';

type Props = {
    id: string;
    label?: string;
    name: string;
    defaultValue: string;
    placeholder: string;
    className?: string;
};

const TextAreaInput = ({ id, label, name, defaultValue, className, placeholder }: Props) => {
    return (
        <div className="mt-5">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                name={name}
                rows={4}
                placeholder={placeholder}
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm ${className}`}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default TextAreaInput;
