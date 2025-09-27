import React from 'react';
import { Metadata } from 'next';
import StaffMangement from '@/ui/staff-management/StaffMangement';

export const metadata: Metadata = {
    title: 'Staff Management',
};

export default async function Page() {
    return <StaffMangement />;
}
