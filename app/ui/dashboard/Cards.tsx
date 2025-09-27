import { fetchCardData } from '@/data/dashboard';
import { FaBandAid, FaInbox } from 'react-icons/fa';
import { FaClock, FaCodePullRequest } from 'react-icons/fa6';

// const iconMap = {
//     collected: FaBandAid,
//     customers: FaCodePullRequest,
//     pending: FaClock,
//     invoices: FaInbox,
// };

export default async function CardWrapper() {
    const { totalProducts, totalActiveSuppliers, numberOfLowStock, numberOfOutOfStock } =
        await fetchCardData();
    return (
        <>
            <DashboardCard
                title="Total Active Products"
                value={totalProducts}
                unit="items"
                icon={FaBandAid}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-100"
            />
            <DashboardCard
                title="Active Suppliers"
                value={totalActiveSuppliers}
                unit="item(s)"
                icon={FaClock}
                iconColor="text-yellow-600"
                iconBgColor="bg-yellow-100"
            />
            <DashboardCard
                title="Low Stock Products"
                value={numberOfLowStock}
                unit="item(s)"
                icon={FaInbox}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
            />
            <DashboardCard
                title="Out of Stock Products"
                value={numberOfOutOfStock}
                unit="item(s)"
                icon={FaCodePullRequest}
                iconColor="text-red-600"
                iconBgColor="bg-red-100"
            />
        </>
    );
}
type CardProps = {
    title: string;
    value: number | string;
    unit?: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor?: string; // e.g. text-blue-500
    iconBgColor?: string; // e.g. bg-blue-100
};
export function DashboardCard({
    title,
    value,
    unit = '',
    icon: Icon,
    iconColor = 'text-blue-600',
    iconBgColor = 'bg-blue-100',
}: CardProps) {
    return (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <div className="flex items-end gap-1 mt-1">
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {unit && <span className="text-sm text-gray-500 font-medium mb-1">{unit}</span>}
                </div>
            </div>

            {/* Icon Section */}
            <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${iconBgColor}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
        </div>
    );
}
