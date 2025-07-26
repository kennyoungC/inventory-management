import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Unauthorized Access - Staff Management',
};

const Page = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1
                    className="text-2xl font-bold text-red-600 mb-
4"
                >
                    Unauthorized Access
                </h1>
                <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
                <a href="/dashboard" className="text-blue-500 hover:underline">
                    Go back to Dashboard
                </a>
            </div>
        </div>
    );
};

export default Page;
