'use client';
import { useState } from 'react';
import HeaderBar from '../ui/HeaderBar';
import SideBar from '../ui/SideBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden relative">
            <div className="absolute right-0 top-0">
                <HeaderBar />
            </div>
            <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            <div
                className={`flex-grow p-6 md:overflow-y-auto md:p-12 transition-all duration-300 ${
                    isExpanded ? 'md:ml-64' : 'md:ml-14'
                }`}
            >
                {children}
            </div>
        </div>
    );
}
