'use client';

import { useMemo, useState } from 'react';
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

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
    };

    const handleCloseDetails = () => {
        setShowNotificationDetails(false);
        setSelectedNotification(null);
    };

    const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteNotification(id);

        if (selectedNotification === id) {
            handleCloseDetails();
        }
    };

    const selectedNotificationDetails = useMemo(() => {
        return selectedNotification
            ? initialNotifications.find(notification => notification.id === selectedNotification)
            : null;
    }, [selectedNotification, initialNotifications]);
    return (
        <main className="flex-1 overflow-hidden flex">
            <div
                className={`flex-1 overflow-y-auto px-8 pb-8 transition-all duration-300 ${showNotificationDetails ? 'mr-[400px]' : ''}`}
            >
                {/* Notifications List */}
                <div className="space-y-4 py-10">
                    {initialNotifications.length > 0 ? (
                        initialNotifications.map(notification => (
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
                    handleCloseDetails={handleCloseDetails}
                    handleMarkAsRead={handleMarkAsRead}
                    handleDeleteNotification={handleDeleteNotification}
                />
            )}
        </main>
    );
};

export default MainContent;
