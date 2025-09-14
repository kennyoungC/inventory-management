import { StockHistoryDto } from '@/models/stock-history';
import { StockEntry, StockHistoryModel } from '../types';
import { generateExpiredLabel } from '@/utils/generateExpiredLabel';
import { formatDate } from '@/utils/formatDate';

export function transformStockHistory(dto: StockHistoryDto[]): StockHistoryModel[] {
    return dto.map(item => ({
        restaurantId: item.restaurant_id.toString(),
        createdBy: item.stock_created_by.toString(),
        createdByModel: item.created_by_model,
        productId: item.product_id.toString(),
        entryType: item.entry_type,
        entryId: item.entry_id,
        entryDate: item.entry_date,
        quantity: item.quantity,
        measurementUnit: item.measurement_unit,
        expirationDate: item.expiration_date,
        additionalNotes: item.additional_notes,
        previousStock: item.previous_stock,
        newStock: item.new_stock,
        reason: item.reason,
        batchId: item.batch_id,
    }));
}

type StaffCreatedBy = { staff_name?: string };
type RestaurantCreatedBy = { restaurant_name?: string };

export function toCardModel(dto: StockHistoryDto, addTime: boolean): StockEntry {
    const labelStatus = generateExpiredLabel(new Date(dto.expiration_date));
    return {
        batchId: dto.batch_id,
        entryId: dto.entry_id,
        quantity: `${dto.quantity} ${dto.measurement_unit}`,
        createdBy:
            dto.created_by_model === 'Staff'
                ? ((dto.stock_created_by as StaffCreatedBy)?.staff_name ?? '')
                : ((dto.stock_created_by as RestaurantCreatedBy)?.restaurant_name ?? ''),
        entryDate: formatDate(dto.entry_date, addTime),
        entryType: dto.entry_type,
        expirationDate: formatDate(dto.expiration_date, addTime),
        expirationLabel: dto.expiration_date ? labelStatus : undefined,
        additionalNotes: dto.additional_notes || undefined,
    };
}
