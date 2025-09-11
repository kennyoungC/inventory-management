import Barcode from 'react-barcode';

interface StockEntryBarcodeProps {
    entryId: string;
    className?: string;
    batchId: string;
}

const StockEntryBarcode = ({ entryId, className, batchId }: StockEntryBarcodeProps) => {
    return (
        <div
            className={`flex flex-col items-center p-4 bg-white rounded-lg shadow-sm ${className}`}
        >
            <Barcode
                value={entryId}
                format="CODE128"
                width={1}
                height={40}
                displayValue={true}
                fontSize={14}
                textAlign="center"
                textMargin={8}
                background="#ffffff"
                lineColor="#000000"
            />
            <p className="text-sm text-gray-600 mt-2">Batch ID: {batchId}</p>
            <p className="text-sm text-gray-600 mt-2">Created By: {batchId}</p>
        </div>
    );
};

export default StockEntryBarcode;
