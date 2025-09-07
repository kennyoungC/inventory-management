import InventoryManagement from 'app/ui/inventory-management/InventoryManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Inventory Management',
};

async function Page() {
    return <InventoryManagement />;
}

export default Page;
