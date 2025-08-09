import HeaderBar from '../HeaderBar';

import MainContent from './MainContent';

const Notifications = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <HeaderBar title="Notifications" />
                {/* Main Content Area */}
                <MainContent />
            </div>
        </div>
    );
};
export default Notifications;
