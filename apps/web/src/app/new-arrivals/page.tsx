import ProductListingPage from "@/components/common/ProductListingPage";

export default function NewArrivalsPage() {
    return (
        <ProductListingPage
            title="New Arrivals"
            subtitle="Discover the latest additions to our store — fresh styles, trending picks, just landed."
            icon="new_releases"
            apiUrl="/api/products?sort=createdAt&order=desc&limit=40"
            emptyIcon="fiber_new"
            emptyTitle="New arrivals coming soon"
            emptySubtitle="We're adding new products every day. Check back soon!"
        />
    );
}
