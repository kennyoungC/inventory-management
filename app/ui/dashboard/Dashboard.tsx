import HeaderBar from 'app/shared/components/HeaderBar';
import { Suspense } from 'react';
import CardWrapper from './Cards';

const Dashboard = () => {
    return (
        <div>
            <HeaderBar title="Dashboard Page" />
            <main className="min-h-screen bg-gray-50 py-8 px-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Suspense fallback={<CardWrapper />}>
                        <CardWrapper />
                    </Suspense>
                </div>
                {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                    <Suspense fallback={<RevenueChartSkeleton />}>
                        <RevenueChart />
                    </Suspense>
                    <Suspense fallback={<LatestInvoicesSkeleton />}>
                        <LatestInvoices />
                    </Suspense>
                </div> */}
            </main>
        </div>
    );
};

export default Dashboard;
