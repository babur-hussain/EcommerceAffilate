const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

// Furniture Category ID from debug script: 695ff7de3f61939001a06389
const furnitureCategoryId = "695ff7de3f61939001a06389";

const subcategories = [
    // Living Room
    { name: "Sofas", group: "Living Room", image: "https://loremflickr.com/400/400/sofa,furniture?lock=1" },
    { name: "Recliners", group: "Living Room", image: "https://loremflickr.com/400/400/recliner,chair?lock=2" },
    { name: "TV Units", group: "Living Room", image: "https://loremflickr.com/400/400/tv,cabinet?lock=3" },
    { name: "Coffee Tables", group: "Living Room", image: "https://loremflickr.com/400/400/coffee,table?lock=4" },
    { name: "Bean Bags", group: "Living Room", image: "https://loremflickr.com/400/400/beanbag?lock=5" },

    // Bedroom
    { name: "Beds", group: "Bedroom", image: "https://loremflickr.com/400/400/bed,furniture?lock=6" },
    { name: "Wardrobes", group: "Bedroom", image: "https://loremflickr.com/400/400/wardrobe?lock=7" },
    { name: "Bedside Tables", group: "Bedroom", image: "https://loremflickr.com/400/400/nightstand?lock=8" },
    { name: "Mattresses", group: "Bedroom", image: "https://loremflickr.com/400/400/mattress?lock=9" },

    // Dining
    { name: "Dining Sets", group: "Dining", image: "https://loremflickr.com/400/400/dining,table?lock=10" },
    { name: "Kitchen Cabinets", group: "Dining", image: "https://loremflickr.com/400/400/kitchen,cabinet?lock=11" },
    { name: "Bar Furniture", group: "Dining", image: "https://loremflickr.com/400/400/bar,stool?lock=12" },

    // Study
    { name: "Study Tables", group: "Study", image: "https://loremflickr.com/400/400/study,table?lock=13" },
    { name: "Office Chairs", group: "Study", image: "https://loremflickr.com/400/400/office,chair?lock=14" },
    { name: "Bookshelves", group: "Study", image: "https://loremflickr.com/400/400/bookshelf?lock=15" },

    // Outdoor
    { name: "Outdoor Chairs", group: "Outdoor", image: "https://loremflickr.com/400/400/outdoor,chair?lock=16" },
    { name: "Swing Chairs", group: "Outdoor", image: "https://loremflickr.com/400/400/swing,chair?lock=17" },
    { name: "Hammocks", group: "Outdoor", image: "https://loremflickr.com/400/400/hammock?lock=18" }
];

async function seedFurnitureSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify parent category exists
        const parentCategory = await categoriesCollection.findOne({ _id: new ObjectId(furnitureCategoryId) });
        if (!parentCategory) {
            console.error("❌ Furniture category not found with ID:", furnitureCategoryId);
            return;
        }
        console.log(`✅ Found parent category: ${parentCategory.name}`);

        // Delete existing subcategories for Furniture
        const deleteResult = await categoriesCollection.deleteMany({
            parentCategory: new ObjectId(furnitureCategoryId)
        });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing subcategories`);

        // Insert new subcategories
        const subcategoriesToInsert = subcategories.map((sub) => ({
            name: sub.name,
            slug: `furniture-${sub.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, // Ensure unique slug
            parentCategory: new ObjectId(furnitureCategoryId),
            group: sub.group,
            image: sub.image,
            icon: sub.image,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const result = await categoriesCollection.insertMany(subcategoriesToInsert);
        console.log(`✅ Inserted ${result.insertedCount} subcategories for Furniture`);

    } catch (error) {
        console.error("❌ Error seeding Furniture subcategories:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

seedFurnitureSubcategories();
