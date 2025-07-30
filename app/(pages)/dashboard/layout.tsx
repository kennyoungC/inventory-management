'use client';
import { useState } from 'react';
import SideBar from '../../ui/SideBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden relative">
            <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            <div
                className={`flex-grow md:overflow-y-auto transition-all duration-300 relative ${
                    isExpanded ? 'md:ml-64' : 'md:ml-14'
                }`}
            >
                {children}
            </div>
        </div>
    );
}
