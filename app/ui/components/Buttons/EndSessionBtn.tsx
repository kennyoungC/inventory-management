'use client';

import { endSession } from '@/actions/session-starter.actions';
import Image from 'next/image';
import React from 'react';

const EndSessionBtn = () => {
    return (
        <form action={endSession}>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 !rounded-button whitespace-nowrap cursor-pointer border border-gray-200">
                <Image src="/Power.svg" alt="End Session Icon" width={22} height={22} />
                End Session
            </button>
        </form>
    );
};

export default EndSessionBtn;
