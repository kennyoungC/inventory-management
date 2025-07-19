import { deleteStaff } from '@/app/lib/actions/staff.actions';
import React, { useActionState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import Loader from '@/app/ui/components/Loader/Loader';

type Props = {
    staffId: string;
    setShowStaffDetails: (show: boolean) => void;
};

const DeleteStaffButton = ({ staffId, setShowStaffDetails }: Props) => {
    const deleteStaffBindWithId = deleteStaff.bind(null, staffId);
    const [state, formAction, isPending] = useActionState(deleteStaffBindWithId, null);

    useEffect(() => {
        if (state?.success) {
            setShowStaffDetails(false);
        }
    }, [state?.success, setShowStaffDetails]);
    return (
        <form action={formAction} className="w-full">
            <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2">
                {isPending ? (
                    <>
                        <Loader />
                        <span>Delete Staff...</span>
                    </>
                ) : (
                    <>
                        <FaTrash />
                        <span>Delete Staff</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default DeleteStaffButton;
