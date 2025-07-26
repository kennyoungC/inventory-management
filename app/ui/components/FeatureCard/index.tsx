import { FaCheck } from 'react-icons/fa';
import clsx from 'clsx';

interface Props {
    icon: React.ReactNode;
    title: string;
    description: string;
    features?: string[];
    variant?: 'default' | 'compact';
}

const FeatureCard = ({ icon, title, description, features, variant = 'default' }: Props) => {
    return (
        <div
            className={clsx(
                'rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200',
                variant === 'default' ? 'p-8 bg-gray-50' : 'p-6 bg-white',
            )}
        >
            <div
                className={clsx(
                    'flex items-center justify-center h-12 w-12 rounded-md mb-5',
                    variant === 'default' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600',
                )}
            >
                {icon}
            </div>
            <h3
                className={clsx(
                    'font-bold text-gray-900',
                    variant === 'default' ? 'text-xl' : 'text-lg font-medium',
                )}
            >
                {title}
            </h3>
            <p className="mt-2 text-base text-gray-500">{description}</p>
            {variant === 'default' && features?.length && (
                <ul className="mt-4 space-y-2">
                    {features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                            <FaCheck className="text-green-500 mr-2" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default FeatureCard;
