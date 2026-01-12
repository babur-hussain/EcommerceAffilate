const { MongoClient } = require("mongodb");

const categories = [
  {
    name: "Electronics",
    description: "Electronic devices and accessories",
    icon: "📱",
    order: 1,
    isActive: true,
  },
  {
    name: "Fashion",
    description: "Clothing, footwear, and accessories",
    icon: "👗",
    order: 2,
    isActive: true,
  },
  {
    name: "Home & Kitchen",
    description: "Home decor and kitchen essentials",
    icon: "🏠",
    order: 3,
    isActive: true,
  },
  {
    name: "Beauty",
    description: "Beauty and personal care products",
    icon: "💄",
    order: 4,
    isActive: true,
  },
  {
    name: "Sports",
    description: "Sports and fitness equipment",
    icon: "⚽",
    order: 5,
    isActive: true,
  },
  {
    name: "Books",
    description: "Books and educational materials",
    icon: "📚",
    order: 6,
    isActive: true,
  },
  {
    name: "Toys",
    description: "Toys and games for all ages",
    icon: "🧸",
    order: 7,
    isActive: true,
  },
  {
    name: "Health",
    description: "Health and wellness products",
    icon: "🏥",
    order: 8,
    isActive: true,
  },
  {
    name: "Automotive",
    description: "Automotive parts and accessories",
    icon: "🚗",
    order: 9,
    isActive: true,
  },
  {
    name: "Food",
    description: "Food and beverages",
    icon: "🍔",
    order: 10,
    isActive: true,
  },
  {
    name: "Jewelry",
    description: "Jewelry and watches",
    icon: "💍",
    order: 11,
    isActive: true,
  },
  {
    name: "Pet Supplies",
    description: "Pet food, toys, and accessories",
    icon: "🐾",
    order: 12,
    isActive: true,
  },
  {
    name: "Baby Products",
    description: "Baby care and nursery items",
    icon: "👶",
    order: 13,
    isActive: true,
  },
  {
    name: "Furniture",
    description: "Furniture for home and office",
    icon: "🛋️",
    order: 14,
    isActive: true,
  },
  {
    name: "Garden & Outdoor",
    description: "Garden tools and outdoor equipment",
    icon: "🌱",
    order: 15,
    isActive: true,
  },
];

async function seedCategories() {
  const uri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const categoriesCollection = db.collection("categories");

    // Clear existing categories
    await categoriesCollection.deleteMany({});
    console.log("🗑️  Cleared existing categories");

    // Generate slugs and insert categories
    const categoriesToInsert = categories.map((cat) => ({
      ...cat,
      slug: cat.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
      parentCategory: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await categoriesCollection.insertMany(categoriesToInsert);
    console.log(`✅ Created ${result.insertedCount} categories`);

    console.log("\n📋 Categories created:");
    categoriesToInsert.forEach((cat) => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug})`);
    });
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  }
}

seedCategories();
