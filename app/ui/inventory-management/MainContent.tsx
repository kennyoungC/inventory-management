import { getAllProductsWithSuppliers } from '@/data/product';
import ProductCard from './ProductCard';
import { FaBoxOpen } from 'react-icons/fa';
import Link from 'next/link';

const MainContent = async () => {
    const products = await getAllProductsWithSuppliers();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-8">
            {products.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md w-full">
                        <div className="flex justify-center mb-4">
                            <FaBoxOpen className="w-16 h-16 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No Products Found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Get started by adding your first product to manage inventory and track
                            expiry dates.
                        </p>
                        <Link
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            href="/dashboard/product-management"
                        >
                            Add First Product
                        </Link>
                    </div>
                </div>
            ) : (
                <div
                    className="grid gap-6"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                    }}
                >
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MainContent;
