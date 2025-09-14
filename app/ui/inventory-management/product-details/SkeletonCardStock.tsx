import React from 'react';

const SkeletonCardStock = () => {
    return (
        <div
            className={`bg-gray-100 w-auto animate-pulse rounded-xl border border-gray-200 overflow-hidden h-full`}
        >
            <div className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-5 bg-gray-300 rounded w-20"></div>
                </div>
                {/* 
                {hasBarcode && (
                    <div className="flex flex-col items-center mb-4">
                        <div className="h-10 bg-gray-300 rounded w-full max-w-[180px]"></div>
                    </div>
                )} */}

                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCardStock;
