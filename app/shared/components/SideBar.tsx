import { getNotificationCount } from '@/data/notification';
import NavLinks from '../../ui/components/NavLinks/NavLinks';
import { getCurrentSessionUser } from '@/data/session';

export default async function SideBar() {
    const notificationCount = await getNotificationCount();
    const currentUser = await getCurrentSessionUser();

    return (
        <aside
            tabIndex={0}
            className="peer group fixed h-screen bg-white shadow-xl w-14 hover:w-64 transition-all duration-300 overflow-hidden z-40"
            aria-label="Main sidebar"
        >
            <div className="p-4 border-b border-gray-100">
                <h1 className="text-xl font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    RestaurantHub
                </h1>
            </div>

            <NavLinks isAdmin={currentUser?.role === 'admin'} count={notificationCount} />
        </aside>
    );
}
