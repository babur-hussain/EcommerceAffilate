const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const homeCategoryId = "695ff7de3f61939001a0637e";

async function deleteAndReseed() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Delete ALL subcategories with these names
        const subcategoryNames = [
            "Sofas & Couches", "Coffee Tables", "TV Units", "Recliners", "Bookshelves",
            "Beds", "Wardrobes", "Mattresses", "Bedside Tables", "Dressers",
            "Dining Tables", "Dining Chairs", "Bar Stools", "Crockery Units",
            "Curtains & Blinds", "Cushions & Covers", "Wall Art", "Mirrors", "Rugs & Carpets",
            "Ceiling Lights", "Table Lamps", "Floor Lamps", "Wall Lights",
            "Shoe Racks", "Storage Boxes", "Cabinets", "Shelving Units"
        ];

        console.log("\n🗑️  Deleting existing subcategories...");
        const deleteResult = await categoriesCollection.deleteMany({
            name: { $in: subcategoryNames }
        });
        console.log(`✅ Deleted ${deleteResult.deletedCount} subcategories`);

        console.log("\n✅ Now run: node seed-home-subcategories.js");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await client.close();
    }
}

deleteAndReseed();
