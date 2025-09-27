'use client';

import { JSX, useState } from 'react';
import {
    FaApple,
    FaDrumstickBite,
    FaEgg,
    FaPlus,
    FaWineGlass,
    FaWineGlassAlt,
    FaBoxOpen,
    FaSearch,
} from 'react-icons/fa';
import CreateNewProduct from './CreateNewProduct';
import Link from 'next/link';
import { ProductModel, supplierModel } from '@/types/index';
import { prettyCategory } from 'app/shared/utils/textUtils';

const categories = [
    { label: 'All Items', icon: null, id: 'all' },
    { label: 'Wine & Spirits', icon: '🍷', id: 'wine-spirits' },
    { label: 'Meat & Poultry', icon: '🍗', id: 'meat-poultry' },
    { label: 'Fresh Produce', icon: '🥦', id: 'fresh-produce' },
    { label: 'Dairy & Eggs', icon: '🥚', id: 'dairy-eggs' },
    { label: 'Pantry Items', icon: '🧂', id: 'pantry-items' },
];

type CategoryKey =
    | 'wine-spirits'
    | 'meat-poultry'
    | 'fresh-produce'
    | 'dairy-eggs'
    | 'pantry-items';

const categoryIcons: Record<CategoryKey, JSX.Element> = {
    'wine-spirits': <FaWineGlass size={12} className="inline mr-1 mb-1" />,
    'meat-poultry': <FaDrumstickBite size={12} className="inline mr-1 mb-1" />,
    'fresh-produce': <FaApple size={12} className="inline mr-1 mb-1" />,
    'dairy-eggs': <FaEgg size={12} className="inline mr-1 mb-1" />,
    'pantry-items': <FaWineGlassAlt size={12} className="inline mr-1 mb-1" />,
};

const getCategoryIcon = (cat: string) => categoryIcons[cat as CategoryKey] || null;

type Props = {
    suppliers: supplierModel[];
    products: ProductModel[];
};

export default function MainContent({ suppliers, products }: Props) {
    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.id,
        label: supplier.name,
    }));
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showAddProductForm, setShowAddProductForm] = useState(false);

    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter(prod => prod.category === selectedCategory);

    const handleCloseAddProductForm = () => {
        setShowAddProductForm(false);
    };

    const selectedCategoryLabel =
        categories.find(cat => cat.id === selectedCategory)?.label || 'All Items';

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8 px-8">
                <div className="flex justify-between items-start gap-2 mb-7">
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map(cat => (
                            <button
                                type="button"
                                key={cat.label}
                                className={`flex items-center cursor-pointer px-4 py-2 text-[15px] font-medium rounded-full border
                        ${
                            selectedCategory === cat.id
                                ? 'bg-blue-100 border-blue-500 text-blue-700 shadow'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                        }
                        transition`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.icon ? <span className="mr-2">{cat.icon}</span> : null}
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddProductForm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ml-4"
                    >
                        <FaPlus />
                        <span>Add New Product</span>
                    </button>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map(prod => (
                            <div
                                key={prod.sku}
                                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-200 p-5 cursor-pointer"
                            >
                                <div>
                                    <p className="text-blue-700 font-semibold text-lg hover:underline">
                                        {prod.name}
                                    </p>
                                </div>
                                <div className="text-xs text-gray-400 mb-3 mt-0.5 flex items-start">
                                    <span>SKU: {prod.sku}</span>
                                    <span className="mx-1">&bull;</span>
                                    {getCategoryIcon(prod.category)}
                                    <span>{prettyCategory(prod.category)}</span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-sm text-gray-500">Current Stock</span>
                                    <span className="font-semibold text-gray-900 ml-auto text-[16px]">
                                        {`${prod.currentStock ?? 0} ${prod.measurementUnit}`}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-5">
                                    <span>Created by</span>
                                    <span className="ml-[2px]">{prod.createdBy}</span>
                                </div>
                                <div className="self-end flex items-center justify-end">
                                    <Link
                                        href={`/dashboard/product-details/${prod.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View Details &gt;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-5 px-4">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            {selectedCategory === 'all' ? (
                                <FaBoxOpen className="w-8 h-8 text-gray-400" />
                            ) : (
                                <FaSearch className="w-8 h-8 text-gray-400" />
                            )}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {selectedCategory === 'all'
                                ? 'No products found'
                                : `No products in ${selectedCategoryLabel}`}
                        </h3>

                        <p className="text-gray-500 text-center mb-8 max-w-md">
                            {selectedCategory === 'all'
                                ? "You haven't added any products to your inventory yet. Get started by adding your first product."
                                : `There are no products in the ${selectedCategoryLabel.toLowerCase()} category. Try selecting a different category or add a new product.`}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => setShowAddProductForm(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                            >
                                <FaPlus />
                                Add Your First Product
                            </button>

                            {selectedCategory !== 'all' && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory('all')}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                                >
                                    View All Products
                                </button>
                            )}
                        </div>

                        {selectedCategory !== 'all' && products.length > 0 && (
                            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700 mb-2">
                                    <strong>Suggestion:</strong> You have products in other
                                    categories.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {categories
                                        .filter(
                                            cat => cat.id !== selectedCategory && cat.id !== 'all',
                                        )
                                        .filter(cat =>
                                            products.some(prod => prod.category === cat.id),
                                        )
                                        .slice(0, 3)
                                        .map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className="px-3 py-1 text-xs bg-white border border-blue-300 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                                            >
                                                {cat.icon} {cat.label}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showAddProductForm && (
                <CreateNewProduct
                    supplierOptions={supplierOptions}
                    onClose={handleCloseAddProductForm}
                />
            )}
        </>
    );
}
