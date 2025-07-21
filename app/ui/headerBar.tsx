'use client';

import Image from 'next/image';
import { endSession } from '../lib/actions/session-starter.actions';
import { useEffect, useState } from 'react';

type User = {
    name: string;
    jobTitle: string;
    lastLoggedIn?: string | null;
};

export default function HeaderBar({ title }: { title: string }) {
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
        <header className="bg-white shadow-sm sticky top-0 left-0 w-full z-10">
            <div className="flex items-center justify-between px-8 py-4">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{user.name}</span>
                        <span className="text-sm text-gray-600">{user.jobTitle}</span>
                    </div>
                    <button
                        onClick={() => endSession()}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 !rounded-button whitespace-nowrap cursor-pointer border border-gray-200"
                    >
                        <Image src="/Power.svg" alt="End Session Icon" width={22} height={22} />
                        End Session
                    </button>
                </div>
            </div>
        </header>
    );
}
