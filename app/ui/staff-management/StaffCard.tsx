import { StaffModel } from '@/types/index';
import { formatDate } from '@/utils/formatDate';
import { FaClock, FaEnvelope } from 'react-icons/fa';

type Prop = {
    staff: StaffModel;
};

const StaffCard = ({ staff }: Prop) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{staff.fullName}</h3>
                    <p className="text-gray-500">{staff.jobTitle}</p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${staff.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                >
                    {staff.role === 'admin' ? 'Admin' : 'Staff'}
                </span>
            </div>
            <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                    <FaEnvelope color="gray" />
                    <span className="ml-2 text-sm">{staff.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FaClock color="gray" />
                    <span className="ml-2 text-sm">
                        Last login: {formatDate(staff.lastLoginAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StaffCard;
