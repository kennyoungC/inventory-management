import React from 'react';
import { FaTrash } from 'react-icons/fa';

const NoSupplierInfo = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <FaTrash className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">No Supplier Information</h3>
            <p className="mt-1 text-sm text-gray-500">
                This product is managed internally or supplier details have not been added.
            </p>
        </div>
    );
};

export default NoSupplierInfo;
