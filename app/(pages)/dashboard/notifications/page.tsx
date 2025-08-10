import Notifications from 'app/ui/notifcations/Notifications';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Notifications',
};

export default async function Page() {
    return <Notifications />;
}
