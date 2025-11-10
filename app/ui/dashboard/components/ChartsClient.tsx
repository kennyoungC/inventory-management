'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

type TrendPoint = { date: string; additions: number; removals: number };
type CategoryPoint = { category: string; totalStock: number };
type LowStockPoint = { name: string; current: number; minimum: number };
type ExpirationPoint = { week: string; count: number };

type Props = {
    trend: TrendPoint[];
    categories: CategoryPoint[];
    lowStock: LowStockPoint[];
    expirations: ExpirationPoint[];
};

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#9333ea', '#06b6d4'];

export default function ChartsClient({ trend, categories, lowStock, expirations }: Props) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Additions vs Removals */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Additions vs Removals (30d)
                </h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="additions"
                                stroke="#16a34a"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="removals"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Inventory by Category */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Inventory by Category</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip />
                            <Legend />
                            <Pie
                                data={categories}
                                dataKey="totalStock"
                                nameKey="category"
                                outerRadius={90}
                                label
                            >
                                {categories.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Low Stock Products</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={lowStock}
                            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                                height={60}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="current" fill="#2563eb" />
                            <Bar dataKey="minimum" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Upcoming Expirations */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Upcoming Expirations (next 8–9 weeks)
                </h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={expirations}
                            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="week"
                                tick={{ fontSize: 12 }}
                                angle={-15}
                                textAnchor="end"
                                height={50}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#06b6d4" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
