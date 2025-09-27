import HeaderBar from 'app/shared/components/HeaderBar';
import MainContent from './MainContent';
import type { NotificationModel } from 'app/lib/types';

type Props = {
    initialNotifications: NotificationModel[];
};

const Notifications = ({ initialNotifications }: Props) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 overflow-hidden flex flex-col">
                <HeaderBar title="Notifications" />
                <MainContent initialNotifications={initialNotifications} />
            </div>
        </div>
    );
};
export default Notifications;
