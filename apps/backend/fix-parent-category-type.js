const { MongoClient, ObjectId } = require("mongodb");

async function fixParentCategoryType() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);
    const homeCategoryId = "695ff7de3f61939001a0637e";

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Find subcategories with string parentCategory
        const subcategories = await categoriesCollection.find({
            parentCategory: homeCategoryId  // String comparison
        }).toArray();

        console.log(`\n📋 Found ${subcategories.length} subcategories with string parentCategory`);

        if (subcategories.length > 0) {
            console.log("\n🔧 Converting parentCategory from string to ObjectId...");

            const result = await categoriesCollection.updateMany(
                { parentCategory: homeCategoryId },
                {
                    $set: {
                        parentCategory: new ObjectId(homeCategoryId),
                        isActive: true
                    }
                }
            );

            console.log(`✅ Updated ${result.modifiedCount} subcategories`);

            // Verify the fix
            const verifyCount = await categoriesCollection.countDocuments({
                parentCategory: new ObjectId(homeCategoryId),
                isActive: true
            });
            console.log(`\n✅ Verification: ${verifyCount} subcategories now have ObjectId parentCategory`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

fixParentCategoryType();
