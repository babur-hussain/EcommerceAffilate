const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

async function verifyConnection() {
    const uri = process.env.MONGODB_URI;

    console.log("🔍 Checking database connection...");
    console.log("MONGODB_URI:", uri ? uri.substring(0, 50) + "..." : "NOT SET");

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const dbName = db.databaseName;

        console.log(`\n✅ Connected to database: ${dbName}`);

        // Check if category exists
        const categoriesCollection = db.collection("categories");
        const category = await categoriesCollection.findOne({
            _id: new ObjectId("695ff7de3f61939001a0637e")
        });

        if (category) {
            console.log(`✅ Found category: ${category.name}`);

            // Count subcategories
            const subCount = await categoriesCollection.countDocuments({
                parentCategory: new ObjectId("695ff7de3f61939001a0637e"),
                isActive: true
            });
            console.log(`✅ Subcategories with isActive=true: ${subCount}`);
        } else {
            console.log("❌ Category not found in this database");
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await client.close();
    }
}

verifyConnection();
