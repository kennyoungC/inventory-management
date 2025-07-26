import Image from 'next/image';
import HomepageImg from 'public/homepage-banner.jpg';
import Navbar from '@/components/Navbar';
import {
    FaBell,
    FaBoxes,
    FaChartLine,
    FaCode,
    FaDatabase,
    FaLock,
    FaUsersCog,
} from 'react-icons/fa';
import FeatureCard from '@/components/FeatureCard';
import ContactUsForm from '@/components/ContactUsForm';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
            {/* Navigation Bar */}
            <Navbar />
            {/* Hero Section */}
            <div className="relative pt-16 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-1/2 lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block">Restaurant Inventory</span>
                                    <span className="block text-blue-600">Management System</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Streamline your restaurant operations with our comprehensive
                                    inventory and product management system. Built for speed,
                                    clarity, and control in high-pressure kitchen environments.
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <Image
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src={HomepageImg}
                        alt="Modern restaurant management system interface"
                        priority
                    />
                </div>
            </div>
            {/* Tech Stack Section */}
            <section id="tech-stack" className="py-16 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Powered by Modern Technology
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            Our system is built with scalability and performance in mind, using the
                            latest technologies.
                        </p>
                    </div>
                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <FeatureCard
                                icon={<FaDatabase className="text-xl" />}
                                title="MongoDB"
                                description="Flexible document database that scales with your business, providing fast queries and real-time data access."
                                features={[
                                    'Scalable data storage',
                                    'Fast query performance',
                                    'Flexible document model',
                                ]}
                            />
                            <FeatureCard
                                icon={<FaCode className="text-xl" />}
                                title="Next.js"
                                description="React framework that enables server-side rendering and static site generation for optimal performance."
                                features={[
                                    'Server-side rendering',
                                    'Fast page loads',
                                    'Optimized performance',
                                ]}
                            />
                            <FeatureCard
                                icon={<FaLock className="text-xl" />}
                                title="Auth.js"
                                description="Secure authentication system with role-based access control to protect your restaurant's data."
                                features={[
                                    'Role-based access',
                                    'Secure authentication',
                                    'Multiple auth providers',
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>
            {/* Features Section */}
            <section id="features" className="py-16 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Key Features
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            Designed with restaurant operations in mind, our system offers
                            everything you need to manage inventory efficiently.
                        </p>
                    </div>
                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <FeatureCard
                                variant="compact"
                                icon={<FaBoxes className="text-xl" />}
                                title="Inventory Tracking"
                                description="Real-time monitoring of stock levels with automatic alerts for low inventory items."
                            />
                            <FeatureCard
                                variant="compact"
                                icon={<FaUsersCog className="text-xl" />}
                                title="Role-Based Access"
                                description="Customized views and permissions for super admins, managers, and staff members."
                            />
                            <FeatureCard
                                variant="compact"
                                icon={<FaChartLine className="text-xl" />}
                                title="Real-time Monitoring"
                                description="Track usage patterns, expiration dates, and inventory turnover in real-time."
                            />
                            <FeatureCard
                                variant="compact"
                                icon={<FaBell className="text-xl" />}
                                title="Automated Alerts"
                                description="Get notified about low stock, expiring items, and unusual inventory movements."
                            />
                        </div>
                    </div>
                </div>
            </section>
            {/* Contact Form Section */}
            <section id="contact" className="bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            <span className="block">Let&apos;s Talk About Your Business</span>
                            <span className="block text-blue-200 mt-2">
                                Our system is here to help you succeed
                            </span>
                        </h2>
                    </div>
                    <ContactUsForm />
                </div>
            </section>
            {/* Footer */}
            <footer className="bg-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <i className="fas fa-utensils text-white text-2xl mr-2"></i>
                            <span className="font-bold text-xl text-white">RestaurantHub</span>
                        </div>
                        <p className="text-gray-300 text-base">
                            &copy; 2025 RestaurantHub. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default HomePage;
