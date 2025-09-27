'use client';

import { StockEntry } from '@/types/index';
import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const StockHistory = ({ stockHistory }: { stockHistory: StockEntry[] }) => {
    const [filter, setFilter] = useState<'all' | 'addition' | 'removal'>('all');

    const filteredHistory = stockHistory.filter(item => {
        if (filter === 'all') return true;
        return item.entryType === filter;
    });

    return (
        <aside className="lg:col-span-2 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden max-h-[60vh]">
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Stock History</h2>
                    <span className="text-sm text-gray-500">
                        {filteredHistory.length} {filter === 'all' ? 'total' : filter} entries
                    </span>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg border transition-colors ${
                            filter === 'all'
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        All Entries
                    </button>
                    <button
                        onClick={() => setFilter('addition')}
                        className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg border transition-colors flex items-center gap-2 ${
                            filter === 'addition'
                                ? 'bg-green-600 border-green-600 text-white shadow-sm'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaPlus className="w-3 h-3" />
                        Additions
                    </button>
                    <button
                        onClick={() => setFilter('removal')}
                        className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg border transition-colors flex items-center gap-2 ${
                            filter === 'removal'
                                ? 'bg-red-600 border-red-600 text-white shadow-sm'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaMinus className="w-3 h-3" />
                        Removals
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.entryType === 'addition' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                            >
                                {item.entryType === 'addition' ? '+' : '−'}
                            </div>
                            <div className="flex-1 text-sm">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-gray-800">
                                        {item.entryType === 'addition' ? 'Added' : 'Used'}{' '}
                                        {item.quantity}
                                    </p>
                                    <p className="text-xs text-gray-400">{item.entryDate}</p>
                                </div>
                                <p className="text-xs text-gray-500">by {item.createdBy}</p>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Batch ID: {item.batchId}</span>
                                    <span>Transaction ID: {item.entryId}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded-md">
                                    {item.additionalNotes || 'No additional notes'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaMinus className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium mb-1">
                            No {filter === 'all' ? '' : filter} entries
                        </p>
                        <p className="text-sm">
                            {filter === 'all'
                                ? 'No stock movements recorded for this product yet.'
                                : `No ${filter} entries found. Try selecting a different filter.`}
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default StockHistory;
