type StockInfoProps = {
    currentStock: string;
    storageType: string;
    supplier: string;
    recommendedTemp: string;
    specialHandling: string;
};

const StockInformation = ({
    currentStock,
    storageType,
    supplier,
    recommendedTemp,
    specialHandling,
}: StockInfoProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                    <p className="text-sm text-gray-500">Current Stock</p>
                    <p className="font-semibold text-gray-900">{currentStock}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Storage Type</p>
                    <p className="font-semibold text-gray-900">{storageType}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-semibold text-gray-900">{supplier}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Recommended Storage Temperature</p>
                    <p className="font-semibold text-gray-900">{recommendedTemp}</p>
                </div>
            </div>

            {/* Special Handling */}
            <div className="mt-6">
                <p className="text-sm text-gray-500">Special Handling</p>
                <p className="font-semibold text-gray-900">{specialHandling}</p>
            </div>
        </div>
    );
};

export default StockInformation;
