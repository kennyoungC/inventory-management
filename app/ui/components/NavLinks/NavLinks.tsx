'use client';

import { NavItems } from '@/types/index';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logOut } from '@/actions/sign-in.actions';

const navPages: NavItems[] = [
    {
        name: 'Inventory Management',
        href: '/dashboard/inventory-management',
        icon: '/WarehouseIcon.svg',
    },
    { name: 'Dashboard', href: '/dashboard', icon: '/Dashboard.svg' },
    { name: 'Product Management', href: '/dashboard/product-management', icon: '/Products.svg' },
    { name: 'Staff Management', href: '/dashboard/staff-management', icon: '/Staff.svg' },
    { name: 'Notifications', href: '/dashboard/notifications', icon: '/Notifications.svg' },
    { name: 'Settings', href: '/dashboard/settings', icon: '/Settings.svg' },
];
const NavLinks = ({ count, isAdmin }: { count: number; isAdmin: boolean }) => {
    const pathname = usePathname();

    return (
        <section className="mt-2">
            {navPages.map(item => (
                <Link
                    href={item.href}
                    key={item.href}
                    className={`
            flex items-center w-full px-4 py-3
            hover:bg-blue-50 hover:text-blue-600
            transition-colors duration-200 !rounded-button whitespace-nowrap
            ${pathname === item.href ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}
          `}
                >
                    {item.name === 'Notifications' ? (
                        <div className="relative">
                            <Image src={item.icon} alt={item.name} width={23} height={23} />
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {count}
                            </span>
                        </div>
                    ) : (
                        <Image src={item.icon} alt={item.name} width={23} height={23} />
                    )}

                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.name}
                    </span>
                </Link>
            ))}

            {isAdmin && (
                <button
                    onClick={() => logOut()}
                    className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-50 whitespace-nowrap"
                >
                    <Image src="/Logout.svg" alt="Logout Icon" width={20} height={20} />
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Logout
                    </span>
                </button>
            )}
        </section>
    );
};

export default NavLinks;
