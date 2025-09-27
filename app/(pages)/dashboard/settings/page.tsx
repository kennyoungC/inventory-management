import React from 'react';
import { Metadata } from 'next';
import Settings from '@/ui/settings';

export const metadata: Metadata = {
    title: 'Staff Management',
};

export default async function Page() {
    return <Settings />;
}
