import InfoRow from '@/components/InfoRow';
import { ProductWithSupplierModel } from '@/types/index';
import React from 'react';

type Props = {
    product: ProductWithSupplierModel;
};

const StockInformation = ({ product }: Props) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                Stock Information
            </h2>
            <div className="mt-4">
                <InfoRow
                    label="Current Stock"
                    value={product.currentStock}
                    valueClassName="text-lg !font-bold !text-gray-900"
                />
                <InfoRow label="Category" value={product.category} />
                <InfoRow
                    label="Status"
                    valueClassName={`${product.currentStock > product.minimumStockLevel ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'} px-2.5 py-0.5 rounded-full text-xs font-bold`}
                    value={
                        product.currentStock > product.minimumStockLevel ? 'In Stock' : 'Low Stock'
                    }
                />
                <InfoRow
                    label="Minimum Stock Level"
                    value={`${product.minimumStockLevel} ${product.measurementUnit}s`}
                />
                <InfoRow label="Storage Location" value={product.storageLocation} />
            </div>
        </div>
    );
};

export default StockInformation;
