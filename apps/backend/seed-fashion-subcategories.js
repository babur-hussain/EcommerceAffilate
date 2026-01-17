const { MongoClient, ObjectId } = require("mongodb");

const fashionCategoryId = "695ff7de3f61939001a0637d";

const subcategories = [
    // Men's Fashion
    { name: "T-Shirts", group: "Men's Fashion", icon: "https://ui-avatars.com/api/?name=T-Shirts&background=random" },
    { name: "Casual Shirts", group: "Men's Fashion", icon: "https://ui-avatars.com/api/?name=Casual+Shirts&background=random" },
    { name: "Formal Shirts", group: "Men's Fashion", icon: "https://ui-avatars.com/api/?name=Formal+Shirts&background=random" },
    { name: "Jeans", group: "Men's Fashion", icon: "https://ui-avatars.com/api/?name=Jeans&background=random" },
    { name: "Trousers", group: "Men's Fashion", icon: "https://ui-avatars.com/api/?name=Trousers&background=random" },
    { name: "Jackets & Coats", group: "Men's Fashion", icon: "https://ui-avatars.com/api/?name=Jackets&background=random" },

    // Women's Fashion
    { name: "Dresses", group: "Women's Fashion", icon: "https://ui-avatars.com/api/?name=Dresses&background=random" },
    { name: "Tops & Tees", group: "Women's Fashion", icon: "https://ui-avatars.com/api/?name=Tops&background=random" },
    { name: "Kurtas & Kurtis", group: "Women's Fashion", icon: "https://ui-avatars.com/api/?name=Kurtas&background=random" },
    { name: "Sarees", group: "Women's Fashion", icon: "https://ui-avatars.com/api/?name=Sarees&background=random" },
    { name: "Jeans & Jeggings", group: "Women's Fashion", icon: "https://ui-avatars.com/api/?name=Jeans&background=random" },
    { name: "Skirts", group: "Women's Fashion", icon: "https://ui-avatars.com/api/?name=Skirts&background=random" },

    // Kids' Fashion
    { name: "Boys Clothing", group: "Kids' Fashion", icon: "https://ui-avatars.com/api/?name=Boys&background=random" },
    { name: "Girls Clothing", group: "Kids' Fashion", icon: "https://ui-avatars.com/api/?name=Girls&background=random" },
    { name: "Infant Wear", group: "Kids' Fashion", icon: "https://ui-avatars.com/api/?name=Infant&background=random" },

    // Footwear
    { name: "Men's Sports Shoes", group: "Footwear", icon: "https://ui-avatars.com/api/?name=Men+Shoes&background=random" },
    { name: "Men's Casual Shoes", group: "Footwear", icon: "https://ui-avatars.com/api/?name=Casual+Shoes&background=random" },
    { name: "Women's Flats", group: "Footwear", icon: "https://ui-avatars.com/api/?name=Flats&background=random" },
    { name: "Women's Heels", group: "Footwear", icon: "https://ui-avatars.com/api/?name=Heels&background=random" },
    { name: "Kids' Shoes", group: "Footwear", icon: "https://ui-avatars.com/api/?name=Kids+Shoes&background=random" },

    // Accessories
    { name: "Watches", group: "Accessories", icon: "https://ui-avatars.com/api/?name=Watches&background=random" },
    { name: "Bags & Backpacks", group: "Accessories", icon: "https://ui-avatars.com/api/?name=Bags&background=random" },
    { name: "Sunglasses", group: "Accessories", icon: "https://ui-avatars.com/api/?name=Sunglasses&background=random" },
    { name: "Belts & Wallets", group: "Accessories", icon: "https://ui-avatars.com/api/?name=Belts&background=random" },
    { name: "Jewellery", group: "Accessories", icon: "https://ui-avatars.com/api/?name=Jewellery&background=random" },
];

async function seedFashionSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify parent category exists by Name "Fashion"
        const parentCategory = await categoriesCollection.findOne({ name: "Fashion" });
        if (!parentCategory) {
            console.error(`❌ Parent category 'Fashion' not found!`);
            process.exit(1);
        }
        const parentId = parentCategory._id;
        console.log(`✅ Found Parent Category: ${parentCategory.name} (${parentId})`);

        // Prepare data
        const subcategoriesToInsert = subcategories.map((sub, index) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
            description: `Shop for ${sub.name}`,
            image: `https://loremflickr.com/600/400/fashion,${sub.name.split(' ')[0]}?lock=${index}`,
            posters: [],
            parentCategory: parentId, // Use ObjectId reference
            group: sub.group,
            order: index + 1,
            isActive: true,
            icon: sub.icon,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        // Optional: Delete existing subcategories for this parent to avoid duplicates/clutter
        // Uncomment the next line if you want to wipe previous subcategories for Fashion first
        // await categoriesCollection.deleteMany({ parentCategory: parentId });

        const result = await categoriesCollection.insertMany(subcategoriesToInsert);
        console.log(`✅ Inserted ${result.insertedCount} subcategories for Fashion`);

        console.log("\n📋 Subcategories added:");
        subcategoriesToInsert.forEach(sub => {
            console.log(`   [${sub.group}] ${sub.name} (${sub.slug})`);
        });

    } catch (error) {
        console.error("❌ Error seeding fashion subcategories:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n✅ Database connection closed");
        process.exit(0);
    }
}

seedFashionSubcategories();
