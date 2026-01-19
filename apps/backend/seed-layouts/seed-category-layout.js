const { MongoClient } = require("mongodb");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// ============================================================================
// CATEGORY PLACEHOLDER LAYOUT
// ============================================================================
// The mobile app requests /api/layout/category in apps/mobile/app/(tabs)/products.tsx
// If this layout is missing, it logs a 404 error.
// If the layout returns generic sections, it might override the default category view.
// By providing an empty layout, we ensure the API returns 200 OK, 
// and the mobile app's "if (!layout)" or "if (layout.sections.length > 0)" check
// will fail gracefully, causing it to fall back to the default CategoriesScreen as intended.

const categoryLayout = {
    pageSlug: 'category',
    name: 'Placeholder Category Page',
    isActive: true,
    sections: [] // Empty sections to trigger fallback to default UI
};

async function seedCategoryLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(); // Use default DB from URI
        const pageLayoutsCollection = db.collection("pagelayouts");

        // Remove existing if any
        await pageLayoutsCollection.deleteOne({ pageSlug: 'category' });

        // Insert new placeholder
        await pageLayoutsCollection.insertOne(categoryLayout);

        console.log("✅ Category Placeholder Layout Seeded Successfully");

    } catch (error) {
        console.error("❌ Error seeding Category layout:", error);
    } finally {
        await client.close();
        console.log("✅ MongoDB connection closed");
    }
}

seedCategoryLayout();
