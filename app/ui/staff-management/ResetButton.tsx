import { resetAccessCode } from '@/app/lib/actions/staff.actions';
import { useActionState } from 'react';
import { FaKey } from 'react-icons/fa';
import Loader from '@/app/ui/components/Loader/Loader';

const ResetButton = ({ staffId }: { staffId: string }) => {
    const resetAccessCodeWithId = resetAccessCode.bind(null, staffId);
    const [state, formAction, isPending] = useActionState(resetAccessCodeWithId, null);

    let buttonText = 'Reset Access-Code';
    if (isPending) {
        buttonText = 'Loading...';
    } else if (state?.success) {
        buttonText = 'Access-Code Sent';
    }

    return (
        <form action={formAction} className="w-full">
            <button
                disabled={isPending || state?.success}
                className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
            >
                {!isPending && !state?.success && <FaKey />}
                {isPending && <Loader />}
                <span>{buttonText}</span>
            </button>
        </form>
    );
};

export default ResetButton;
