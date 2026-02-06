export default async function ServiceDetailsPage(
    props: {
        params: Promise<{ id: string }>
    }
) {
    const params = await props.params;
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Service Details</h2>
            <p className="text-muted-foreground">Viewing service with ID: {params.id}</p>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <p>Service details form will appear here.</p>
            </div>
        </div>
    )
}
