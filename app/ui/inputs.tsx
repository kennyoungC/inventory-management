import { InputsProps } from '../lib/types';

export default function Inputs({
    label,
    name,
    placeholder,
    error,
    type,
    defaultValue,
}: InputsProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
                <input
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    className="mt-1 block w-full [appearance:textfield] rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder={placeholder}
                />{' '}
            </label>
            {error && error.length > 0 && <p className="mt-1 ml-2 text-xs text-red-600">{error}</p>}
        </div>
    );
}
