const { MongoClient, ObjectId } = require("mongodb");

const booksCategoryId = "695ff7de3f61939001a06381";

const subcategories = [
    // Fiction
    { name: "Literary Fiction", group: "Fiction", icon: "https://ui-avatars.com/api/?name=Literary+Fiction&background=random" },
    { name: "Mystery & Thriller", group: "Fiction", icon: "https://ui-avatars.com/api/?name=Mystery&background=random" },
    { name: "Science Fiction", group: "Fiction", icon: "https://ui-avatars.com/api/?name=Sci-Fi&background=random" },
    { name: "Fantasy", group: "Fiction", icon: "https://ui-avatars.com/api/?name=Fantasy&background=random" },
    { name: "Romance", group: "Fiction", icon: "https://ui-avatars.com/api/?name=Romance&background=random" },
    { name: "Horror", group: "Fiction", icon: "https://ui-avatars.com/api/?name=Horror&background=random" },

    // Non-Fiction
    { name: "Biography & Memoir", group: "Non-Fiction", icon: "https://ui-avatars.com/api/?name=Biography&background=random" },
    { name: "Self-Help", group: "Non-Fiction", icon: "https://ui-avatars.com/api/?name=Self-Help&background=random" },
    { name: "Business & Economics", group: "Non-Fiction", icon: "https://ui-avatars.com/api/?name=Business&background=random" },
    { name: "History", group: "Non-Fiction", icon: "https://ui-avatars.com/api/?name=History&background=random" },
    { name: "Science & Nature", group: "Non-Fiction", icon: "https://ui-avatars.com/api/?name=Science&background=random" },
    { name: "Philosophy", group: "Non-Fiction", icon: "https://ui-avatars.com/api/?name=Philosophy&background=random" },

    // Educational
    { name: "Textbooks", group: "Educational", icon: "https://ui-avatars.com/api/?name=Textbooks&background=random" },
    { name: "Study Guides", group: "Educational", icon: "https://ui-avatars.com/api/?name=Study+Guides&background=random" },
    { name: "Test Preparation", group: "Educational", icon: "https://ui-avatars.com/api/?name=Test+Prep&background=random" },
    { name: "Language Learning", group: "Educational", icon: "https://ui-avatars.com/api/?name=Languages&background=random" },

    // Children's Books
    { name: "Picture Books", group: "Children's Books", icon: "https://ui-avatars.com/api/?name=Picture+Books&background=random" },
    { name: "Early Readers", group: "Children's Books", icon: "https://ui-avatars.com/api/?name=Early+Readers&background=random" },
    { name: "Middle Grade", group: "Children's Books", icon: "https://ui-avatars.com/api/?name=Middle+Grade&background=random" },
    { name: "Young Adult", group: "Children's Books", icon: "https://ui-avatars.com/api/?name=Young+Adult&background=random" },

    // Comics & Graphic Novels
    { name: "Comics", group: "Comics & Graphic Novels", icon: "https://ui-avatars.com/api/?name=Comics&background=random" },
    { name: "Manga", group: "Comics & Graphic Novels", icon: "https://ui-avatars.com/api/?name=Manga&background=random" },
    { name: "Graphic Novels", group: "Comics & Graphic Novels", icon: "https://ui-avatars.com/api/?name=Graphic+Novels&background=random" },

    // Cookbooks & Food
    { name: "Cookbooks", group: "Cookbooks & Food", icon: "https://ui-avatars.com/api/?name=Cookbooks&background=random" },
    { name: "Baking", group: "Cookbooks & Food", icon: "https://ui-avatars.com/api/?name=Baking&background=random" },
    { name: "Healthy Eating", group: "Cookbooks & Food", icon: "https://ui-avatars.com/api/?name=Healthy+Eating&background=random" },

    // Arts & Photography
    { name: "Art History", group: "Arts & Photography", icon: "https://ui-avatars.com/api/?name=Art+History&background=random" },
    { name: "Photography", group: "Arts & Photography", icon: "https://ui-avatars.com/api/?name=Photography&background=random" },
    { name: "Design", group: "Arts & Photography", icon: "https://ui-avatars.com/api/?name=Design&background=random" },

    // Religion & Spirituality
    { name: "Religious Texts", group: "Religion & Spirituality", icon: "https://ui-avatars.com/api/?name=Religious+Texts&background=random" },
    { name: "Meditation & Mindfulness", group: "Religion & Spirituality", icon: "https://ui-avatars.com/api/?name=Meditation&background=random" },
    { name: "Spirituality", group: "Religion & Spirituality", icon: "https://ui-avatars.com/api/?name=Spirituality&background=random" },
];

async function seedBooksSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify parent category exists by Name "Books"
        const parentCategory = await categoriesCollection.findOne({ name: "Books" });
        if (!parentCategory) {
            console.error(`❌ Parent category 'Books' not found!`);
            process.exit(1);
        }
        const parentId = parentCategory._id;
        console.log(`✅ Found Parent Category: ${parentCategory.name} (${parentId})`);

        // Prepare data
        const subcategoriesToInsert = subcategories.map((sub, index) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
            description: `Shop for ${sub.name}`,
            image: `https://loremflickr.com/600/400/books,${sub.name.split(' ')[0]}?lock=${index}`,
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
        // Uncomment the next line if you want to wipe previous subcategories for Books first
        // await categoriesCollection.deleteMany({ parentCategory: parentId });

        const result = await categoriesCollection.insertMany(subcategoriesToInsert);
        console.log(`✅ Inserted ${result.insertedCount} subcategories for Books`);

        console.log("\n📋 Subcategories added:");
        subcategoriesToInsert.forEach(sub => {
            console.log(`   [${sub.group}] ${sub.name} (${sub.slug})`);
        });

    } catch (error) {
        console.error("❌ Error seeding books subcategories:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n✅ Database connection closed");
        process.exit(0);
    }
}

seedBooksSubcategories();
