'use client';

import { createStockEntry } from '@/actions/stock-history';

import { useActionState, useState } from 'react';
import { FaPlus, FaMinus, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import StockForm from './StockForm';
import { SectionType } from '@/types/index';

type Props = {
    productId: string;
    measurementUnit: string;
    currentStock: number;
};

const StockManagement = ({ productId, measurementUnit, currentStock }: Props) => {
    const [state, formAction, isPending] = useActionState(createStockEntry, null);
    const [openSection, setOpenSection] = useState<SectionType | null>('addition');

    const toggleSection = (section: SectionType) => {
        setOpenSection(current => (current === section ? null : section));
    };

    return (
        <>
            <div className="lg:col-span-2 rounded-lg  flex flex-col overflow-hidden ">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Stock Management</h1>

                {/* Stock Entry Accordion */}
                <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button
                        className={`w-full px-4 py-4 flex items-center cursor-pointer justify-between bg-blue-50 hover:bg-blue-100 transition-colors duration-200 ${
                            openSection === 'addition' ? '' : 'rounded-lg'
                        }`}
                        onClick={() => toggleSection('addition')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                                <FaPlus className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-800">Stock Entry</div>
                                <div className="text-sm text-gray-500">
                                    Record new stock arrival
                                </div>
                            </div>
                        </div>
                        <div className="text-blue-600">
                            {openSection === 'addition' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </button>

                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            openSection === 'addition'
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                            <StockForm
                                entryType="addition"
                                productId={productId}
                                measurementUnit={measurementUnit}
                                currentStock={currentStock}
                                formAction={formAction}
                                isPending={isPending}
                                state={state}
                            />
                        </div>
                    </div>
                </div>

                {/* Stock Removal Accordion */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button
                        className={`w-full px-4 py-4 flex items-center cursor-pointer justify-between bg-red-50 hover:bg-red-100 transition-colors duration-200 ${
                            openSection === 'removal' ? '' : 'rounded-lg'
                        }`}
                        onClick={() => toggleSection('removal')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                                <FaMinus className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-800">Stock Removal</div>
                                <div className="text-sm text-gray-500">
                                    Record stock usage or removal
                                </div>
                            </div>
                        </div>
                        <div className="text-red-600">
                            {openSection === 'removal' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </button>

                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            openSection === 'removal' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                            <StockForm
                                entryType="removal"
                                productId={productId}
                                measurementUnit={measurementUnit}
                                currentStock={currentStock}
                                formAction={formAction}
                                isPending={isPending}
                                state={state}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StockManagement;
