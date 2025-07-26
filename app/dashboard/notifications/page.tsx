import React from 'react';
import { Metadata } from 'next';
import Notifications from 'app/ui/notifcations/Notifications';

export const metadata: Metadata = {
    title: 'Notifications',
};
const Page = () => {
    return <Notifications />;
};

export default Page;
