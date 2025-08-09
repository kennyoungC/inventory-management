import React from 'react';
import { FaBell } from 'react-icons/fa';

const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                <FaBell className="text-blue-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications</h3>
            <p className="text-gray-500 text-center max-w-md">
                You&apos;re all caught up! New notifications about staff, inventory, and orders will
                appear here.
            </p>
        </div>
    );
};

export default EmptyState;
