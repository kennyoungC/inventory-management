import { InputsProps } from '@/types/index';

export default function Inputs({
    label,
    name,
    placeholder,
    error,
    type,
    defaultValue,
    required,
    formGroupClass,
    ...rest
}: InputsProps) {
    const inputId = `${name}-input`;

    return (
        <div className={`${formGroupClass} `}>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <input
                id={inputId}
                type={type}
                name={name}
                defaultValue={defaultValue}
                className="mt-1 block w-full [appearance:textfield] rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder={placeholder}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
                {...rest}
            />
            {error && (
                <p id={`${inputId}-error`} className="mt-1 ml-2 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
