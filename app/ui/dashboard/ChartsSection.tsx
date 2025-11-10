import { Suspense } from 'react';
import ChartsWrapper from './ChartsWrapper';

export default function ChartsSection() {
    return (
        <section className="mt-10 grid grid-cols-1 gap-6">
            <Suspense fallback={<div className="h-64 bg-white rounded-xl shadow-sm" />}>
                <ChartsWrapper />
            </Suspense>
        </section>
    );
}
