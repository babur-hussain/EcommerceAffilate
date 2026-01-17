const { MongoClient, ObjectId } = require("mongodb");

const beautyCategoryId = "695ff7de3f61939001a0637f";

const subcategories = [
    // Makeup
    { name: "Lipsticks", group: "Makeup", icon: "https://ui-avatars.com/api/?name=Lipsticks&background=random" },
    { name: "Foundations", group: "Makeup", icon: "https://ui-avatars.com/api/?name=Foundations&background=random" },
    { name: "Eye Shadows", group: "Makeup", icon: "https://ui-avatars.com/api/?name=Eye+Shadows&background=random" },
    { name: "Mascaras", group: "Makeup", icon: "https://ui-avatars.com/api/?name=Mascaras&background=random" },
    { name: "Eyeliners", group: "Makeup", icon: "https://ui-avatars.com/api/?name=Eyeliners&background=random" },
    { name: "Blushes", group: "Makeup", icon: "https://ui-avatars.com/api/?name=Blushes&background=random" },
    { name: "Highlighters", group: "Makeup", icon: "https://ui-avatars.com/api/?name=Highlighters&background=random" },
    { name: "Nail Polishes", group: "Makeup", icon: "https://ui-avatars.com/api/?name=Nail+Polishes&background=random" },

    // Skincare
    { name: "Moisturizers", group: "Skincare", icon: "https://ui-avatars.com/api/?name=Moisturizers&background=random" },
    { name: "Face Washes", group: "Skincare", icon: "https://ui-avatars.com/api/?name=Face+Washes&background=random" },
    { name: "Sunscreens", group: "Skincare", icon: "https://ui-avatars.com/api/?name=Sunscreens&background=random" },
    { name: "Serums", group: "Skincare", icon: "https://ui-avatars.com/api/?name=Serums&background=random" },
    { name: "Face Masks", group: "Skincare", icon: "https://ui-avatars.com/api/?name=Face+Masks&background=random" },
    { name: "Toners", group: "Skincare", icon: "https://ui-avatars.com/api/?name=Toners&background=random" },
    { name: "Body Lotions", group: "Skincare", icon: "https://ui-avatars.com/api/?name=Body+Lotions&background=random" },

    // Haircare
    { name: "Shampoos", group: "Haircare", icon: "https://ui-avatars.com/api/?name=Shampoos&background=random" },
    { name: "Conditioners", group: "Haircare", icon: "https://ui-avatars.com/api/?name=Conditioners&background=random" },
    { name: "Hair Oils", group: "Haircare", icon: "https://ui-avatars.com/api/?name=Hair+Oils&background=random" },
    { name: "Hair Serums", group: "Haircare", icon: "https://ui-avatars.com/api/?name=Hair+Serums&background=random" },
    { name: "Hair Colors", group: "Haircare", icon: "https://ui-avatars.com/api/?name=Hair+Colors&background=random" },

    // Fragrance
    { name: "Perfumes", group: "Fragrance", icon: "https://ui-avatars.com/api/?name=Perfumes&background=random" },
    { name: "Deodorants", group: "Fragrance", icon: "https://ui-avatars.com/api/?name=Deodorants&background=random" },
    { name: "Body Mists", group: "Fragrance", icon: "https://ui-avatars.com/api/?name=Body+Mists&background=random" },

    // Men's Grooming
    { name: "Beard Care", group: "Men's Grooming", icon: "https://ui-avatars.com/api/?name=Beard+Care&background=random" },
    { name: "Shaving Essentials", group: "Men's Grooming", icon: "https://ui-avatars.com/api/?name=Shaving&background=random" },

    // Tools & Accessories
    { name: "Makeup Brushes", group: "Tools & Accessories", icon: "https://ui-avatars.com/api/?name=Brushes&background=random" },
    { name: "Hair Dryers", group: "Tools & Accessories", icon: "https://ui-avatars.com/api/?name=Dryers&background=random" },
    { name: "Straighteners", group: "Tools & Accessories", icon: "https://ui-avatars.com/api/?name=Straighteners&background=random" },
];

async function seedBeautySubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify parent category exists by ID
        const parentCategory = await categoriesCollection.findOne({ _id: new ObjectId(beautyCategoryId) });
        if (!parentCategory) {
            // Using ID directly to be safe, though ideally we'd seek by name too
            console.error(`❌ Parent category with ID '${beautyCategoryId}' not found!`);
            // Attempt fallback by Name "Beauty" if ID fails (dev env mismatch)
            const parentByName = await categoriesCollection.findOne({ name: "Beauty" });
            if (parentByName) {
                console.log(`⚠️ Fallback: Found 'Beauty' by name with ID: ${parentByName._id}`);
            } else {
                process.exit(1);
            }
        } else {
            console.log(`✅ Found Parent Category: ${parentCategory.name} (${parentCategory._id})`);
        }

        // Use the ID provided by user strictly
        const parentId = new ObjectId(beautyCategoryId);

        // Prepare data
        const subcategoriesToInsert = subcategories.map((sub, index) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
            description: `Shop for ${sub.name}`,
            image: `https://loremflickr.com/600/400/beauty,${sub.name.split(' ')[0]}?lock=${index + 200}`, // different lock range
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
        // await categoriesCollection.deleteMany({ parentCategory: parentId });

        const result = await categoriesCollection.insertMany(subcategoriesToInsert);
        console.log(`✅ Inserted ${result.insertedCount} subcategories for Beauty`);

        console.log("\n📋 Subcategories added:");
        subcategoriesToInsert.forEach(sub => {
            console.log(`   [${sub.group}] ${sub.name} (${sub.slug})`);
        });

    } catch (error) {
        console.error("❌ Error seeding beauty subcategories:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n✅ Database connection closed");
        process.exit(0);
    }
}

seedBeautySubcategories();
