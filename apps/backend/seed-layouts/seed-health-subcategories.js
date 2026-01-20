const { MongoClient, ObjectId } = require("mongodb");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Health Category ID: 695f88c75f463eeb3c42e76b
const HEALTH_CATEGORY_ID = new ObjectId('695f88c75f463eeb3c42e76b');

const subcategories = [
    // Personal Care
    {
        name: 'Skincare',
        description: 'Creams, lotions, and face care',
        group: 'Personal Care',
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050253.png',
        icon: '🧴'
    },
    {
        name: 'Haircare',
        description: 'Shampoos, conditioners, and oils',
        group: 'Personal Care',
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        icon: '💇'
    },
    {
        name: 'Oral Care',
        description: 'Toothpaste, toothbrushes, and mouthwash',
        group: 'Personal Care',
        image: 'https://cdn-icons-png.flaticon.com/512/3004/3004838.png',
        icon: '🦷'
    },
    {
        name: 'Bath & Body',
        description: 'Body wash, soaps, and scrubs',
        group: 'Personal Care',
        image: 'https://cdn-icons-png.flaticon.com/512/2933/2933860.png',
        icon: '🛁'
    },
    {
        name: 'Men\'s Grooming',
        description: 'Shaving needs, bread care, and grooming kits',
        group: 'Personal Care',
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050239.png',
        icon: '🧔'
    },

    // Wellness & Nutrition
    {
        name: 'Vitamins & Minerals',
        description: 'Essential daily vitamins and minerals',
        group: 'Wellness & Nutrition',
        image: 'https://cdn-icons-png.flaticon.com/512/2855/2855360.png',
        icon: '💊'
    },
    {
        name: 'Supplements',
        description: 'Herbal and dietary supplements',
        group: 'Wellness & Nutrition',
        image: 'https://cdn-icons-png.flaticon.com/512/883/883407.png',
        icon: '🌿'
    },
    {
        name: 'Protein & Fitness',
        description: 'Protein powders, bars, and energy drinks',
        group: 'Wellness & Nutrition',
        image: 'https://cdn-icons-png.flaticon.com/512/2829/2829871.png',
        icon: '💪'
    },
    {
        name: 'Weight Management',
        description: 'Slimming teas and diet snacks',
        group: 'Wellness & Nutrition',
        image: 'https://cdn-icons-png.flaticon.com/512/2855/2855365.png',
        icon: '⚖️'
    },

    // Healthcare Devices
    {
        name: 'BP Monitors',
        description: 'Digital blood pressure monitors',
        group: 'Healthcare Devices',
        image: 'https://cdn-icons-png.flaticon.com/512/3054/3054889.png',
        icon: '🩺'
    },
    {
        name: 'Glucometers',
        description: 'Blood glucose monitoring kits',
        group: 'Healthcare Devices',
        image: 'https://cdn-icons-png.flaticon.com/512/3209/3209072.png',
        icon: '🩸'
    },
    {
        name: 'Thermometers',
        description: 'Digital and infrared thermometers',
        group: 'Healthcare Devices',
        image: 'https://cdn-icons-png.flaticon.com/512/2933/2933116.png',
        icon: '🌡️'
    },
    {
        name: 'Weighing Scales',
        description: 'Digital body weight scales',
        group: 'Healthcare Devices',
        image: 'https://cdn-icons-png.flaticon.com/512/3132/3132975.png',
        icon: '⚖️'
    },

    // First Aid & Safety
    {
        name: 'First Aid Kits',
        description: 'Complete first aid boxes',
        group: 'First Aid & Safety',
        image: 'https://cdn-icons-png.flaticon.com/512/3022/3022568.png',
        icon: '🩹'
    },
    {
        name: 'Masks & Sanitizers',
        description: 'Face masks and hand sanitizers',
        group: 'First Aid & Safety',
        image: 'https://cdn-icons-png.flaticon.com/512/2913/2913456.png',
        icon: '😷'
    },
    {
        name: 'Pain Relief',
        description: 'Balms, sprays, and heating pads',
        group: 'First Aid & Safety',
        image: 'https://cdn-icons-png.flaticon.com/512/2362/2362394.png',
        icon: '💊'
    }
];

// Define the order of groups to be displayed
const groupOrder = [
    'Personal Care',
    'Wellness & Nutrition',
    'Healthcare Devices',
    'First Aid & Safety'
];

async function seedHealthSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify Parent Category Exists
        const parentCategory = await categoriesCollection.findOne({ _id: HEALTH_CATEGORY_ID });
        if (!parentCategory) {
            console.error("❌ Parent Category 'Health' not found! Please run seed-categories first.");
            return;
        }
        console.log(`ℹ️ Found Parent Category: ${parentCategory.name}`);

        // Update Parent Category with Group Order
        await categoriesCollection.updateOne(
            { _id: HEALTH_CATEGORY_ID },
            { $set: { subCategoryGroupOrder: groupOrder } }
        );
        console.log("✅ Updated Parent Category with Group Order");

        // Delete existing subcategories for this parent to avoid duplicates
        const deleteResult = await categoriesCollection.deleteMany({ parentCategory: HEALTH_CATEGORY_ID });
        console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing subcategories`);

        // Prepare Subcategory Documents
        const subcategoryDocs = subcategories.map((sub, index) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            description: sub.description,
            image: sub.image,
            icon: sub.icon,
            parentCategory: HEALTH_CATEGORY_ID,
            group: sub.group,
            isActive: true,
            order: index + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // Insert Subcategories
        const insertResult = await categoriesCollection.insertMany(subcategoryDocs);
        console.log(`✅ Seeded ${insertResult.insertedCount} subcategories for Health`);

    } catch (error) {
        console.error("❌ Error seeding Health subcategories:", error);
    } finally {
        await client.close();
        console.log("✅ MongoDB connection closed");
    }
}

seedHealthSubcategories();
