'use client';

import { deleteProduct } from '@/actions/product.actions';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';

const DeleteButton = ({ productId }: { productId: string }) => {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const result = await deleteProduct(productId);
            if (result?.success) {
                router.push('/dashboard/product-management');
            } else {
                //TODO Handle error (show toast.)
                //! alert(result?.errors?.general?.[0] || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="flex items-center cursor-pointer gap-1 justify-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-sm hover:bg-red-100"
        >
            <FaTrash />
            Delete
        </button>
    );
};

export default DeleteButton;
