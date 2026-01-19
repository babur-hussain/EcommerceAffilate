const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

// Furniture Category ID: 695ff7de3f61939001a06389
const categoryId = "695ff7de3f61939001a06389";
const categoryName = "Furniture";

const products = [
    {
        name: "Modern 3-Seater Sofa",
        description: "Comfortable and stylish grey sofa for your living room.",
        price: 24999,
        originalPrice: 35999,
        discount: 30,
        images: ["https://loremflickr.com/400/400/sofa,furniture?lock=101", "https://loremflickr.com/400/400/sofa,modern?lock=102"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 10,
        rating: 4.5,
        reviews: 120,
        brand: "Sleepwell",
        tags: ["sofa", "living room", "furniture"],
    },
    {
        name: "Queen Size Bed with Storage",
        description: "Spacious queen bed with engineered wood finish.",
        price: 18999,
        originalPrice: 25999,
        discount: 27,
        images: ["https://loremflickr.com/400/400/bed,furniture?lock=103", "https://loremflickr.com/400/400/bedroom?lock=104"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 5,
        rating: 4.2,
        reviews: 85,
        brand: "Wakefit",
        tags: ["bed", "bedroom", "storage"],
    },
    {
        name: "Ergonomic Office Chair",
        description: "High back mesh chair for work from home.",
        price: 6999,
        originalPrice: 12999,
        discount: 46,
        images: ["https://loremflickr.com/400/400/office,chair?lock=105"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 20,
        rating: 4.8,
        reviews: 200,
        brand: "Green Soul",
        tags: ["chair", "office", "study"],
    },
    {
        name: "Wooden Coffee Table",
        description: "Solid wood center table with glass top.",
        price: 4500,
        originalPrice: 6000,
        discount: 25,
        images: ["https://loremflickr.com/400/400/coffee,table?lock=106"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 15,
        rating: 4.0,
        reviews: 45,
        brand: "Nilkamal",
        tags: ["table", "living room"],
    },
    {
        name: "Bookshelf (4 Shelves)",
        description: "Open bookshelf for organizing your library.",
        price: 3999,
        originalPrice: 5999,
        discount: 33,
        images: ["https://loremflickr.com/400/400/bookshelf?lock=107"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 8,
        rating: 4.3,
        reviews: 60,
        brand: "DeckUp",
        tags: ["bookshelf", "storage", "study"],
    },
    {
        name: "Dining Table Set (4 Seater)",
        description: "Compact dining table with 4 cushioned chairs.",
        price: 15999,
        originalPrice: 22999,
        discount: 30,
        images: ["https://loremflickr.com/400/400/dining,table?lock=108"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 3,
        rating: 4.6,
        reviews: 30,
        brand: "HomeCentre",
        tags: ["dining", "table", "set"],
    },
    {
        name: "Recliner Chair",
        description: "Single seater recliner in brown fabric.",
        price: 12999,
        originalPrice: 19999,
        discount: 35,
        images: ["https://loremflickr.com/400/400/recliner?lock=109"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 7,
        rating: 4.7,
        reviews: 95,
        brand: "Furlenco",
        tags: ["recliner", "living room", "comfort"],
    },
    {
        name: "Shoe Rack with Seat",
        description: "Wooden shoe rack with cushioned seat.",
        price: 2999,
        originalPrice: 4999,
        discount: 40,
        images: ["https://loremflickr.com/400/400/shoerack?lock=110"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 25,
        rating: 4.1,
        reviews: 50,
        brand: "Flipkart Perfect Homes",
        tags: ["storage", "shoe rack"],
    },
    {
        name: "Bean Bag (XXL)",
        description: "Faux leather bean bag cover (without beans).",
        price: 999,
        originalPrice: 1999,
        discount: 50,
        images: ["https://loremflickr.com/400/400/beanbag?lock=111"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 50,
        rating: 4.4,
        reviews: 300,
        brand: "Sattva",
        tags: ["bean bag", "living room"],
    },
    {
        name: "Wardrobe (2 Door)",
        description: "Classic 2-door wardrobe with mirror.",
        price: 11999,
        originalPrice: 16999,
        discount: 29,
        images: ["https://loremflickr.com/400/400/wardrobe,wood?lock=112"],
        category: categoryName,
        categoryId: new ObjectId(categoryId),
        stock: 6,
        rating: 4.2,
        reviews: 40,
        brand: "Godrej Interio",
        tags: ["wardrobe", "storage", "bedroom"],
    }
];

async function seedFurnitureProducts() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const productsCollection = db.collection("products");

        // Prepare products with unique slugs
        const productsToInsert = products.map(p => ({
            ...p,
            slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000),
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // Check if products already exist and delete if so
        const existingCount = await productsCollection.countDocuments({ category: categoryName });
        if (existingCount > 0) {
            console.log(`ℹ️  ${existingCount} Furniture products already exist. Deleting...`);
            await productsCollection.deleteMany({ category: categoryName });
            console.log("🗑️  Deleted existing products");
        }

        const result = await productsCollection.insertMany(productsToInsert);
        console.log(`✅ Inserted ${result.insertedCount} mock products for Furniture`);

    } catch (error) {
        console.error("❌ Error seeding Furniture products:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

seedFurnitureProducts();
