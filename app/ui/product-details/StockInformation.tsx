import InfoRow from '@/components/InfoRow';
import React from 'react';

const StockInformation = ({ product }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                Stock Information
            </h2>
            <div className="mt-4">
                <InfoRow
                    label="Current Stock"
                    value={product.stockInfo.currentStock}
                    valueClassName="text-lg !font-bold !text-gray-900"
                />
                <InfoRow label="Category" value={product.category} />
                <InfoRow
                    label="Status"
                    valueClassName="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold"
                    value={product.stockInfo.status}
                />
                <InfoRow label="Minimum Stock Level" value={product.stockInfo.minStockLevel} />
                <InfoRow label="Storage Location" value={product.stockInfo.storageLocation} />
                <InfoRow label="Expiration Period" value={product.stockInfo.expirationPeriod} />
            </div>
        </div>
    );
};

export default StockInformation;
