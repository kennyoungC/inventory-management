'use client';

import { createContext, useContext, useMemo } from 'react';

type RestaurantSessionValue = {
    restaurantId: string;
};

type Props = {
    children: React.ReactNode;
    restaurantId: string;
};

export const RestaurantSessionContext = createContext<RestaurantSessionValue | undefined>(
    undefined,
);

export function useRestaurantSession() {
    const context = useContext(RestaurantSessionContext);
    if (!context)
        throw new Error('useRestaurantSession must be used within RestaurantSessionProvider');
    return context;
}

export function RestaurantSessionProvider({ restaurantId, children }: Props) {
    const value = useMemo<RestaurantSessionValue>(() => ({ restaurantId }), [restaurantId]);
    return (
        <RestaurantSessionContext.Provider value={value}>
            {children}
        </RestaurantSessionContext.Provider>
    );
}
