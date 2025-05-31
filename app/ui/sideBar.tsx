import NavLinks from './components/NavLinks/NavLinks';

type SideBarProps = {
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
};

export default function SideBar({ isExpanded, setIsExpanded }: SideBarProps) {
    return (
        <div
            className={`${isExpanded ? 'w-64' : 'w-14'} h-screen overflow-hidden bg-white shadow-xl transition-all duration-300 fixed`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="p-4 border-gray-100">
                <h1
                    className={`text-xl font-bold whitespace-nowrap opacity-0 ${isExpanded ? 'opacity-100' : ''} group-hover:opacity-100 transition-opacity duration-300`}
                >
                    RestaurantHub
                </h1>
            </div>
            <NavLinks isExpanded={isExpanded} />
        </div>
    );
}
