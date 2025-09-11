'use client';

import { createProduct } from '@/actions/product.actions';
import Inputs from '@/components/Inputs';
import SelectInput from '@/components/SelectInput/SelectInput';
import TextAreaInput from '@/components/TextArea';
import { measurementUnitsGrouped, SelectOption } from '@/utils/measureUnits';
import { useActionState, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const categories = [
    { value: 'wine-spirits', label: 'Wine & Spirits' },
    { value: 'meat-poultry', label: 'Meat & Poultry' },
    { value: 'fresh-produce', label: 'Fresh Produce' },
    { value: 'dairy-eggs', label: 'Dairy & Eggs' },
    { value: 'pantry-items', label: 'Pantry Items' },
];
const EXTERNAL = 'external';
const INTERNAL = 'internal';

type Props = {
    onClose: () => void;
    supplierOptions: SelectOption[];
};

const CreateNewProduct = ({ onClose, supplierOptions }: Props) => {
    const [state, formAction, isPending] = useActionState(createProduct, null);
    const [supplierType, setSupplierType] = useState(INTERNAL);
    const [supplierSelectionType, setSupplierSelectionType] = useState<'existing' | 'new'>(
        'existing',
    );

    useEffect(() => {
        if (state?.values?.supplierType) {
            setSupplierType(state.values.supplierType);
        }
    }, [state?.values?.supplierType]);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [onClose, state?.success]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    // Reset supplier selection when switching supplier types
    const handleSupplierTypeChange = (type: 'internal' | 'external') => {
        setSupplierType(type);
        if (type === 'internal') {
            setSupplierSelectionType('existing');
        }
    };

    return (
        <div className="fixed inset-0 backdrop-brightness-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                {/* Sticky header */}
                <div className="p-6 border-b border-gray-100 sticky top-0 z-10 bg-white rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                        >
                            <FaTimes color="gray" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-0">
                    <form action={formAction} className="w-full bg-white p-8 rounded-b-xl">
                        {/* PRODUCT DETAILS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Inputs
                                label="Product Name"
                                name="name"
                                placeholder="Enter product name"
                                defaultValue={state?.values?.name ?? ''}
                                error={state?.errors?.name?.[0]}
                                required
                            />
                            <Inputs
                                label="SKU"
                                name="sku"
                                placeholder="Auto-generated"
                                defaultValue="Auto-generated"
                                disabled
                            />

                            <SelectInput
                                label="Category"
                                name="category"
                                options={categories}
                                defaultValue={
                                    categories.find(cat => cat.value === state?.values?.category) ||
                                    null
                                }
                                placeholder="-- Select a category --"
                                required
                                error={state?.errors?.category?.[0]}
                            />
                            <SelectInput
                                label="Measuring Unit"
                                name="measurementUnit"
                                options={measurementUnitsGrouped}
                                required
                                defaultValue={
                                    measurementUnitsGrouped
                                        .flatMap(group => group.options)
                                        .find(
                                            option =>
                                                option.value === state?.values?.measurementUnit,
                                        ) || null
                                }
                                error={state?.errors?.measurementUnit?.[0]}
                            />

                            <Inputs
                                label="Minimum Stock Level"
                                name="minimumStockLevel"
                                placeholder="Enter minimum stock level"
                                defaultValue={state?.values?.minimumStockLevel}
                                error={state?.errors?.minimumStockLevel?.[0]}
                                type="number"
                                onKeyDown={handleKeyDown}
                            />
                            <Inputs
                                label="Storage Location"
                                name="storageLocation"
                                placeholder="Enter storage location"
                                defaultValue={state?.values?.storageLocation}
                                error={state?.errors?.storageLocation?.[0]}
                            />
                        </div>
                        <TextAreaInput
                            id="notes"
                            name="additionalNotes"
                            label="Additional Notes"
                            placeholder="Enter any additional notes about the product..."
                            defaultValue={state?.values?.additionalNotes ?? ''}
                        />
                        {/* SUPPLIER */}
                        <div className="border-t border-gray-200 mt-8 pt-6">
                            <h3 className="text-base font-semibold mb-3 text-gray-900">
                                Supplier Information
                            </h3>
                            <div className="mb-4 flex items-center gap-6">
                                <span className="text-sm text-gray-700 mr-2">Supplier Type:</span>
                                <label className="flex items-center gap-1 text-sm">
                                    <input
                                        key={state?.values?.supplierType}
                                        type="radio"
                                        name="supplierType"
                                        value={INTERNAL}
                                        defaultChecked={supplierType === INTERNAL}
                                        onChange={() => handleSupplierTypeChange('internal')}
                                        className="accent-blue-600"
                                    />
                                    Internal
                                </label>
                                <label className="flex items-center gap-1 text-sm">
                                    <input
                                        key={state?.values?.supplierType}
                                        type="radio"
                                        name="supplierType"
                                        value={EXTERNAL}
                                        defaultChecked={supplierType === EXTERNAL}
                                        onChange={() => handleSupplierTypeChange('external')}
                                        className="accent-blue-600"
                                    />
                                    External
                                </label>
                            </div>

                            {supplierType === EXTERNAL && (
                                <div className="space-y-5">
                                    {/* Supplier Selection Type */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-sm font-medium text-gray-700">
                                                Choose Supplier:
                                            </span>
                                            <label className="flex items-center gap-1 text-sm">
                                                <input
                                                    // key={supplierSelectionType}
                                                    type="radio"
                                                    name="supplierSelection"
                                                    defaultChecked={
                                                        supplierSelectionType === 'existing'
                                                    }
                                                    onChange={() =>
                                                        setSupplierSelectionType('existing')
                                                    }
                                                    value="existing"
                                                    className="accent-blue-600"
                                                />
                                                Select Existing
                                            </label>
                                            <label className="flex items-center gap-1 text-sm">
                                                <input
                                                    // key={supplierSelectionType}
                                                    type="radio"
                                                    name="supplierSelection"
                                                    value="new"
                                                    defaultChecked={supplierSelectionType === 'new'}
                                                    onChange={() => setSupplierSelectionType('new')}
                                                    className="accent-blue-600"
                                                />
                                                Add New Supplier
                                            </label>
                                        </div>

                                        {supplierSelectionType === 'existing' && (
                                            <SelectInput
                                                label="Select Supplier"
                                                name="existingSupplierId"
                                                options={supplierOptions}
                                                placeholder="-- Choose an existing supplier --"
                                                defaultValue={
                                                    supplierOptions.find(
                                                        supplier =>
                                                            supplier.value ===
                                                            state?.values?.existingSupplierId,
                                                    ) || null
                                                }
                                                error={state?.errors?.existingSupplierId?.[0]}
                                            />
                                        )}
                                    </div>

                                    {/* Supplier Details */}
                                    {supplierSelectionType === 'new' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Inputs
                                                label="Supplier Name"
                                                name="supplierName"
                                                placeholder="Enter supplier name"
                                                defaultValue={state?.values?.supplierName}
                                                error={state?.errors?.supplierName?.[0]}
                                            />
                                            <Inputs
                                                label="Contact Person"
                                                name="supplierContactPerson"
                                                placeholder="Enter contact person"
                                                defaultValue={state?.values?.supplierContactPerson}
                                                error={state?.errors?.supplierContactPerson?.[0]}
                                            />
                                            <Inputs
                                                label="Phone Number"
                                                name="supplierPhoneNumber"
                                                placeholder="Enter phone number"
                                                type="number"
                                                onKeyDown={handleKeyDown}
                                                defaultValue={state?.values?.supplierPhoneNumber}
                                                error={state?.errors?.supplierPhoneNumber?.[0]}
                                            />
                                            <Inputs
                                                label="Email"
                                                name="supplierEmail"
                                                placeholder="Enter email address"
                                                type="email"
                                                defaultValue={state?.values?.supplierEmail}
                                                error={state?.errors?.supplierEmail?.[0]}
                                            />
                                            <Inputs
                                                label="Minimum Order"
                                                name="supplierMinimumOrderQuantity"
                                                placeholder="Enter minimum order"
                                                defaultValue={
                                                    state?.values?.supplierMinimumOrderQuantity
                                                }
                                                error={
                                                    state?.errors?.supplierMinimumOrderQuantity?.[0]
                                                }
                                                type="number"
                                                onKeyDown={handleKeyDown}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* ACTIONS */}
                        <div className="mt-8 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 cursor-pointer rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 cursor-pointer rounded-lg bg-blue-600 text-white font-semibold shadow hover:shadow-lg transition"
                                disabled={isPending}
                            >
                                {isPending ? 'Adding...' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateNewProduct;
