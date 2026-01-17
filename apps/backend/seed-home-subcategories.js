const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const homeCategoryId = "695ff7de3f61939001a0637e";

const subcategories = [
    // Living Room
    { name: "Sofas & Couches", group: "Living Room", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80" },
    { name: "Coffee Tables", group: "Living Room", image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=400&q=80" },
    { name: "TV Units", group: "Living Room", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80" },
    { name: "Recliners", group: "Living Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80" },
    { name: "Bookshelves", group: "Living Room", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80" },

    // Bedroom
    { name: "Beds", group: "Bedroom", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80" },
    { name: "Wardrobes", group: "Bedroom", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80" },
    { name: "Mattresses", group: "Bedroom", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80" },
    { name: "Bedside Tables", group: "Bedroom", image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80" },
    { name: "Dressers", group: "Bedroom", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80" },

    // Dining
    { name: "Dining Tables", group: "Dining", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80" },
    { name: "Dining Chairs", group: "Dining", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80" },
    { name: "Bar Stools", group: "Dining", image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=400&q=80" },
    { name: "Crockery Units", group: "Dining", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80" },

    // Home Decor
    { name: "Curtains & Blinds", group: "Home Decor", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80" },
    { name: "Cushions & Covers", group: "Home Decor", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80" },
    { name: "Wall Art", group: "Home Decor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=400&q=80" },
    { name: "Mirrors", group: "Home Decor", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80" },
    { name: "Rugs & Carpets", group: "Home Decor", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=400&q=80" },

    // Lighting
    { name: "Ceiling Lights", group: "Lighting", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80" },
    { name: "Table Lamps", group: "Lighting", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80" },
    { name: "Floor Lamps", group: "Lighting", image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=400&q=80" },
    { name: "Wall Lights", group: "Lighting", image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=400&q=80" },

    // Storage
    { name: "Shoe Racks", group: "Storage", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=400&q=80" },
    { name: "Storage Boxes", group: "Storage", image: "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?auto=format&fit=crop&w=400&q=80" },
    { name: "Cabinets", group: "Storage", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80" },
    { name: "Shelving Units", group: "Storage", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80" },
];

async function seedHomeSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify parent category exists
        const parentCategory = await categoriesCollection.findOne({ _id: new ObjectId(homeCategoryId) });
        if (!parentCategory) {
            console.error("❌ Home category not found with ID:", homeCategoryId);
            return;
        }
        console.log(`✅ Found parent category: ${parentCategory.name}`);

        // Delete existing subcategories for Home
        const deleteResult = await categoriesCollection.deleteMany({
            parentCategory: new ObjectId(homeCategoryId)
        });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing subcategories`);

        // Insert new subcategories
        const subcategoriesToInsert = subcategories.map((sub) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            parentCategory: new ObjectId(homeCategoryId),
            group: sub.group,
            image: sub.image,
            icon: sub.image, // Using same image for icon
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const result = await categoriesCollection.insertMany(subcategoriesToInsert);
        console.log(`✅ Inserted ${result.insertedCount} subcategories for Home`);

        // Display inserted subcategories by group
        const groupedSubs = subcategories.reduce((acc, sub) => {
            if (!acc[sub.group]) acc[sub.group] = [];
            acc[sub.group].push(sub.name);
            return acc;
        }, {});

        console.log("\n📋 Subcategories by group:");
        Object.entries(groupedSubs).forEach(([group, subs]) => {
            console.log(`\n  ${group}:`);
            subs.forEach(name => console.log(`    - ${name}`));
        });

    } catch (error) {
        console.error("❌ Error seeding Home subcategories:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

seedHomeSubcategories();
