import { SupplierDto } from '@/models/supplier';

export type NavItems = {
    name: string;
    href: string;
    icon: string;
};

export interface InputsProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    placeholder: string;
    error?: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type StaffModel = {
    id: string;
    restaurantId: string;
    fullName: string;
    jobTitle: string;
    isActive: boolean;
    email: string;
    lastLoginAt?: string;
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
    supplierId: string;
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
    created_by: string;
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
    supplier: supplierModel | null;
};
