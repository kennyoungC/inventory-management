import { FaSearch } from 'react-icons/fa';

const productWithSupplier = {
    name: 'Cabernet Sauvignon',
    sku: 'WN-CS-001',
    category: 'Wine & Spirits',
    stockInfo: {
        currentStock: '24 bottles',
        status: 'In Stock',
        minStockLevel: '10 bottles',
        storageLocation: 'Dry Storage (20-22°C)',
        expirationPeriod: '5-10 years',
    },
    supplierInfo: {
        name: 'Premium Wines Co.',
        contactPerson: 'Robert Smith',
        phone: '+1 (555) 123-4567',
        email: 'supplier@example.com',
        minOrder: '12 bottles',
    },
    stockHistory: [
        {
            type: 'used',
            quantity: 15,
            user: 'Mike Johnson',
            date: 'May 3, 10:30 AM',
            batchId: '#WN1234',
            transactionId: 'TRX-15789',
            notes: 'Used for dinner service preparation. Quality check performed before usage. Temperature maintained at optimal level.',
        },
        {
            type: 'added',
            quantity: 20,
            user: 'Sarah Chen',
            date: 'May 2, 2:15 PM',
            batchId: '#WN1234',
            transactionId: 'TRX-15788',
            notes: 'Regular stock replenishment. Temperature checked and recorded at 4°C. Quality inspection passed.',
        },
        {
            type: 'used',
            quantity: 10,
            user: 'Emma Wilson',
            date: 'May 1, 3:45 PM',
            batchId: '#WN1234',
            transactionId: 'TRX-15787',
            notes: 'Used for special event catering.',
        },
        {
            type: 'added',
            quantity: 30,
            user: 'Sarah Chen',
            date: 'April 28, 9:00 AM',
            batchId: '#WN1233',
            transactionId: 'TRX-15786',
            notes: 'Initial stock received from supplier.',
        },
    ],
};

const StockHistory = () => {
    return (
        <aside className="lg:col-span-2 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden max-h-[60vh]">
            {/* Sticky Header for Stock History */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Stock History</h2>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaSearch className="text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by Batch ID"
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {productWithSupplier.stockHistory.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'added' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                        >
                            {item.type === 'added' ? '+' : '−'}
                        </div>
                        <div className="flex-1 text-sm">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-gray-800">
                                    {item.type === 'added' ? 'Added' : 'Used'} {item.quantity} units
                                </p>
                                <p className="text-xs text-gray-400">{item.date}</p>
                            </div>
                            <p className="text-xs text-gray-500">by {item.user}</p>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Batch ID: {item.batchId}</span>
                                <span>Transaction ID: {item.transactionId}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded-md">
                                {item.notes}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default StockHistory;
