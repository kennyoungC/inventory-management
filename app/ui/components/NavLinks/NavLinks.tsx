// 'use client';

import { NavItems } from '@/app/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { logOut } from '@/app/lib/actions/sign-in.actions';

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
                <Link
                    key={item.href}
                    href={item?.href}
                    className={`flex items-center px-4 py-3 whitespace-nowrap ${pathname === item.href ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} hover:bg-gray-50`}
                >
                    <Image src={item.icon} alt={item.name} width={23} height={23} />
                    <span
                        className={`ml-3 opacity-0 ${isExpanded ? 'opacity-100' : ''} group-hover:opacity-100 transition-opacity duration-300`}
                    >
                        {item.name}
                    </span>
                </Link>
            ))}

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
