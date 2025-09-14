'use client';

import { FaPlus, FaMinus, FaUser } from 'react-icons/fa';
import StockEntryBarcode from './StockEntryBarcode';
import { StockEntry } from '@/types/index';
import { useInView } from 'react-intersection-observer';
import SkeletonCardStock from './SkeletonCardStock';

type StockCardProps = {
    entry: StockEntry;
    type: 'addition' | 'removal';
};

const StockCard = ({ entry, type }: StockCardProps) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div ref={ref} className={`flex-shrink-0 w-72`}>
            {inView ? (
                <div
                    className={`  
            bg-white rounded-xl border border-gray-200 shadow-sm p-5 
            transition-transform duration-300 hover:-translate-y-1
          `}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">#{entry.batchId}</span>
                        {entry.expirationLabel && type === 'addition' && (
                            <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full
                  ${
                      entry.expirationLabel === 'Expired'
                          ? 'text-red-700 bg-red-100'
                          : entry.expirationLabel === 'Expiring soon'
                            ? 'text-orange-600 bg-orange-100'
                            : 'hidden'
                  }
                `}
                            >
                                {entry.expirationLabel}
                            </span>
                        )}
                    </div>

                    {type === 'addition' && (
                        <div className="flex flex-col items-center mb-4">
                            <StockEntryBarcode
                                entryId={entry.entryId}
                                batchId={entry.batchId}
                                className="w-auto max-w-full justify-items-center"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className={`rounded-full p-2.5 ${
                                type === 'addition'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-red-100 text-red-600'
                            }`}
                        >
                            {type === 'addition' ? (
                                <FaPlus className="w-3 h-3" />
                            ) : (
                                <FaMinus className="w-3 h-3" />
                            )}
                        </div>
                        <span
                            className={`font-medium ${
                                type === 'addition' ? 'text-green-700' : 'text-red-600'
                            }`}
                        >
                            {type === 'addition'
                                ? `Added ${entry.quantity}`
                                : `Used ${entry.quantity}`}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <FaUser className="w-3 h-3" /> {entry.createdBy}
                        </span>
                        <span>{entry.entryDate}</span>
                    </div>
                </div>
            ) : (
                <SkeletonCardStock />
            )}
        </div>
    );
};
export default StockCard;
