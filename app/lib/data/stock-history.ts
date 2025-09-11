import StockHistory, { StockHistoryDto } from '@/models/stock-history';
import { toCardModel, transformStockHistory } from '../transformers';
import { auth } from 'auth';
import dbConnect from '../db';
import { cache } from 'react';

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
            additions: additions.map(toCardModel),
            removals: removals.map(toCardModel),
        };
    } catch (error) {
        console.error('Error fetching stock history card data:', error);
        throw new Error('Failed to fetch stock history card data');
    }
};
