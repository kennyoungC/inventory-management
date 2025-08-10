import ProductManagement from 'app/ui/product-management/ProductManagement';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Product Management',
};

const Page = async () => {
    return <ProductManagement />;
};

export default Page;
