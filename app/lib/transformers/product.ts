import { SupplierDto } from '@/models/supplier';

import { ProductWithSupplierDto, ProductWithSupplierModel, supplierModel } from '../types';

export function transformSupplierDto(dto: SupplierDto): supplierModel {
    return {
        id: dto._id.toString(),
        name: dto.supplier_name,
        contactPerson: dto.supplier_contact_person,
        phone: dto.supplier_phone_number,
        email: dto.supplier_email,
        minimumOrderQuantity: dto.supplier_minimum_order_quantity,
    };
}

export function transformSuppliersDto(dtos: SupplierDto[]): supplierModel[] {
    return dtos.map(transformSupplierDto);
}

export function transformProductWithSupplier(
    dto: ProductWithSupplierDto,
): ProductWithSupplierModel {
    return {
        id: dto._id.toString(),
        name: dto.name,
        sku: dto.sku,
        category: dto.category,
        measurementUnit: dto.measurement_unit,
        minimumStockLevel: dto.minimum_stock_level,
        currentStock: dto.current_stock_level,
        storageLocation: dto.storage_location,
        createdBy: dto.created_by,
        additionalNotes: dto.additional_notes,
        supplier: dto.supplier_id ? transformSupplierDto(dto.supplier_id) : null,
        updatedAt: dto.updatedAt,
    };
}

// 🔹 Array Transformer
export function transformProductsWithSuppliers(
    dtos: ProductWithSupplierDto[],
): ProductWithSupplierModel[] {
    return dtos.map(transformProductWithSupplier);
}
