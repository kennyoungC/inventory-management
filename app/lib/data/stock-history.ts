import StockHistory, { StockHistoryDto } from '@/models/stock-history';
import { toCardModel, transformStockHistory } from '../transformers';
import { auth } from 'auth';
import dbConnect from '../db';
import { cache } from 'react';
import { Types } from 'mongoose';

export const getStockHistoryAdditions = cache(async (productId: string) => {
    try {
        await dbConnect();

        const session = await auth();
        const restaurantId = session?.user.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        const additions = await StockHistory.find({
            product_id: productId,
            restaurant_id: restaurantId,
            entry_type: 'addition',
        })
            .sort({ entry_date: -1 })
            .lean<StockHistoryDto[]>();

        return transformStockHistory(additions);
    } catch (error) {
        console.error('Error fetching stock history additions:', error);
        throw new Error('Failed to fetch stock history additions');
    }
});

export const getStockHistoryRemovals = cache(async (productId: string) => {
    try {
        await dbConnect();

        const session = await auth();
        const restaurantId = session?.user.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        const removals = await StockHistory.find({
            product_id: productId,
            restaurant_id: restaurantId,
            entry_type: 'removal',
        })
            .sort({ entry_date: -1 })
            .lean<StockHistoryDto[]>();

        return transformStockHistory(removals);
    } catch (error) {
        console.error('Error fetching stock history removals:', error);
        throw new Error('Failed to fetch stock history removals');
    }
});

export const getStockHistoryCardData = async (productId: string) => {
    try {
        await dbConnect();

        const session = await auth();
        const restaurantId = session?.user.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        const removals = await StockHistory.find({
            product_id: productId,
            restaurant_id: restaurantId,
            entry_type: 'removal',
        })
            .sort({ entry_date: -1 })
            .populate('stock_created_by')
            .lean<StockHistoryDto[]>();

        const additions = await StockHistory.find({
            product_id: productId,
            restaurant_id: restaurantId,
            entry_type: 'addition',
        })
            .populate('stock_created_by')
            .sort({ entry_date: -1 })
            .lean<StockHistoryDto[]>();

        return {
            additions: additions.map(item => toCardModel(item, false)),
            removals: removals.map(item => toCardModel(item, false)),
        };
    } catch (error) {
        console.error('Error fetching stock history card data:', error);
        throw new Error('Failed to fetch stock history card data');
    }
};

export const getAllStockHistory = cache(async (productId: string) => {
    try {
        await dbConnect();

        const session = await auth();
        const restaurantId = session?.user.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        const history = await StockHistory.find({
            product_id: productId,
            restaurant_id: restaurantId,
        })
            .populate('stock_created_by')
            .sort({ entry_date: -1 })
            .lean<StockHistoryDto[]>();

        return history.map(item => toCardModel(item, true));
    } catch (error) {
        console.error('Error fetching all stock history:', error);
        throw new Error('Failed to fetch all stock history');
    }
});

// Additions vs Removals trend for last N days (default 30)
export const getAdditionsVsRemovalsTrend = cache(async function (
    days: number = 30,
): Promise<{ date: string; additions: number; removals: number }[]> {
    try {
        await dbConnect();

        const session = await auth();
        const restaurantId = session?.user.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        const start = new Date();
        start.setDate(start.getDate() - Math.max(1, days));

        const grouped = await StockHistory.aggregate<{
            _id: { d: string; type: 'addition' | 'removal' };
            total: number;
        }>([
            {
                $match: {
                    restaurant_id: new Types.ObjectId(restaurantId),
                    entry_date: { $gte: start },
                },
            },
            {
                $group: {
                    _id: {
                        d: { $dateToString: { format: '%Y-%m-%d', date: '$entry_date' } },
                        type: '$entry_type',
                    },
                    total: { $sum: '$quantity' },
                },
            },
            { $sort: { '_id.d': 1 } },
        ]);

        // Fill missing days and pivot types
        const byDate: Record<string, { additions: number; removals: number }> = {};
        for (let i = 0; i <= days; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            byDate[key] = { additions: 0, removals: 0 };
        }

        for (const row of grouped) {
            const key = row._id.d;
            if (!byDate[key]) byDate[key] = { additions: 0, removals: 0 };
            if (row._id.type === 'addition') byDate[key].additions += row.total;
            else byDate[key].removals += row.total;
        }

        return Object.entries(byDate)
            .sort(([a], [b]) => (a < b ? -1 : 1))
            .map(([date, v]) => ({ date, additions: v.additions, removals: v.removals }));
    } catch (error) {
        console.error('Error fetching additions vs removals trend:', error);
        throw new Error('Failed to fetch additions vs removals trend');
    }
});

// Upcoming expirations count by week for next N days (default 60)
export const getUpcomingExpirationsByWeek = cache(async function (
    daysAhead: number = 60,
): Promise<{ week: string; count: number }[]> {
    try {
        await dbConnect();

        const session = await auth();
        const restaurantId = session?.user.id;

        if (!restaurantId) {
            throw new Error('Unauthorized: No restaurant session found.');
        }

        const now = new Date();
        const until = new Date();
        until.setDate(until.getDate() + Math.max(1, daysAhead));

        const grouped = await StockHistory.aggregate<{
            _id: string;
            count: number;
        }>([
            {
                $match: {
                    restaurant_id: new Types.ObjectId(restaurantId),
                    entry_type: 'addition',
                    expiration_date: { $gte: now, $lte: until },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%G-W%V',
                            date: '$expiration_date',
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return grouped.map(g => ({ week: g._id, count: g.count }));
    } catch (error) {
        console.error('Error fetching upcoming expirations by week:', error);
        throw new Error('Failed to fetch upcoming expirations by week');
    }
});
