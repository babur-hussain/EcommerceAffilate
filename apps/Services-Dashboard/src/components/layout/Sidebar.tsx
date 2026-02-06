"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Briefcase,
    ShoppingCart,
    BarChart2,
    Settings,
    LogOut,
    Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Services",
        icon: Briefcase,
        href: "/services",
        color: "text-violet-500",
    },
    {
        label: "Orders",
        icon: ShoppingCart,
        href: "/orders",
        color: "text-pink-700",
    },
    {
        label: "Analytics",
        icon: BarChart2,
        href: "/analytics",
        color: "text-orange-700",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Layers className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Services</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href
                                    ? "text-white bg-white/10"
                                    : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon
                                    className={cn("h-5 w-5 mr-3", route.color)}
                                />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400">
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-500" />
                        Logout
                    </div>
                </div>
            </div>
        </div>
    )
}
