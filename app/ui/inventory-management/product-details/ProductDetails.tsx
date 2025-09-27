import GoBack from '@/components/Buttons/GoBack';
import { capitalizeFirstLetter, prettyCategory } from 'app/shared/utils/textUtils';
import HeaderBar from 'app/shared/components/HeaderBar';

import { FaWineGlass } from 'react-icons/fa';
import StockInformation from './StockInformation';
import StockHistory from './StockHistory';
import StockManagement from './StockManagement';
import { getStockHistoryCardData } from '@/data/stock-history';
import { getProductWithSupplier } from '@/data/product';
import EmptyState from 'app/ui/notifcations/EmptyState';

type Props = {
    productId: string;
};

const ProductDetails = async ({ productId }: Props) => {
    const productWithSupplier = await getProductWithSupplier(productId);

    const { additions, removals } = await getStockHistoryCardData(productId);

    if (!productWithSupplier) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <HeaderBar title="Inventory Management System" />

            <main className="bg-gray-50 p-4 sm:p-6 lg:p-8">
                <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <GoBack />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {capitalizeFirstLetter(productWithSupplier.name)}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span>SKU: {productWithSupplier.sku}</span>
                                <span className="text-gray-300">&bull;</span>
                                <FaWineGlass size={16} className="inline mr-1 mb-1" />
                                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {prettyCategory(productWithSupplier.category)}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <StockInformation
                            currentStock={`${productWithSupplier.currentStock} ${productWithSupplier.measurementUnit}s`}
                            storageType={productWithSupplier.storageLocation}
                            supplier={
                                productWithSupplier.supplier?.contactPerson || 'Internal Stock'
                            }
                            recommendedTemp="2°C - 8°C"
                            specialHandling={productWithSupplier.additionalNotes || 'N/A'}
                        />

                        {additions.length > 0 ? (
                            <StockHistory additions={additions} usage={removals} />
                        ) : (
                            <EmptyState
                                title="No stock history"
                                description="No stock additions or removals have been recorded for this product."
                            />
                        )}
                    </div>

                    <StockManagement
                        measurementUnit={productWithSupplier.measurementUnit}
                        productId={productWithSupplier.id}
                        currentStock={productWithSupplier.currentStock}
                    />
                </div>
            </main>
        </div>
    );
};

export default ProductDetails;
