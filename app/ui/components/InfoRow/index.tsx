import React from 'react';

type Props = {
    label: string;
    value: string | number | undefined;
    valueClassName?: string;
};

const InfoRow = ({ label, value, valueClassName = '' }: Props) => {
    return (
        <div className="flex justify-between items-center py-1.5">
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`text-sm text-gray-800 font-medium text-right ${valueClassName}`}>
                {value}
            </span>
        </div>
    );
};

export default InfoRow;
