import { formatDate } from '@/utils/formatDate';
import { FaEdit, FaEnvelope, FaTimes } from 'react-icons/fa';
import DeleteStaffButton from './DeleteStaffButton';
import ResetButton from './ResetButton';
import { StaffModel } from '@/types/index';

type Props = {
    selectedStaffDetails: StaffModel;
    onCloseStaffDetails: () => void;
    handleEditClick: () => void;
    onDelete: (staffId: string) => void;
};

const StaffDetails = ({
    selectedStaffDetails,
    onCloseStaffDetails,
    handleEditClick,
    onDelete,
}: Props) => {
    return (
        <div className="fixed right-0 top-16 h-screen w-[400px] bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 z-30">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-xl font-bold text-gray-800">Staff Details</h2>
                    <button
                        onClick={onCloseStaffDetails}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <FaTimes size={24} className="cursor-pointer" color="gray" />
                    </button>
                </div>
            </div>
            <div className="p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                        {selectedStaffDetails.fullName}
                    </h3>
                    <p className="text-gray-500">{selectedStaffDetails.jobTitle}</p>
                </div>
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">
                            Contact Information
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FaEnvelope color="gray" />
                                <span className="ml-3 text-gray-800">
                                    {selectedStaffDetails.email}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">Role & Access</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Role Level</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${selectedStaffDetails.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                                >
                                    {selectedStaffDetails.role === 'admin' ? 'Admin' : 'Staff'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                {selectedStaffDetails.isActive ? (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        Inactive
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Last Login</span>
                                <span className="text-gray-800 text-sm">
                                    {formatDate(selectedStaffDetails.lastLoginAt, true)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button
                            disabled
                            id="edit-staff-details-button"
                            onClick={handleEditClick}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                        >
                            <FaEdit />
                            <span>Edit Staff Details</span>
                        </button>
                        <ResetButton staffId={selectedStaffDetails.id} />
                        <DeleteStaffButton onDelete={() => onDelete(selectedStaffDetails.id)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDetails;
