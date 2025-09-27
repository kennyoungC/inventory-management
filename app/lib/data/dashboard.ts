import { auth } from 'auth';
import dbConnect from '../db';
import Product from '@/models/product';
import Supplier from '@/models/supplier';

export async function fetchCardData() {
    const session = await auth();
    const restaurantId = session?.user?.id;

    if (!restaurantId) {
        throw new Error('Unauthorized: No restaurant session found.');
    }

    await dbConnect();

    const query = { restaurant_id: restaurantId };

    const [totalProducts, totalActiveSuppliers, lowStockCount, outOfStockCount] = await Promise.all(
        [
            Product.countDocuments(query),
            Supplier.countDocuments(query),
            Product.countDocuments({
                ...query,
                $expr: { $lte: ['$current_stock_level', '$minimum_stock_level'] },
            }),

            Product.countDocuments({
                ...query,
                current_stock_level: { $eq: 0 },
            }),
        ],
    );

    return {
        totalProducts: totalProducts,
        totalActiveSuppliers: totalActiveSuppliers,
        numberOfLowStock: lowStockCount,
        numberOfOutOfStock: outOfStockCount,
    };
}
