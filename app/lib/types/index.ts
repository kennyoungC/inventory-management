import { SupplierDto } from '@/models/supplier';

export type NavItems = {
    name: string;
    href: string;
    icon: string;
};

export interface InputsProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    placeholder?: string;
    error?: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
    formGroupClass?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type StaffModel = {
    id: string;
    restaurantId: string;
    fullName: string;
    jobTitle: string;
    isActive: boolean;
    email: string;
    lastLoginAt: string;
    role?: string;
};

export type RestaurantModel = {
    id: string;
    restaurantName: string;
    email: string;
    phoneNumber: string;
    accessCode: string;
    address?: string;
    emailUpdates?: boolean;
};

export interface MongoDuplicateError extends Error {
    code?: number;
    keyValue?: Record<string, string>;
}

export type ProductModel = {
    id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    measurementUnit: string;
    minimumStockLevel: number;
    storageLocation: string;
    supplierId?: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
};

export type supplierModel = {
    id: string;
    name: string;
    email: string;
    phone: string;
    contactPerson?: string;
    minimumOrderQuantity: string | number;
};

export type ProductWithSupplierDto = {
    _id: string;
    name: string;
    sku: string;
    category: string;
    measurement_unit: string;
    minimum_stock_level: number;
    current_stock_level: number;
    storage_location: string;
    additional_notes: string;
    created_by: string;
    updatedAt?: Date;
    createdAt?: Date;
    supplier_id: SupplierDto | null;
};

export type ProductWithSupplierModel = {
    id: string;
    name: string;
    sku: string;
    category: string;
    measurementUnit: string;
    minimumStockLevel: number;
    currentStock: number;
    storageLocation: string;
    createdBy: string;
    additionalNotes: string;
    updatedAt?: Date;
    supplier: supplierModel | null;
};

export type SectionType = 'addition' | 'removal';

export interface StockHistoryModel {
    restaurantId: string;
    createdBy: string;
    createdByModel: 'Staff' | 'Restaurant';
    productId: string;
    entryType: 'addition' | 'removal';
    entryId: string;
    entryDate: Date;
    quantity: number;
    measurementUnit: string;
    expirationDate?: Date;
    additionalNotes?: string;
    previousStock: number;
    newStock: number;
    reason?: string;
    batchId: string;
}

export type StockEntry = {
    batchId: string;
    entryId: string;
    quantity: string;
    createdBy: string;
    entryDate: string;
    additionalNotes?: string;
    entryType: 'addition' | 'removal';
    expirationLabel: LabelStatus | undefined;
    expirationDate?: string | undefined;
};

export type LabelStatus = 'Expired' | 'Expiring soon' | 'Valid';
