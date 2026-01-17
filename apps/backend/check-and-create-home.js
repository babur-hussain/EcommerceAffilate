const { MongoClient, ObjectId } = require("mongodb");

async function checkAndCreateHomeCategory() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);
    const targetId = "695ff7de3f61939001a0637e";

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Check if category with this ID exists
        const existingCategory = await categoriesCollection.findOne({ _id: new ObjectId(targetId) });

        if (existingCategory) {
            console.log(`✅ Category found: ${existingCategory.name} (${existingCategory._id})`);
        } else {
            console.log(`❌ Category with ID ${targetId} not found`);
            console.log("\n📋 All top-level categories:");
            const topCategories = await categoriesCollection.find({
                parentCategory: { $exists: false }
            }).toArray();

            topCategories.forEach(cat => {
                console.log(`  ${cat.name} - ID: ${cat._id}`);
            });

            // Create the Home & Kitchen category with the specified ID
            console.log(`\n🔨 Creating Home & Kitchen category with ID: ${targetId}`);
            const result = await categoriesCollection.insertOne({
                _id: new ObjectId(targetId),
                name: "Home & Kitchen",
                slug: "home-kitchen",
                icon: "🏠",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Created category: ${result.insertedId}`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

checkAndCreateHomeCategory();
