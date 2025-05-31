import Image from 'next/image';
import Link from 'next/link';

export default function HeaderBar() {
    return (
        <header className="w-fit justify-end">
            <div className="flex items-center justify-end px-8 py-4 gap-6">
                <div className="flex flex-col items-end">
                    <span className="font-medium text-gray-800">John Smith</span>
                    <span className="text-sm text-gray-600">Kitchen Manager</span>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 bg-white text-gray-700 text-sm  rounded-lg  duration-200   flex items-center gap-2 "
                >
                    <Image src="/Power.svg" alt="End Session Icon" width={22} height={22} />
                    End Session
                </Link>
            </div>
        </header>
    );
}
