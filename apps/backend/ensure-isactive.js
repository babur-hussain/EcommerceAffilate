const { MongoClient, ObjectId } = require("mongodb");

async function ensureIsActive() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);
    const correctId = "695ff7de3f61939001a0637e";

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Check current state
        const allSubs = await categoriesCollection.find({
            parentCategory: new ObjectId(correctId)
        }).toArray();

        console.log(`\n📋 Found ${allSubs.length} subcategories`);

        if (allSubs.length > 0) {
            console.log('\nFirst 3 subcategories:');
            allSubs.slice(0, 3).forEach(sub => {
                console.log(`  ${sub.name}: isActive = ${sub.isActive}`);
            });

            // Update ALL to have isActive: true
            console.log('\n🔧 Setting isActive: true on all subcategories...');
            const result = await categoriesCollection.updateMany(
                { parentCategory: new ObjectId(correctId) },
                { $set: { isActive: true } }
            );
            console.log(`✅ Modified ${result.modifiedCount} documents`);

            // Verify with the same query the API uses
            const apiQuery = await categoriesCollection.find({
                parentCategory: new ObjectId(correctId),
                isActive: true
            }).toArray();

            console.log(`\n✅ API query result: ${apiQuery.length} subcategories`);
            if (apiQuery.length > 0) {
                console.log(`   First: ${apiQuery[0].name}`);
            }
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

ensureIsActive();
