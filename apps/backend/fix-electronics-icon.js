const { MongoClient } = require("mongodb");

async function fixElectronicsIcon() {
    const uri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Find the Electronics category
        const electronics = await categoriesCollection.findOne({ name: "Electronics" });

        if (electronics) {
            console.log("📱 Found Electronics category:");
            console.log("   Current icon:", electronics.icon);

            // Update the icon to the correct emoji
            const result = await categoriesCollection.updateOne(
                { name: "Electronics" },
                { $set: { icon: "📱" } }
            );

            console.log(`✅ Updated ${result.modifiedCount} category`);
            console.log("   New icon: 📱");
        } else {
            console.log("❌ Electronics category not found");
        }
    } catch (error) {
        console.error("❌ Error fixing icon:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n✅ Database connection closed");
        process.exit(0);
    }
}

fixElectronicsIcon();
