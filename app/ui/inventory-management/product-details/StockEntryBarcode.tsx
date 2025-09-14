'use client';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

interface StockEntryBarcodeProps {
    entryId: string;
    className?: string;
    batchId: string;
}

const StockEntryBarcode = ({ entryId, className, batchId }: StockEntryBarcodeProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        documentTitle: `StockEntry-${entryId}`,
        contentRef,
    });

    return (
        <div className={className}>
            <button className="cursor-pointer" onClick={reactToPrintFn}>
                <div ref={contentRef}>
                    <Barcode
                        value={entryId}
                        format="CODE128B"
                        width={0.7}
                        height={40}
                        displayValue={true}
                        fontSize={14}
                        textAlign="center"
                        textMargin={8}
                        background="#ffffff"
                        lineColor="#000000"
                    />
                    <span className="hidden print:block ml-4">#{batchId}</span>
                </div>
            </button>
        </div>
    );
};

export default StockEntryBarcode;
