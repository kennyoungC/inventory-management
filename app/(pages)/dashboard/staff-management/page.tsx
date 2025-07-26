import StaffMangement from 'app/ui/staff-management/StaffMangement';
import React from 'react';
import { Metadata } from 'next';
import { getAllStaff } from '@/actions/staff.actions';

export const metadata: Metadata = {
    title: 'Staff Management',
};

export default async function Page() {
    const staffList = await getAllStaff();

    return <StaffMangement staffList={staffList} />;
}
