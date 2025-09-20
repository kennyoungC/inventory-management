'use client';

import {
    FaBell,
    FaBox,
    FaCheck,
    FaExternalLinkAlt,
    FaRobot,
    FaTimes,
    FaTrashAlt,
} from 'react-icons/fa';
import type { NotificationModel } from 'app/lib/types';

type Props = {
    selectedNotificationDetails: NotificationModel;
    setShowNotificationDetails: (show: boolean) => void;
    handleMarkAsRead: (id: string) => void;
    handleDeleteNotification: (id: string, e: React.MouseEvent) => void;
};

const NotificationDetails = ({
    selectedNotificationDetails,
    setShowNotificationDetails,
    handleMarkAsRead,
    handleDeleteNotification,
}: Props) => {
    const getNotificationIcon = (type: NotificationModel['type']) => {
        switch (type) {
            case 'ai_agent':
                return <FaRobot className="text-purple-500" />;
            case 'inventory':
                return <FaBox className="text-green-500" />;
            default:
                return <FaBell className="text-gray-500" />;
        }
    };

    return (
        <div className="fixed right-0 top-16 h-screen w-[400px] bg-white shadow-xl overflow-y-auto transform transition-transform duration-300">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-xl font-bold text-gray-800">Notification Details</h2>
                    <button
                        onClick={() => setShowNotificationDetails(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50">
                            {getNotificationIcon(selectedNotificationDetails.type)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {selectedNotificationDetails.title}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {new Date(selectedNotificationDetails.createdAt).toLocaleString(
                                    'en-US',
                                    {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    },
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-gray-800">{selectedNotificationDetails.message}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">
                            Notification Info
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Type</span>
                                <span className="capitalize px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                    {selectedNotificationDetails.type}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${selectedNotificationDetails.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}
                                >
                                    {selectedNotificationDetails.isRead ? 'Read' : 'Unread'}
                                </span>
                            </div>
                            {selectedNotificationDetails.isUrgent && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Priority</span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        Urgent
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <a
                            href="#"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                        >
                            <FaExternalLinkAlt />
                            <span>Go to Related Page</span>
                        </a>
                        <button
                            onClick={() => handleMarkAsRead(selectedNotificationDetails.id)}
                            disabled={selectedNotificationDetails.isRead}
                            className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 ${
                                selectedNotificationDetails.isRead
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <FaCheck />
                            <span>
                                {selectedNotificationDetails.isRead
                                    ? 'Already Read'
                                    : 'Mark as Read'}
                            </span>
                        </button>
                        <button
                            onClick={e => {
                                handleDeleteNotification(selectedNotificationDetails.id, e);
                            }}
                            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                        >
                            <FaTrashAlt />
                            <span>Delete Notification</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetails;
