'use client';

import React, { useMemo, useState } from 'react';
import StaffCard from './StaffCard';
import { FaPlus, FaUser } from 'react-icons/fa';
import StaffDetails from './StaffDetails';
import CreateNewStaff from './CreateNewStaff';
import type { StaffModel } from '@/app/lib/types';

type Props = {
    staffList: StaffModel[];
};

const StaffMangement = ({ staffList }: Props) => {
    const [selectedRole, setSelectedRole] = useState('all');
    const [showAddStaffForm, setShowAddStaffForm] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
    const [showStaffDetails, setShowStaffDetails] = useState(false);

    const selectedStaffDetails = useMemo(() => {
        return selectedStaff ? staffList.find(staff => staff.id === selectedStaff) : null;
    }, [selectedStaff, staffList]);

    const handleEditClick = () => {
        if (selectedStaffDetails) {
            // setShowEditStaffForm(true);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 overflow-hidden flex flex-col">
                <header>
                    <div className="flex items-center justify-between px-8 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Staff Management System
                            </h1>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-hidden flex">
                    <div
                        className={`flex-1 overflow-y-auto px-8 pb-8 transition-all duration-300 ${showStaffDetails ? 'mr-[400px]' : ''}`}
                    >
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    disabled
                                    onClick={() => setSelectedRole('all')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors cursor-default duration-200 !rounded-button whitespace-nowrap  ${selectedRole === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <FaUser />
                                    <span>All Staff</span>
                                </button>
                                {/* <button
                                    onClick={() => setSelectedRole('admin')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ${selectedRole === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <FaUserShield />
                                    <span>Admin</span>
                                </button>
                                <button
                                    onClick={() => setSelectedRole('staff')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ${selectedRole === 'staff' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <FaUser />
                                    <span>Staff</span>
                                </button> */}
                            </div>
                            <button
                                onClick={() => setShowAddStaffForm(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ml-4"
                            >
                                <FaPlus />
                                <span>Add New Staff</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {staffList.map(staff => (
                                <div
                                    key={staff.id}
                                    onClick={() => {
                                        setSelectedStaff(staff.id);
                                        setShowStaffDetails(true);
                                    }}
                                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${selectedStaff === staff.id ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    <StaffCard staff={staff} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {showStaffDetails && selectedStaffDetails && (
                        <StaffDetails
                            selectedStaffDetails={selectedStaffDetails}
                            handleEditClick={handleEditClick}
                            setShowStaffDetails={setShowStaffDetails}
                        />
                    )}
                </div>
            </div>
            {showAddStaffForm && <CreateNewStaff setShowAddStaffForm={setShowAddStaffForm} />}
        </div>
    );
};
export default StaffMangement;
