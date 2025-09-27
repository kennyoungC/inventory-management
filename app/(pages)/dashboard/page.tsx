import Dashboard from '../../ui/dashboard/Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export default function Page() {
    return <Dashboard />;
}
