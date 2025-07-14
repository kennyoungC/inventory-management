import StaffMangement from '@/app/ui/staff-management/StaffMangement';
import React from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getAllStaff } from '@/app/lib/data';

export const metadata: Metadata = {
    title: 'Staff Management',
};

export default async function Page() {
    const session = await auth();
    const restaurantId = session?.user?.id;
    if (!restaurantId) return <div>Not authorized</div>;

    const staffList = await getAllStaff(restaurantId);

    return <StaffMangement staffList={staffList} />;
}
