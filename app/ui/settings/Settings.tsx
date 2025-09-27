import HeaderBar from 'app/shared/components/HeaderBar';
import RestaurantProfileForm from './forms/RestaurantProfile';
import ChangePasswordForm from './forms/ChangePassword';
import AccessCodeForm from './forms/AccessCode';
import { getRestaurantById } from '@/data/restaurant';

export default async function Settings() {
    const restaurant = await getRestaurantById();

    if (!restaurant) {
        return null;
    }

    return (
        <>
            <HeaderBar title="Settings" />
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">User Profile</h2>
                            <RestaurantProfileForm restaurant={restaurant} />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Account Security
                            </h2>
                            <ChangePasswordForm />
                            <AccessCodeForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
