import HeaderBar from 'app/shared/components/HeaderBar';
import { Suspense } from 'react';
import CardWrapper from './Cards';
import ChartsSection from './ChartsSection';

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
                <ChartsSection />
            </main>
        </div>
    );
};

export default Dashboard;
