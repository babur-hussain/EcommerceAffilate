"use client"

import { useAuth } from "@/context/AuthContext"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading, firebaseUser } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading) {
            if (!firebaseUser && pathname !== "/login") {
                router.push("/login")
            } else if (user) {
                // Role based access control
                const allowedRoles = ['ADMIN', 'BUSINESS_OWNER', 'BUSINESS_MANAGER', 'SELLER_OWNER'];
                if (!allowedRoles.includes(user.role)) {
                    // toast.error("Unauthorized access");
                }
            }
        }
    }, [loading, firebaseUser, user, pathname, router])

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (pathname === "/login") {
        return <>{children}</>
    }

    if (!firebaseUser) {
        return null
    }

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full">
                <Header />
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
