import { Suspense } from 'react';
import EndSessionBtn from '../../ui/components/Buttons/EndSessionBtn';
import User from 'app/shared/components/User';

export default function HeaderBar({ title }: { title: string }) {
    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 left-0 w-full z-[40]">
                <div className="flex items-center justify-between px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    <div className="flex items-center gap-6">
                        <Suspense fallback={<div>Loading...</div>}>
                            <User />
                        </Suspense>
                        <EndSessionBtn />
                    </div>
                </div>
            </header>
        </>
    );
}
