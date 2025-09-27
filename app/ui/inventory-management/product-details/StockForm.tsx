'use client';

import { StockHistoryState } from '@/actions/stock-history';
import Inputs from '@/components/Inputs';
import TextAreaInput from '@/components/TextArea';
import type { SectionType } from '@/types/index';
import { getOneWeekFromToday } from 'app/shared/utils/dateUtils';

type StockFormProps = {
    entryType: SectionType;
    productId: string;
    measurementUnit: string;
    currentStock: number;
    formAction: string | ((formData: FormData) => void);
    isPending: boolean;
    state?: StockHistoryState;
};

const StockForm = ({
    entryType,
    productId,
    measurementUnit,
    currentStock,
    formAction,
    isPending,
    state,
}: StockFormProps) => {
    const isAddition = entryType === 'addition';

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="productId" defaultValue={productId} />
            <input type="hidden" name="measurementUnit" defaultValue={measurementUnit} />
            <input type="hidden" name="currentStock" defaultValue={currentStock} />
            <input type="hidden" name="entryType" defaultValue={entryType} />

            <Inputs
                name="quantity"
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
                error={state?.errors?.quantity?.[0]}
                defaultValue={state?.values?.quantity ?? ''}
                min={0}
                required
            />

            {/* entry-type specific fields */}
            {isAddition ? (
                <>
                    <Inputs
                        name="expirationDate"
                        label="Expiration Date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        defaultValue={state?.values?.expirationDate ?? getOneWeekFromToday()}
                    />
                    <TextAreaInput
                        id="notes"
                        name="additionalNotes"
                        label="Additional Notes"
                        placeholder="Enter any additional notes about the stock..."
                        defaultValue={state?.values?.additionalNotes ?? ''}
                        error={state?.errors?.additionalNotes?.[0] ?? ''}
                    />
                </>
            ) : (
                <TextAreaInput
                    id="reason"
                    name="reason"
                    label="Reason for Removal"
                    placeholder="Enter the reason for removal"
                    defaultValue={state?.values?.reason ?? ''}
                    error={state?.errors?.reason?.[0] ?? ''}
                />
            )}

            <button
                disabled={isPending}
                className={`w-full py-3 text-white font-semibold rounded-lg transition-colors duration-200 ${
                    isAddition ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                }`}
            >
                {isPending ? 'Processing...' : isAddition ? 'Add Stock' : 'Remove Stock'}
            </button>
        </form>
    );
};

export default StockForm;
