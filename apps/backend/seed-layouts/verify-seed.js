const { MongoClient } = require("mongodb");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function verifySeed() {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to:", uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('pagelayouts');

        const layouts = await collection.find({}, { projection: { pageSlug: 1, name: 1 } }).toArray();
        console.log("\nFound Layouts in DB:");
        console.table(layouts);

        const menFashion = await collection.findOne({ pageSlug: 'men-fashion' });
        if (menFashion) {
            console.log("\n✅ 'men-fashion' layout FOUND in database.");
        } else {
            console.error("\n❌ 'men-fashion' layout NOT FOUND in database.");
        }

        const fashion = await collection.findOne({ pageSlug: 'fashion' });
        if (fashion) {
            console.log("\n✅ 'fashion' layout FOUND in database.");
            // Check if actionUrl is updated
            const earlyBird = fashion.sections.find(s => s.id === 'fashion_early_bird');
            if (earlyBird && earlyBird.content.items[0].actionUrl.includes("common-category")) {
                console.log("✅ 'fashion' layout has UPDATED Early Bird URLs.");
            } else {
                console.error("❌ 'fashion' layout has OLD Early Bird URLs.");
            }
        } else {
            console.error("\n❌ 'fashion' layout NOT FOUND in database.");
        }

    } catch (err) {
        console.error("Error verifying seed:", err);
    } finally {
        await client.close();
    }
}

verifySeed();
