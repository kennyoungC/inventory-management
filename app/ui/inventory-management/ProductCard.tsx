import { ProductWithSupplierModel } from '@/types/index';
import Link from 'next/link';
import { FaBox, FaTruck, FaClock, FaUser } from 'react-icons/fa';
import { FaBoxArchive } from 'react-icons/fa6';

type ProductCardProps = {
    product: ProductWithSupplierModel;
};

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="rounded-xl shadow-sm border border-gray-200 bg-white hover:scale-105 ease-in transition-transform">
            <div className="p-5 space-y-3">
                <Link href={`/dashboard/inventory-management/product-details/${product.id}`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        {product.currentStock < product.minimumStockLevel && (
                            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                Low Stock
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>

                    <div className="flex items-center gap-2 text-gray-700">
                        <FaBox className="w-4 h-4" />
                        <span className="text-sm">Current Stock: {product.currentStock}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaBoxArchive className="w-4 h-4" />
                        <span className="text-sm">
                            Minimum Stock Level: {product.minimumStockLevel}{' '}
                            {product.measurementUnit}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <FaTruck className="w-4 h-4" />
                        <span className="text-sm">
                            Supplier: {product.supplier?.name ?? 'Internal Stock'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <FaClock className="w-4 h-4" />
                        <span className="text-sm">
                            Last updated: {product.updatedAt?.toLocaleDateString() ?? 'N/A'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <FaUser className="w-4 h-4" />
                        <span className="text-sm">
                            By:
                            {product.createdBy || <span className="italic text-gray-400">—</span>}
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
