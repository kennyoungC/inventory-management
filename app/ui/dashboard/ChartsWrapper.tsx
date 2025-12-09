import { getAdditionsVsRemovalsTrend, getUpcomingExpirationsByWeek } from '@/data/stock-history';
import { getInventoryByCategory, getLowStockProducts } from '@/data/product';
import ChartsClient from './components/ChartsClient';

export default async function ChartsWrapper() {
    const [trend, categories, lowStock, expirations] = await Promise.all([
        getAdditionsVsRemovalsTrend(30),
        getInventoryByCategory(),
        getLowStockProducts(),
        getUpcomingExpirationsByWeek(60),
    ]);

    return (
        <ChartsClient
            trend={trend}
            categories={categories}
            lowStock={lowStock}
            expirations={expirations}
        />
    );
}
