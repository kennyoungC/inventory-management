import SideBar from '../../shared/components/SideBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden relative">
            <SideBar />
            <main
                className="flex-grow md:overflow-y-auto transition-all duration-300 relative
                    md:ml-14 peer-hover:md:ml-64"
            >
                {children}
            </main>
        </div>
    );
}
