const { MongoClient, ObjectId } = require("mongodb");

async function checkSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);
    const homeCategoryId = "695ff7de3f61939001a0637e";

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Find all subcategories for Home & Kitchen
        const subcategories = await categoriesCollection.find({
            parentCategory: new ObjectId(homeCategoryId)
        }).toArray();

        console.log(`\n📋 Found ${subcategories.length} subcategories for Home & Kitchen`);

        if (subcategories.length > 0) {
            console.log("\nFirst subcategory:");
            console.log(JSON.stringify(subcategories[0], null, 2));

            // Check if isActive field exists
            const withoutIsActive = subcategories.filter(sub => sub.isActive === undefined);
            console.log(`\n⚠️  ${withoutIsActive.length} subcategories missing isActive field`);

            if (withoutIsActive.length > 0) {
                console.log("\n🔧 Updating subcategories to set isActive: true");
                const result = await categoriesCollection.updateMany(
                    { parentCategory: new ObjectId(homeCategoryId) },
                    { $set: { isActive: true } }
                );
                console.log(`✅ Updated ${result.modifiedCount} subcategories`);
            }
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

checkSubcategories();
