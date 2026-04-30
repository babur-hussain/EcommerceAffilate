"use client"

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { DollarSign, Briefcase, ShoppingBag, TrendingUp } from "lucide-react"
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeServices: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        activeNow: 0
    });
    const [chartData, setChartData] = useState<{ name: string, total: number }[]>([]);
    const [recentSales, setRecentSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Overview Stats
                const overviewRes = await apiClient.get<any>('/api/service-analytics/overview');
                const overview = overviewRes.data;

                setStats({
                    activeServices: overview.approvedProviders || 0,
                    pendingOrders: (overview.totalBookings || 0) - (overview.completedBookings || 0),
                    totalRevenue: overview.totalRevenue || 0,
                    activeNow: overview.totalProviders || 0,
                });

                // Fetch Revenue Over Time for Chart
                const chartRes = await apiClient.get<any>('/api/service-analytics/revenue-over-time');
                setChartData(chartRes.data);

                // Fetch Recent Sales (Completed Bookings)
                const salesRes = await apiClient.get<any>('/api/bookings?limit=5&status=COMPLETED');
                if (salesRes.data && salesRes.data.data) {
                    setRecentSales(salesRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm text-muted-foreground self-center mr-auto md:mr-4 truncate max-w-[150px] md:max-w-none">Welcome, {user?.name || 'Admin'}</span>
                    <Button>Download Report</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Total Revenue</div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">From completed bookings</p>
                </Card>
                <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Active Services</div>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{stats.activeServices}</div>
                    <p className="text-xs text-muted-foreground">Approved Providers</p>
                </Card>
                <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Pending Orders</div>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{stats.pendingOrders}</div>
                    <p className="text-xs text-muted-foreground">Active pending bookings</p>
                </Card>
                <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Total Providers</div>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{stats.activeNow}</div>
                    <p className="text-xs text-muted-foreground">Registered on platform</p>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 md:col-span-2 lg:col-span-4 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Overview</h3>
                    </div>
                    <div className="h-[300px] w-full min-w-0">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">No revenue data available</div>
                        )}
                    </div>
                </Card>
                <Card className="col-span-1 md:col-span-2 lg:col-span-3 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Recent Sales</h3>
                        <p className="text-sm text-muted-foreground">Latest completed bookings</p>
                    </div>
                    <div className="space-y-8">
                        {recentSales.length > 0 ? (
                            recentSales.map((sale) => (
                                <div key={sale._id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {sale.userId?.firstName} {sale.userId?.lastName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {sale.userId?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        +${sale.payment?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground">No recent sales found.</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
