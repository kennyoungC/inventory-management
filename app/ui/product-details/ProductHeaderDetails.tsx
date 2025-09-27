'use client';

import { ProductWithSupplierModel, supplierModel } from '@/types/index';
import { capitalizeFirstLetter, prettyCategory } from 'app/shared/utils/textUtils';
import { FaEdit, FaWineGlass } from 'react-icons/fa';
import DeleteButton from './DeleteButton';
import { useState } from 'react';
import EditProduct from './EditProduct';
import GoBack from '@/components/Buttons/GoBack';

type Props = {
    product: ProductWithSupplierModel;
    suppliers: supplierModel[];
    isAdmin: boolean;
};

const ProductHeaderDetails = ({ product, suppliers, isAdmin }: Props) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <GoBack />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {capitalizeFirstLetter(product.name)}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>SKU: {product.sku}</span>
                            <span className="text-gray-300">&bull;</span>
                            <FaWineGlass size={16} className="inline mr-1 mb-1" />
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                {prettyCategory(product.category)}
                            </span>
                        </div>
                    </div>
                </div>
                {isAdmin && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex gap-1 items-center cursor-pointer justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-sm shadow-sm hover:bg-blue-700"
                        >
                            <FaEdit />
                            Edit Item
                        </button>
                        <DeleteButton productId={product.id} />
                    </div>
                )}
            </header>
            {isEditModalOpen && (
                <EditProduct
                    suppliers={suppliers}
                    onClose={() => setIsEditModalOpen(false)}
                    product={product}
                />
            )}
        </>
    );
};

export default ProductHeaderDetails;
