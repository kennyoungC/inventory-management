// import { formatDateToRelative } from '@/utils/formatDate';
import React from 'react';
import { FaBell, FaBox, FaRobot } from 'react-icons/fa';
import type { NotificationModel } from 'app/lib/types';
import { formatDate } from 'app/shared/utils/dateUtils';

type Props = {
    notification: NotificationModel;
    setSelectedNotification: (id: string) => void;
    setShowNotificationDetails: (show: boolean) => void;
    handleMarkAsRead: (id: string) => void;
    selectedNotification: string | null;
};

const NotificationListItem = ({
    notification,
    setSelectedNotification,
    setShowNotificationDetails,
    handleMarkAsRead,
    selectedNotification,
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
        <div
            key={notification.id}
            onClick={() => {
                setSelectedNotification(notification.id);
                setShowNotificationDetails(true);
            }}
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${
                selectedNotification === notification.id ? 'ring-2 ring-blue-500' : ''
            } ${!notification.isRead ? 'border-l-4 border-blue-500' : ''}`}
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50">
                        {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3
                                className={`text-base ${!notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}
                            >
                                {notification.title}
                                {notification.isUrgent && (
                                    <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                        Urgent
                                    </span>
                                )}
                            </h3>
                            <span className="text-xs text-gray-500">
                                {formatDate(notification.createdAt)}
                            </span>
                        </div>
                        <p
                            className={`text-sm ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'} line-clamp-2`}
                        >
                            {notification.summary}
                        </p>
                    </div>
                </div>
                <div className="flex justify-end mt-3 gap-2">
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                        }}
                        className={`px-4 py-1.5 !rounded-button whitespace-nowrap cursor-pointer transition-all duration-200 ${
                            notification.isRead
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                        disabled={notification.isRead}
                    >
                        {notification.isRead ? 'Noticed' : 'Mark as Noticed'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationListItem;
