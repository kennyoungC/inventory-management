import Settings from 'app/ui/settings/Settings';
import React from 'react';
import { Metadata } from 'next';
import { RestaurantSessionProvider } from 'app/context/RestaurantSessionContext';
import { auth } from 'auth';

export const metadata: Metadata = {
    title: 'Staff Management',
};

export default async function Page() {
    const session = await auth();
    const restaurantId = session?.user?.id;

    if (!restaurantId) {
        return null;
    }

    return (
        <RestaurantSessionProvider restaurantId={restaurantId}>
            <Settings />
        </RestaurantSessionProvider>
    );
}
