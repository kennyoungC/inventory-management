import { Metadata } from 'next';
import Dashboard from '@/ui/dashboard/Dashboard';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export default function Page() {
    return <Dashboard />;
}
