'use client';

import React, { useActionState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Inputs from '../../Inputs';
import { addNewStaff } from '@/app/lib/actions/staff.actions';

type Staff = {
    id: string;
    restaurantId: string;
    fullName: string;
    jobTitle: string;
    isActive: boolean;
    email: string;
    lastLoginAt: string;
    role?: string;
};

type Props = {
    setShowAddStaffForm: (show: boolean) => void;
    onStaffAdded?: (newStaff: Staff) => void; // Optional callback for when a new staff is added
};

const CreateNewStaff = ({ setShowAddStaffForm, onStaffAdded }: Props) => {
    const [state, formAction, isPending] = useActionState(addNewStaff, null);

    useEffect(() => {
        if (state?.success && onStaffAdded) {
            if (!state.data) return;
            setShowAddStaffForm(false);
            onStaffAdded({
                id: state.data.id,
                restaurantId: state.data.restaurantId,
                fullName: state.data.fullName,
                jobTitle: state.data.jobTitle,
                isActive: state.data.isActive,
                email: state.data.email,
                lastLoginAt: new Date().toISOString(),
            });
        }
    }, [state?.success, setShowAddStaffForm, onStaffAdded, state?.data]);

    return (
        <div className="fixed inset-0 backdrop-brightness-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Add New Staff</h2>
                        <button
                            onClick={() => setShowAddStaffForm(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                        >
                            <FaTimes color="gray" />
                        </button>
                    </div>
                </div>
                <form action={formAction} className="p-6 space-y-4">
                    <Inputs
                        label="Full Name"
                        name="fullName"
                        placeholder="Enter staff name"
                        defaultValue={state?.values?.fullName}
                        error={state?.errors?.fullName?.[0]}
                    />
                    <Inputs
                        label="Job Title"
                        name="jobTitle"
                        placeholder="Enter job title"
                        defaultValue={state?.values?.jobTitle}
                        error={state?.errors?.jobTitle?.[0]}
                    />
                    <Inputs
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        defaultValue={state?.values?.email}
                        error={state?.errors?.email?.[0]}
                    />

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role Access
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div> */}
                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setShowAddStaffForm(false)}
                            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            {isPending ? 'Adding...' : 'Add Staff'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNewStaff;
