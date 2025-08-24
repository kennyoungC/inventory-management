'use client';

import { createContext, useContext, useMemo } from 'react';

type ProductSessionValue = {
    productId: string;
};

type Props = {
    children: React.ReactNode;
    productId: string;
};

export const ProductSessionContext = createContext<ProductSessionValue | undefined>(undefined);

export function useProductSession() {
    const context = useContext(ProductSessionContext);
    if (!context) throw new Error('useProductSession must be used within ProductSessionProvider');
    return context;
}

export function ProductSessionProvider({ productId, children }: Props) {
    const value = useMemo<ProductSessionValue>(() => ({ productId }), [productId]);
    return (
        <ProductSessionContext.Provider value={value}>{children}</ProductSessionContext.Provider>
    );
}
