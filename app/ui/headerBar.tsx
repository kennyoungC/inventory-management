'use client';

import Image from 'next/image';
import { endSession } from '../lib/actions/session-starter.actions';
import { useEffect, useState } from 'react';

type User = {
    name: string;
    jobTitle: string;
    lastLoggedIn?: string | null;
};

export default function HeaderBar() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetch('/api/session-user')
            .then(res => res.json())
            .then(data => setUser(data.user));
    }, []);

    if (!user) {
        return null;
    }

    return (
        <header className="w-fit justify-end">
            <div className="flex items-center justify-end px-8 py-4 gap-6">
                <div className="flex flex-col items-end">
                    <span className="font-medium text-gray-800">{user.name}</span>
                    <span className="text-sm text-gray-600">{user.jobTitle}</span>
                </div>
                <button
                    onClick={() => endSession()}
                    className="px-4 py-2 bg-white cursor-pointer text-gray-700 text-sm  rounded-lg  duration-200 flex items-center gap-2 "
                >
                    <Image src="/Power.svg" alt="End Session Icon" width={22} height={22} />
                    End Session
                </button>
            </div>
        </header>
    );
}
