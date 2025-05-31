import StaffMangement from '@/app/ui/staff-management/StaffMangement';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Staff Management',
};

const Page = () => {
    return <StaffMangement />;
};

export default Page;
