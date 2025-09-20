'use client';

import { useState } from 'react';
import NotificationListItem from './NotificationListItem';
import EmptyState from './EmptyState';
import NotificationDetails from './NotificationDetails';
import type { NotificationModel } from 'app/lib/types';
import { deleteNotification, markNotificationAsRead } from 'app/lib/actions/notification.actions';

type Props = {
    initialNotifications: NotificationModel[];
};

const MainContent = ({ initialNotifications }: Props) => {
    const [showNotificationDetails, setShowNotificationDetails] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

    const [notificationsList, setNotificationsList] =
        useState<NotificationModel[]>(initialNotifications);
    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotificationsList(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, isRead: true } : notification,
            ),
        );
    };
    const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteNotification(id);
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
        <main className="flex-1 overflow-hidden flex">
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
                        <EmptyState
                            title="No notifications"
                            description="You're all caught up! New notifications about staff, inventory, and orders will appear here."
                        />
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
        </main>
    );
};

export default MainContent;
