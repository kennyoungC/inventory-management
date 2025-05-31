import Settings from '@/app/ui/settings/Settings';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Staff Management',
};
const Page = () => {
    return <Settings />;
};

export default Page;
