import { getCurrentSessionUser } from '@/actions/current-session-user.actions';

export default async function User() {
    const user = await getCurrentSessionUser();

    if (!user) return null;

    return (
        <div className="flex flex-col max-w-[160px]">
            <span className="font-medium text-gray-800 truncate">{user.name}</span>
            <span className="text-sm text-gray-600 truncate">{user?.jobTitle}</span>
        </div>
    );
}
