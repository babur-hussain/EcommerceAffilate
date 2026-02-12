"use client"

import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeServices: 0,
        pendingOrders: 0,
        totalRevenue: 45231.89
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Only run firebase calls if initialized properly
                // For now wrapped in try-catch to avoid breaking if firebase config is missing
                if (typeof window !== 'undefined') {
                    const servicesColl = collection(db, "services");
                    const snapshot = await getCountFromServer(servicesColl);
                    const activeServices = snapshot.data().count;
                    setStats(prev => ({ ...prev, activeServices }));
                }
            } catch (e) {
                console.error("Failed to fetch stats", e);
            }
        }
        fetchStats();
    }, []);

    const data = [
        { name: 'Jan', total: 1200 },
        { name: 'Feb', total: 2100 },
        { name: 'Mar', total: 1800 },
        { name: 'Apr', total: 2400 },
        { name: 'May', total: 3200 },
        { name: 'Jun', total: 3800 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground self-center mr-4">Welcome, {user?.name}</span>
                    <Button>Download Report</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Total Revenue</div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </Card>
                <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Active Services</div>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{stats.activeServices}</div>
                    <p className="text-xs text-muted-foreground">Live from Firestore</p>
                </Card>
                <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Pending Orders</div>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                </Card>
                <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Active Now</div>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Overview</h3>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
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
                    </div>
                </Card>
                <Card className="col-span-3 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Recent Sales</h3>
                        <p className="text-sm text-muted-foreground">You made 265 sales this month.</p>
                    </div>
                    <div className="space-y-8">
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                            </div>
                            <div className="ml-auto font-medium">+$1,999.00</div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                            </div>
                            <div className="ml-auto font-medium">+$39.00</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
