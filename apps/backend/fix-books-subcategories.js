const { MongoClient, ObjectId } = require("mongodb");

async function fixBooksSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // The two Books categories
        const oldParentId = new ObjectId("695f88c75f463eeb3c42e769"); // Has subcategories
        const newParentId = new ObjectId("695ff7de3f61939001a06381"); // Should have subcategories

        // Check subcategories count for both
        const oldCount = await categoriesCollection.countDocuments({ parentCategory: oldParentId });
        const newCount = await categoriesCollection.countDocuments({ parentCategory: newParentId });

        console.log(`\n📊 Current state:`);
        console.log(`   Old Books (${oldParentId}): ${oldCount} subcategories`);
        console.log(`   New Books (${newParentId}): ${newCount} subcategories`);

        if (oldCount > 0) {
            console.log(`\n🔄 Migrating ${oldCount} subcategories to new parent...`);

            const result = await categoriesCollection.updateMany(
                { parentCategory: oldParentId },
                { $set: { parentCategory: newParentId } }
            );

            console.log(`✅ Updated ${result.modifiedCount} subcategories`);

            // Delete the old Books category
            console.log(`\n🗑️  Deleting old Books category...`);
            await categoriesCollection.deleteOne({ _id: oldParentId });
            console.log(`✅ Deleted old category`);

            // Verify final state
            const finalCount = await categoriesCollection.countDocuments({ parentCategory: newParentId });
            console.log(`\n✨ Final state: New Books category has ${finalCount} subcategories`);
        } else {
            console.log(`\n✅ No migration needed, old category has no subcategories`);
        }

    } catch (error) {
        console.error("❌ Error fixing books subcategories:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n✅ Database connection closed");
        process.exit(0);
    }
}

fixBooksSubcategories();
