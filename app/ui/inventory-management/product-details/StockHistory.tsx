import { StockEntry } from '@/types/index';
import StockCard from './StockCard';

type StockHistoryProps = {
    additions: StockEntry[];
    usage: StockEntry[];
};

const StockHistory = ({ additions, usage }: StockHistoryProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-8">
            {/* Stock Additions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Additions</h3>
                <div className="overflow-x-auto scrollbar">
                    <div className="flex gap-4">
                        {additions.map((entry, index) => (
                            <StockCard key={index} entry={entry} type="addition" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Usage History */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage History</h3>
                <div className="overflow-x-auto scrollbar ">
                    {usage.length > 0 ? (
                        <div className="flex gap-4 items-stretch overflow-x-auto">
                            {usage.map((entry, index) => (
                                <StockCard key={index} entry={entry} type="removal" />
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500">No usage history available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockHistory;
