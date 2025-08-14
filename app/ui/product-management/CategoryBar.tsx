'use client';

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const categories = [
    { label: 'All Items', icon: null },
    { label: 'Wine & Spirits', icon: '🍷' },
    { label: 'Meat & Poultry', icon: '🍗' },
    { label: 'Fresh Produce', icon: '🥦' },
    { label: 'Dairy & Eggs', icon: '🥚' },
    { label: 'Pantry Items', icon: '🧂' },
];

const CategoryBar = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Items');
    return (
        <div className="flex justify-between items-start gap-2 mb-7">
            <div className="flex flex-wrap items-center gap-2">
                {categories.map(cat => (
                    <button
                        type="button"
                        key={cat.label}
                        className={`flex items-center cursor-pointer px-4 py-2 text-[15px] font-medium rounded-full border
                            ${
                                selectedCategory === cat.label
                                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                            }
                            transition`}
                        onClick={() => setSelectedCategory(cat.label)}
                    >
                        {cat.icon ? <span className="mr-2">{cat.icon}</span> : null}
                        {cat.label}
                    </button>
                ))}
            </div>

            <button
                type="button"
                // onClick={() => setShowAddProductForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ml-4"
            >
                <FaPlus />
                <span> Add New Product</span>
            </button>
        </div>
    );
};

export default CategoryBar;
