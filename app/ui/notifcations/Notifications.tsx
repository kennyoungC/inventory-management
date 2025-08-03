'use client';

import { useState } from 'react';
import HeaderBar from '../HeaderBar';
import NotificationDetails from './NotificationDetails';
import NotificationListItem from './NotificationListItem';
import EmptyState from './EmptyState';

const Notifications = () => {
    const [showNotificationDetails, setShowNotificationDetails] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
    const notifications = [
        {
            id: 1,
            type: 'ai_agent',
            title: 'AI Email Draft Ready',
            message:
                'An email has been drafted for supplier John Smith regarding fresh tomatoes order. Review and send.',
            timestamp: '2025-05-04T09:15:00',
            isRead: false,
            isUrgent: false,
        },
        {
            id: 2,
            type: 'inventory',
            title: 'Inventory Expiring Soon',
            message: 'Fresh Salmon will expire in 2 days. Current stock: 8 units.',
            timestamp: '2025-05-04T08:30:00',
            isRead: false,
            isUrgent: true,
        },
        {
            id: 3,
            type: 'ai_agent',
            title: 'AI Stock Recommendation',
            message:
                'Based on historical data, AI suggests ordering Bell Peppers. Stock predicted to run low next week.',
            timestamp: '2025-05-03T16:20:00',
            isRead: true,
            isUrgent: false,
        },
        {
            id: 4,
            type: 'inventory',
            title: 'Inventory Delivery Arrived',
            message: 'Your weekly inventory delivery has arrived and been checked in.',
            timestamp: '2025-05-02T11:45:00',
            isRead: true,
            isUrgent: false,
        },
    ];
    const [notificationsList, setNotificationsList] = useState(notifications);
    const handleMarkAsRead = (id: number) => {
        setNotificationsList(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, isRead: true } : notification,
            ),
        );
    };
    const handleDeleteNotification = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotificationsList(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id),
        );
        if (selectedNotification === id) {
            setShowNotificationDetails(false);
            setSelectedNotification(null);
        }
    };
    // const handleArchiveNotification = (id: number, e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     // In a real application, this would move the notification to an archive
    //     // For this demo, we'll just mark it as read
    //     handleMarkAsRead(id);
    // };

    const selectedNotificationDetails = selectedNotification
        ? notificationsList.find(notification => notification.id === selectedNotification)
        : null;
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <HeaderBar title="Notifications" />
                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex">
                    <div
                        className={`flex-1 overflow-y-auto px-8 pb-8 transition-all duration-300 ${showNotificationDetails ? 'mr-[400px]' : ''}`}
                    >
                        {/* Notifications List */}
                        <div className="space-y-4 py-10">
                            {notificationsList.length > 0 ? (
                                notificationsList.map(notification => (
                                    <NotificationListItem
                                        key={notification.id}
                                        notification={notification}
                                        setSelectedNotification={setSelectedNotification}
                                        setShowNotificationDetails={setShowNotificationDetails}
                                        handleMarkAsRead={handleMarkAsRead}
                                        selectedNotification={selectedNotification}
                                    />
                                ))
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </div>
                    {showNotificationDetails && selectedNotificationDetails && (
                        <NotificationDetails
                            selectedNotificationDetails={selectedNotificationDetails}
                            setShowNotificationDetails={setShowNotificationDetails}
                            handleMarkAsRead={handleMarkAsRead}
                            handleDeleteNotification={handleDeleteNotification}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
export default Notifications;
