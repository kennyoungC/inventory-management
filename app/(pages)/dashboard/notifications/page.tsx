import { Metadata } from 'next';
import { listNotifications } from '@/data/notification';
import Notifications from '@/ui/notifcations/Notifications';

export const metadata: Metadata = {
    title: 'Notifications',
};

export default async function Page() {
    const notifications = await listNotifications();

    return <Notifications initialNotifications={notifications} />;
}
