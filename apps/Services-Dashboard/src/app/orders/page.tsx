export default function OrdersPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            <p className="text-muted-foreground">Manage your service orders here.</p>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="font-semibold leading-none tracking-tight">Recent Orders</h3>
                </div>
                <div className="p-6 pt-0">
                    <p className="text-sm text-muted-foreground">No orders yet.</p>
                </div>
            </div>
        </div>
    )
}
