'use client';

import { editProduct } from '@/actions/product.actions';
import Inputs from '@/components/Inputs';
import Loader from '@/components/Loader';
import SelectInput from '@/components/SelectInput/SelectInput';
import { ProductWithSupplierModel, supplierModel } from '@/types/index';
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

type Props = {
    onClose: () => void;
    suppliers: supplierModel[];
    product: ProductWithSupplierModel & { existingSupplierId?: string };
};

const EditProduct = ({ onClose, suppliers, product }: Props) => {
    const editProductWithId = editProduct.bind(null, product.id);
    const [state, formAction, isPending] = useActionState(editProductWithId, null);
    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.id,
        label: supplier.name,
    }));

    const [formData, setFormData] = useState<
        ProductWithSupplierModel & { existingSupplierId?: string }
    >(product);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [onClose, state?.success]);

    useEffect(() => {
        setFormData(product);
    }, [product]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    ) {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <div className="fixed inset-0 backdrop-brightness-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                {/* Sticky header */}
                <div className="p-6 border-b border-gray-100 sticky top-0 z-10 bg-white rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
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
                                value={formData?.name ?? ''}
                                onChange={handleChange}
                                error={state?.errors?.name?.[0]}
                                required
                            />
                            <Inputs
                                label="SKU"
                                name="sku"
                                placeholder="Auto-generated"
                                defaultValue={formData?.sku ?? ''}
                                disabled
                                readOnly
                            />

                            <SelectInput
                                label="Category"
                                name="category"
                                options={categories}
                                defaultValue={
                                    categories.find(cat => cat.value === formData?.category) || null
                                }
                                placeholder="-- Select a category --"
                                required
                                error={state?.errors?.category?.[0]}
                                onChange={(option: SelectOption | null) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        category: option?.value ?? '',
                                    }));
                                }}
                            />
                            <SelectInput
                                label="Measuring Unit"
                                name="measurementUnit"
                                options={measurementUnitsGrouped}
                                required
                                defaultValue={measurementUnitsGrouped
                                    .flatMap(group => group.options)
                                    .find(option => option.value === formData?.measurementUnit)}
                                onChange={(option: SelectOption | null) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        measurementUnit: option?.value ?? '',
                                    }));
                                }}
                                error={state?.errors?.measurementUnit?.[0]}
                            />

                            <Inputs
                                label="Minimum Stock Level"
                                name="minimumStockLevel"
                                placeholder="Enter minimum stock level"
                                value={formData?.minimumStockLevel ?? ''}
                                error={state?.errors?.minimumStockLevel?.[0]}
                                type="number"
                                onKeyDown={handleKeyDown}
                                onChange={handleChange}
                            />
                            <Inputs
                                label="Storage Location"
                                name="storageLocation"
                                placeholder="Enter storage location"
                                value={formData?.storageLocation ?? ''}
                                error={state?.errors?.storageLocation?.[0]}
                                onChange={handleChange}
                            />
                            {/* <Inputs
                                label="Expiration Period"
                                name="expirationPeriod"
                                placeholder="Enter expiration period"
                                defaultValue={state?.values?.expirationPeriod}
                                error={state?.errors?.expirationPeriod?.[0]}
                            /> */}
                        </div>
                        <div className="mt-5">
                            <label
                                htmlFor="notes"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Additional Notes
                            </label>
                            <textarea
                                id="notes"
                                name="additionalNotes"
                                placeholder="Enter any additional notes about the product..."
                                className="mt-1 block w-full min-h-[56px] rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
                                value={formData?.additionalNotes ?? ''}
                                onChange={handleChange}
                            />
                        </div>
                        {/* SUPPLIER */}
                        {formData?.supplier && (
                            <div className="my-5">
                                <SelectInput
                                    label="Choose a new Supplier"
                                    name="existingSupplierId"
                                    options={supplierOptions}
                                    placeholder="-- Choose an existing supplier --"
                                    defaultValue={
                                        supplierOptions.find(
                                            supplier => supplier.value === formData.supplier?.id,
                                        ) || null
                                    }
                                    onChange={(selectedOption: SelectOption | null) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            existingSupplierId: selectedOption?.value,
                                        }));
                                    }}
                                    error={state?.errors?.existingSupplierId?.[0]}
                                />
                            </div>
                        )}
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
                                className="px-5 inline-flex items-center gap-2 py-2 cursor-pointer rounded-lg bg-blue-600 text-white font-semibold shadow hover:shadow-lg transition"
                                disabled={isPending}
                            >
                                {isPending ? <Loader /> : null}
                                {isPending ? 'Editing...' : 'Edit Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
