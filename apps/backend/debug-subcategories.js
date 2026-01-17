const { MongoClient, ObjectId } = require("mongodb");

async function debugSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Find ALL subcategories without any filter
        const allSubcategories = await categoriesCollection.find({
            name: { $in: ["Sofas & Couches", "Coffee Tables", "Beds"] }
        }).toArray();

        console.log(`\n📋 Sample subcategories found: ${allSubcategories.length}`);

        if (allSubcategories.length > 0) {
            allSubcategories.forEach(sub => {
                console.log(`\n${sub.name}:`);
                console.log(`  _id: ${sub._id}`);
                console.log(`  parentCategory: ${sub.parentCategory} (type: ${typeof sub.parentCategory})`);
                console.log(`  isActive: ${sub.isActive}`);
            });
        }

        // Try to find the parent category
        console.log('\n\n🔍 Looking for parent category...');
        const parent1 = await categoriesCollection.findOne({ _id: new ObjectId("695ff7de3f61939001a0637e") });
        console.log('By ObjectId:', parent1 ? parent1.name : 'Not found');

        const parent2 = await categoriesCollection.findOne({ slug: "home-kitchen" });
        console.log('By slug:', parent2 ? `${parent2.name} (${parent2._id})` : 'Not found');

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

debugSubcategories();
