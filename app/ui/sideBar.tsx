"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface SideBarProps {
    Page: string;
}

export default function SideBar({ Page }: SideBarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const navPages = [
        {
            name: "Inventory Management",
            href: "/inventory-management",
            icon: "./WarehouseIcon.svg"
        },
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: "./Dashboard.svg"
        },
        {
            name: "Product Management",
            href: "/product-management",
            icon: "./Products.svg"
        }, 
        {
            name: "Staff Management",
            href: "/staff-management",
            icon: "./Staff.svg"
        },
        {
            name: "Notifications",
            href: "/notifications",
            icon: "./Notifications.svg"
        },
        {
            name: "Settings",
            href: "/settings",
            icon: "./Settings.svg"
        }
    ];

    return (
        <div 
            className={`${isExpanded ? 'w-64' : 'w-14'} hover:w-64 h-screen overflow-hidden bg-white shadow-xl transition-all duration-300 group`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="p-4 border-gray-100">
                <h1 className={`text-xl font-bold whitespace-nowrap opacity-0 ${isExpanded ? 'opacity-100' : ''} group-hover:opacity-100 transition-opacity duration-300 `}>
                    RestaurantHub
                </h1>
            </div>
            <section className="mt-2">
                {navPages.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 whitespace-nowrap ${Page === item.href.substring(1) ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} hover:bg-gray-50`}
                    >
                        <Image src={item.icon} alt={item.name} width={23} height={23} />
                        <span className={`ml-3 opacity-0 ${isExpanded ? 'opacity-100' : ''} group-hover:opacity-100 transition-opacity duration-300`}>
                            {item.name}
                        </span>
                    </Link>
                ))}
                <Link
                    href="/logout"
                    className="flex items-center px-4 py-3 mt-4 text-red-500 hover:bg-red-50 whitespace-nowrap"
                >
                    <Image src='./Logout.svg' alt='Logout Icon' width={20} height={20} />
                    <span className={`ml-3 opacity-0 ${isExpanded ? 'opacity-100' : ''} group-hover:opacity-100 transition-opacity duration-300 `}>
                        Logout
                    </span>
                </Link>
            </section>
        </div>
    );
}
