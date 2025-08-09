'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteStaff } from '@/actions/staff.actions';
import { StaffModel } from '@/types/index';
import { FaPlus, FaUser } from 'react-icons/fa';
import StaffCard from './StaffCard';
import StaffDetails from './StaffDetails';
import CreateNewStaff from './CreateNewStaff';

type Props = {
    staffList: StaffModel[];
};

const MainContent = ({ staffList: initialStaffList }: Props) => {
    const [selectedRole, setSelectedRole] = useState('all');
    const [staffList, setStaffList] = useState(initialStaffList);
    const [showAddStaffForm, setShowAddStaffForm] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const [showStaffDetails, setShowStaffDetails] = useState(false);

    const selectedStaffDetails = useMemo(() => {
        return selectedStaffId ? staffList.find(staff => staff.id === selectedStaffId) : null;
    }, [selectedStaffId, staffList]);

    const handleEditClick = () => {
        if (selectedStaffDetails) {
            // setShowEditStaffForm(true);
        }
    };

    const handleCloseDetails = () => {
        setShowStaffDetails(false);
        setSelectedStaffId(null);
        setShowAddStaffForm(false);
    };

    useEffect(() => {
        if (initialStaffList) {
            setStaffList(initialStaffList);
        }
    }, [initialStaffList]);

    const handleDelete = async (staffId: string) => {
        const prevList = staffList;
        setStaffList(list => list.filter(staff => staff.id !== staffId));

        const result = await deleteStaff(staffId);

        if (result?.success && result?.message) {
            toast.success(result.message);
            handleCloseDetails();
        } else {
            toast.error(result?.message || 'Failed to delete staff member');
            setStaffList(prevList);
        }
    };
    return (
        <div>
            {' '}
            <div className="flex-1 overflow-hidden flex flex-col">
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
                        {staffList && staffList.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                {staffList.map(staff => (
                                    <div
                                        key={staff.id}
                                        onClick={() => {
                                            setSelectedStaffId(staff.id);
                                            setShowStaffDetails(true);
                                        }}
                                        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${selectedStaffId === staff.id ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <StaffCard staff={staff} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {staffList && staffList.length === 0 && (
                            <div className="flex items-center justify-center mt-16">
                                <p className="text-gray-500 text-2xl">
                                    No staff have been added yet. Click “Add New Staff” to get
                                    started
                                </p>
                            </div>
                        )}
                    </div>
                    {showStaffDetails && selectedStaffDetails && (
                        <StaffDetails
                            onDelete={handleDelete}
                            selectedStaffDetails={selectedStaffDetails}
                            handleEditClick={handleEditClick}
                            onCloseStaffDetails={handleCloseDetails}
                        />
                    )}
                </div>
            </div>
            {showAddStaffForm && <CreateNewStaff onCloseStaffDetails={handleCloseDetails} />}
        </div>
    );
};

export default MainContent;
