import { StockEntry } from '@/types/index';
import { FaPlus, FaMinus, FaUser } from 'react-icons/fa';

type StockHistoryProps = {
    additions: StockEntry[];
    usage: StockEntry[];
};

const StockHistory = ({ additions, usage }: StockHistoryProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-8">
            {/* Stock Additions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 animate-fade-in">
                    Stock Additions
                </h3>
                <div className="overflow-x-auto scrollbar">
                    <div className="flex gap-4">
                        {additions.map((entry, index) => (
                            <div
                                key={index}
                                className={`
          bg-white rounded-lg border border-gray-200 shadow-sm p-4 
          transform transition-all cursor-pointer duration-500 ease-out
          hover:scale-105 hover:shadow-lg hover:-translate-y-1
          animate-slide-in-left
          flex-shrink-0 w-64
        `}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'both',
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        #{entry.batchId}
                                    </span>
                                    {entry.expirationLabel &&
                                        (entry.expirationLabel === 'Expiring soon' ||
                                            entry.expirationLabel === 'Expired') && (
                                            <span
                                                className={`
            text-xs font-semibold px-2 py-0.5 rounded animate-bounce-in
            ${entry.expirationLabel === 'Expired' ? 'text-red-700 bg-red-100' : ''}
            ${entry.expirationLabel === 'Expiring soon' ? 'text-orange-600 bg-orange-100' : ''}
        `}
                                            >
                                                {entry.expirationLabel}
                                            </span>
                                        )}
                                </div>
                                <div className="flex items-center gap-2 text-green-600 font-medium mb-2">
                                    <div className="bg-green-100 rounded-full p-2.5 transition-transform hover:rotate-90 hover:scale-110 duration-300">
                                        <FaPlus className="w-3 h-3" />
                                    </div>
                                    <span>Added {entry.quantity}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FaUser className="w-3 h-3" /> {entry.createdBy}
                                    </span>
                                    <span>{entry.entryDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Usage History */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 animate-fade-in">
                    Usage History
                </h3>
                <div className="overflow-x-auto scrollbar">
                    <div className="flex gap-4">
                        {usage.slice(0, 3).map((entry, index) => (
                            <div
                                key={index}
                                className={`
          bg-white rounded-lg border border-gray-200 shadow-sm p-4 
          transform transition-all duration-500 ease-out
          hover:scale-105 hover:shadow-lg cursor-pointer hover:-translate-y-1
          animate-slide-in-right
          flex-shrink-0 w-64
        `}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'both',
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        #{entry.batchId}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
                                    <div className="bg-red-100 rounded-full p-2.5 transition-transform hover:-rotate-90 hover:scale-110 duration-300">
                                        <FaMinus className="w-3 h-3" />
                                    </div>
                                    <span>Used {entry.quantity}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FaUser className="w-3 h-3" /> {entry.createdBy}
                                    </span>
                                    <span>{entry.entryDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockHistory;
