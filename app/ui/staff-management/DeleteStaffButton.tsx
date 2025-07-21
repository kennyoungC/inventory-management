import { FaTrash } from 'react-icons/fa';

type Props = {
    onDelete: () => void;
};

const DeleteStaffButton = ({ onDelete }: Props) => {
    return (
        <button
            onClick={onDelete}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
        >
            <FaTrash />
            <span>Delete Staff</span>
        </button>
    );
};

export default DeleteStaffButton;
