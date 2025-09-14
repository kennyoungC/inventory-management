import StockHistory from './StockHistory';
import NoSupplierInfo from './NoSupplierInfo';
import ProductHeaderDetails from './ProductHeaderDetails';
import StockInformation from './StockInformation';
import SupplierInformation from './SupplierInformation';
import { getAllSuppliers } from '@/data/supplier';
import { getProductWithSupplier } from '@/data/product';
import { getAllStockHistory } from '@/data/stock-history';

const MainContent = async ({ productId }: { productId: string }) => {
    const [productWithSupplier, suppliers, stockHistory] = await Promise.all([
        getProductWithSupplier(productId),
        getAllSuppliers(),
        getAllStockHistory(productId),
    ]);

    if (!productWithSupplier) {
        return <div>Product not found</div>;
    }

    return (
        <main className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <ProductHeaderDetails suppliers={suppliers} product={productWithSupplier} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <StockInformation product={productWithSupplier} />
                    {productWithSupplier.supplier ? (
                        <SupplierInformation supplier={productWithSupplier.supplier} />
                    ) : (
                        <NoSupplierInfo />
                    )}
                </div>

                <StockHistory stockHistory={stockHistory} />
            </div>
        </main>
    );
};
export default MainContent;
