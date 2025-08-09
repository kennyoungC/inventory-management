import StaffMangement from 'app/ui/staff-management/StaffMangement';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Staff Management',
};

export default async function Page() {
    return <StaffMangement />;
}
