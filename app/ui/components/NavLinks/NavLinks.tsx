// 'use client';

import { NavItems } from '@/types/index';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { logOut } from '@/actions/sign-in.actions';

type Props = {
    isExpanded: boolean;
};

const navPages = [
    {
        name: 'Inventory Management',
        href: '/dashboard/inventory-management',
        icon: '/WarehouseIcon.svg',
    },
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: '/Dashboard.svg',
    },
    {
        name: 'Product Management',
        href: '/dashboard/product-management',
        icon: '/Products.svg',
    },
    {
        name: 'Staff Management',
        href: '/dashboard/staff-management',
        icon: '/Staff.svg',
    },
    {
        name: 'Notifications',
        href: '/dashboard/notifications',
        icon: '/Notifications.svg',
    },
    {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: '/Settings.svg',
    },
];

const NavLinks = ({ isExpanded }: Props) => {
    const pathname = usePathname();

    return (
        <section className="mt-2">
            {navPages.map((item: NavItems) => (
                <button
                    key={item.href}
                    className={`flex items-center w-full px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ${pathname === item.href ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} hover:bg-gray-50`}
                >
                    {item.name === 'Notifications' ? (
                        <div className="relative">
                            <Image src={item.icon} alt={item.name} width={23} height={23} />
                            <span
                                className={`absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center`}
                            >
                                2
                            </span>
                        </div>
                    ) : (
                        <Image src={item.icon} alt={item.name} width={23} height={23} />
                    )}

                    <Link
                        href={item.href}
                        className={`ml-3 opacity-0 ${isExpanded ? 'opacity-100' : ''} group-hover:opacity-100 transition-opacity duration-300`}
                    >
                        {item.name}
                    </Link>
                </button>
            ))}
            {/* <button
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ${currentPage === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
                <div className="relative">
                    <i
                        className={`fas fa-bell w-6 ${currentPage === 'notifications' ? 'text-blue-600' : 'text-gray-500'}`}
                    ></i>
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <a
                    href="https://readdy.ai/home/2b8c1708-31ee-4011-8cbd-fc8bee8bceb3/f2ed7a2d-3b39-4238-b966-5a0353188719"
                    data-readdy="true"
                    className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    Notifications
                </a>
            </button> */}
            <button
                onClick={() => logOut()}
                className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-50 whitespace-nowrap"
            >
                <Image src="/Logout.svg" alt="Logout Icon" width={20} height={20} />

                <span
                    className={`ml-3 opacity-0 ${isExpanded ? 'opacity-100' : ''} group-hover:opacity-100 transition-opacity duration-300 `}
                >
                    Logout
                </span>
            </button>
        </section>
    );
};

export default NavLinks;
