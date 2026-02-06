"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, loginWithGoogle } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await login(email, password)
            toast.success("Logged in successfully")
            router.push("/")
        } catch (error) {
            toast.error("Invalid credentials")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle()
            toast.success("Logged in successfully")
            router.push("/")
        } catch (error) {
            toast.error("Google login failed")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
            <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Welcome back to Services Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-zinc-700 dark:border-zinc-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-zinc-700 dark:border-zinc-600"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground dark:bg-zinc-800">Or continue with</span>
                    </div>
                </div>

                <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
                    Google
                </Button>
            </div>
        </div>
    )
}
