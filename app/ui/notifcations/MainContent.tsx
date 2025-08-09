'use client';
import jsonData from '@/utils/data.json';

import { useState } from 'react';
import NotificationListItem from './NotificationListItem';
import EmptyState from './EmptyState';
import NotificationDetails from './NotificationDetails';

const MainContent = () => {
    const [showNotificationDetails, setShowNotificationDetails] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<number | null>(null);

    const [notificationsList, setNotificationsList] = useState(jsonData);
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

    const selectedNotificationDetails = selectedNotification
        ? notificationsList.find(notification => notification.id === selectedNotification)
        : null;
    return (
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
    );
};

export default MainContent;
