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
    expirationPeriod: string;
    supplierId: string;
    supplierName?: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
};

export type supplierModel = {
    id: string;
    name: string;
    email: string;
    phone: string;
    contactPerson: string;
    minimumOrderQuantity: number;
};
