import InventoryManagement from '@/app/ui/inventory-management/InventoryManagement';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Inventory Management',
};
const Page = () => {
    return <InventoryManagement />;
};

export default Page;
