'use client';

import React, { useState } from 'react';
import StaffCard from '../components/Staff/StaffCard';
import { FaPlus, FaTimes, FaUser, FaUserShield } from 'react-icons/fa';
import StaffDetails from '../components/Staff/StaffDetails';
import CreateNewStaff from '../components/Staff/CreateNewStaff';

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
    staffList: Staff[];
};

const StaffMangement = ({ staffList: initialStaffList }: Props) => {
    const [staffList, setStaffList] = useState<Staff[]>(initialStaffList);

    const [selectedRole, setSelectedRole] = useState('all');
    const [showAddStaffForm, setShowAddStaffForm] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
    const [showStaffDetails, setShowStaffDetails] = useState(false);
    const [showEditStaffForm, setShowEditStaffForm] = useState(false);

    // const [editFormData, setEditFormData] = useState({
    //     name: '',
    //     title: '',
    //     email: '',
    //     role: 'staff',
    // });

    // const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    //     setEditFormData(prev => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };

    // const handleEditStaff = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (selectedStaff) {
    //         setStaffList(prevStaff =>
    //             prevStaff.map(staff =>
    //                 staff.id === selectedStaff ? { ...staff, ...editFormData } : staff,
    //             ),
    //         );
    //     }
    //     setShowEditStaffForm(false);
    // };

    const handleAddStaff = (newStaff: Staff) => {
        setStaffList(prev => [...prev, newStaff]);
        setShowAddStaffForm(false);
    };
    const selectedStaffDetails = selectedStaff
        ? staffList.find(staff => staff.id === selectedStaff)
        : null;
    const handleSendPasswordReset = () => {
        alert(`Password reset link sent to ${selectedStaffDetails?.email}`);
    };
    const handleEditClick = () => {
        if (selectedStaffDetails) {
            setEditFormData({
                name: selectedStaffDetails.fullName,
                title: selectedStaffDetails.jobTitle,
                email: selectedStaffDetails.email,
                role: selectedStaffDetails.role,
            });
            setShowEditStaffForm(true);
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
                            handleSendPasswordReset={handleSendPasswordReset}
                            setShowStaffDetails={setShowStaffDetails}
                        />
                    )}
                </div>
            </div>
            {showAddStaffForm && (
                <CreateNewStaff
                    onStaffAdded={handleAddStaff}
                    setShowAddStaffForm={setShowAddStaffForm}
                />
            )}
            {/* {showEditStaffForm && selectedStaffDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Edit Staff Details
                                </h2>
                                <button
                                    onClick={() => setShowEditStaffForm(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                                >
                                    <FaTimes color="grey" />
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleEditStaff} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditFormChange}
                                    placeholder="Enter staff name"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditFormChange}
                                    placeholder="Enter job title"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditFormChange}
                                    placeholder="Enter email address"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role Access
                                </label>
                                <select
                                    name="role"
                                    value={editFormData.role}
                                    onChange={handleEditFormChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditStaffForm(false)}
                                    className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}
        </div>
    );
};
export default StaffMangement;
