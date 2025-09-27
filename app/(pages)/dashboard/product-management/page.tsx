import React from 'react';
import { Metadata } from 'next';
import ProductManagement from '@/ui/product-management/ProductManagement';

export const metadata: Metadata = {
    title: 'Product Management',
};

const Page = async () => {
    return <ProductManagement />;
};

export default Page;
