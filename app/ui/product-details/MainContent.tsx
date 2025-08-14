'use client';

import { FaEdit, FaSearch, FaTrash, FaWineGlass } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

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

const productWithoutSupplier = {
    ...productWithSupplier,
    supplierInfo: null, // Set to null to show the empty state
};

const InfoRow = ({ label, value, valueClassName = '' }) => (
    <div className="flex justify-between items-center py-1.5">
        <span className="text-sm text-gray-500">{label}</span>
        <span className={`text-sm text-gray-800 font-medium text-right ${valueClassName}`}>
            {value}
        </span>
    </div>
);

const NoSupplierInfo = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <FaTrash className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-gray-900">No Supplier Information</h3>
        <p className="mt-1 text-sm text-gray-500">
            This product is managed internally or supplier details have not been added.
        </p>
    </div>
);

export default function ProductDetailView({ product }) {
    const router = useRouter();
    if (!product) return <div>Loading...</div>;

    return (
        <main className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 bg-gray-200 cursor-pointer p-2 rounded hover:text-gray-900"
                    >
                        <FaArrowLeftLong />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>SKU: {product.sku}</span>
                            <span className="text-gray-300">&bull;</span>
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                <FaWineGlass size={12} className="inline mr-1 mb-1" />
                                {product.category}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex gap-1 items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-sm shadow-sm hover:bg-blue-700">
                        <FaEdit />
                        Edit Item
                    </button>
                    <button className="flex items-center gap-1 justify-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-sm hover:bg-red-100">
                        <FaTrash />
                        Delete
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Stock Information Card */}
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
                                value={
                                    <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                        {product.stockInfo.status}
                                    </span>
                                }
                            />
                            <InfoRow
                                label="Minimum Stock Level"
                                value={product.stockInfo.minStockLevel}
                            />
                            <InfoRow
                                label="Storage Location"
                                value={product.stockInfo.storageLocation}
                            />
                            <InfoRow
                                label="Expiration Period"
                                value={product.stockInfo.expirationPeriod}
                            />
                        </div>
                    </div>

                    {/* Supplier Information Card (Conditional) */}
                    {product.supplierInfo ? (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                                Supplier Information
                            </h2>
                            <div className="mt-4">
                                <InfoRow label="Supplier Name" value={product.supplierInfo.name} />
                                <InfoRow
                                    label="Contact Person"
                                    value={product.supplierInfo.contactPerson}
                                />
                                <InfoRow label="Phone" value={product.supplierInfo.phone} />
                                <InfoRow label="Email" value={product.supplierInfo.email} />
                                <InfoRow
                                    label="Minimum Order"
                                    value={product.supplierInfo.minOrder}
                                />
                            </div>
                        </div>
                    ) : (
                        <NoSupplierInfo />
                    )}
                </div>

                {/* Right Column (Stock History) */}
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
                        {product.stockHistory.map((item, index) => (
                            <div key={index} className="flex gap-3">
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'added' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                >
                                    {item.type === 'added' ? '+' : '−'}
                                </div>
                                <div className="flex-1 text-sm">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold text-gray-800">
                                            {item.type === 'added' ? 'Added' : 'Used'}{' '}
                                            {item.quantity} units
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
            </div>
        </main>
    );
}

// Example usage to render the component with data
// You can switch between productWithSupplier and productWithoutSupplier to test both states
export function MainContent() {
    return <ProductDetailView product={productWithSupplier} />;
}
