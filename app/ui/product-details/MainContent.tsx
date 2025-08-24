import StockHistory from './StockHistory';
import NoSupplierInfo from './NoSupplierInfo';
import ProductHeaderDetails from './ProductHeaderDetails';
import StockInformation from './StockInformation';
import SupplierInformation from './SupplierInformation';
import { getProductWithSupplier } from 'app/lib/data';

const productWithSuppliers = {
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

const MainContent = async ({ productId }: { productId: string }) => {
    const productWithSupplier = await getProductWithSupplier(productId);

    if (!productWithSupplier) {
        return <div>Product not found</div>;
    }

    return (
        <main className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <ProductHeaderDetails product={productWithSupplier} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Stock Information Card */}
                    <StockInformation product={productWithSuppliers} />

                    {productWithSupplier.supplier ? (
                        <SupplierInformation supplier={productWithSupplier.supplier} />
                    ) : (
                        <NoSupplierInfo />
                    )}
                </div>

                {/* Right Column (Stock History) */}
                <StockHistory />
            </div>
        </main>
    );
};
export default MainContent;
