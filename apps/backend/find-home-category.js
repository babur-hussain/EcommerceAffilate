const { MongoClient } = require("mongodb");

async function findHomeCategory() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Find all categories with "home" in the name
        const homeCategories = await categoriesCollection.find({
            name: { $regex: /home/i }
        }).toArray();

        console.log("\n📋 Found Home categories:");
        homeCategories.forEach(cat => {
            console.log(`  ID: ${cat._id}`);
            console.log(`  Name: ${cat.name}`);
            console.log(`  Slug: ${cat.slug}`);
            console.log(`  Parent: ${cat.parentCategory || 'None'}`);
            console.log('---');
        });

        // Also list all top-level categories
        const topCategories = await categoriesCollection.find({
            parentCategory: { $exists: false }
        }).toArray();

        console.log("\n📋 All top-level categories:");
        topCategories.forEach(cat => {
            console.log(`  ${cat.name} (${cat._id})`);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

findHomeCategory();
