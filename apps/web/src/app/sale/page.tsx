import ProductListingPage from "@/components/common/ProductListingPage";

export default function SalePage() {
    return (
        <ProductListingPage
            title="Sale"
            subtitle="Grab incredible deals — limited-time discounts on top products across all categories."
            icon="local_offer"
            apiUrl="/api/products?onSale=true&limit=40"
            emptyIcon="sell"
            emptyTitle="No sale products right now"
            emptySubtitle="Stay tuned — amazing deals drop regularly!"
        />
    );
}
