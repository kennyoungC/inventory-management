import HeaderBar from '@/ui/HeaderBar';
import MainContent from './MainContent';
import type { NotificationModel } from 'app/lib/types';

type Props = {
    initialNotifications: NotificationModel[];
};

const Notifications = ({ initialNotifications }: Props) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <HeaderBar title="Notifications" />
                {/* Main Content Area */}
                <MainContent initialNotifications={initialNotifications} />
            </div>
        </div>
    );
};
export default Notifications;
