'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaUtensils } from 'react-icons/fa';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center space-x-3">
                            <FaUtensils className="text-blue-600 text-2xl" />
                            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                RestaurantHub
                            </span>
                        </div>
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1"></div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/sign-in" data-readdy="true">
                            <button className="px-6 py-2.5 border-2 border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium !rounded-button whitespace-nowrap cursor-pointer">
                                Login
                            </button>
                        </Link>
                        <Link href="/register" data-readdy="true">
                            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg !rounded-button whitespace-nowrap cursor-pointer">
                                Register
                            </button>
                        </Link>
                    </div>
                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2.5 rounded-lg text-blue-600 hover:bg-blue-50 focus:outline-none transition-all duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            {isMenuOpen ? (
                                <FaTimes className="text-2xl" />
                            ) : (
                                <FaBars className="text-2xl" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a
                        href="#features"
                        className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Features
                    </a>
                    <a
                        href="#tech-stack"
                        className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Tech Stack
                    </a>
                    <a
                        href="#features"
                        className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Benefits
                    </a>
                    <a
                        href="#contact"
                        className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Contact
                    </a>
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-5 space-x-3">
                        <Link href="/sign-in" data-readdy="true">
                            <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                                Login
                            </button>
                        </Link>
                        <Link href="/register" data-readdy="true">
                            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                                Register
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
