"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash, Loader2 } from "lucide-react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "react-hot-toast"
import { Service } from "@/types"

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    const fetchServices = async () => {
        try {
            setLoading(true)
            const querySnapshot = await getDocs(collection(db, "services"))
            const servicesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Service[]
            setServices(servicesData)
        } catch (error) {
            console.error("Error fetching services:", error)
            toast.error("Failed to load services")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return

        try {
            await deleteDoc(doc(db, "services", id))
            toast.success("Service deleted")
            fetchServices()
        } catch (error) {
            console.error("Error deleting service:", error)
            toast.error("Failed to delete service")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Services</h2>
                    <p className="text-muted-foreground">Manage your services efficiently.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Service
                </Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : services.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No services found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell>${service.price}</TableCell>
                                    <TableCell>{service.categoryId}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${service.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {service.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 text-zinc-500">
                                            <button className="p-2 hover:bg-zinc-100 rounded-full">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-2 hover:bg-zinc-100 rounded-full text-red-500"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
