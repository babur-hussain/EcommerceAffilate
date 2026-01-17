const { MongoClient, ObjectId } = require("mongodb");

async function fixHomeCategory() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);
    const correctId = "695ff7de3f61939001a0637e";
    const oldId = "695f88c75f463eeb3c42e766";

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Delete the old Home & Kitchen category
        console.log(`\n🗑️  Deleting old Home & Kitchen category (${oldId})...`);
        await categoriesCollection.deleteOne({ _id: new ObjectId(oldId) });
        console.log('✅ Deleted old category');

        // Delete old subcategories
        console.log(`\n🗑️  Deleting old subcategories...`);
        const deleteResult = await categoriesCollection.deleteMany({
            parentCategory: new ObjectId(oldId)
        });
        console.log(`✅ Deleted ${deleteResult.deletedCount} old subcategories`);

        // Update the correct category to have the slug
        console.log(`\n🔧 Updating correct category (${correctId}) with slug...`);
        await categoriesCollection.updateOne(
            { _id: new ObjectId(correctId) },
            {
                $set: {
                    slug: "home-kitchen",
                    isActive: true
                }
            }
        );
        console.log('✅ Updated category with slug');

        // Verify
        const verifyCategory = await categoriesCollection.findOne({ slug: "home-kitchen" });
        console.log(`\n✅ Verification: Category "${verifyCategory.name}" (${verifyCategory._id})`);

        const verifySubcategories = await categoriesCollection.countDocuments({
            parentCategory: new ObjectId(correctId),
            isActive: true
        });
        console.log(`✅ Subcategories: ${verifySubcategories}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

fixHomeCategory();
