import ProductListingPage from "@/components/common/ProductListingPage";

export default function BestSellersPage() {
    return (
        <ProductListingPage
            title="Best Sellers"
            subtitle="Our most loved products — top picks chosen by thousands of happy customers."
            icon="trending_up"
            apiUrl="/api/products?sort=soldCount&order=desc&limit=40"
            emptyIcon="star"
            emptyTitle="Best sellers coming soon"
            emptySubtitle="Our top products will appear here once we have enough data."
        />
    );
}
