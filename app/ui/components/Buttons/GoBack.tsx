'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeftLong } from 'react-icons/fa6';

const GoBack = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className="text-gray-600 bg-gray-200 cursor-pointer p-2 rounded hover:text-gray-900"
        >
            <FaArrowLeftLong />
        </button>
    );
};

export default GoBack;
