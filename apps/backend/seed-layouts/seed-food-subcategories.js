const { MongoClient, ObjectId } = require("mongodb");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Food Category ID: 695f88c75f463eeb3c42e76d
const FOOD_CATEGORY_ID = new ObjectId('695f88c75f463eeb3c42e76d');

const subcategories = [
    // Pantry Staples
    {
        name: 'Rice, Atta & Dals',
        description: 'Flours, grains, and pulses',
        group: 'Pantry Staples',
        image: 'https://cdn-icons-png.flaticon.com/512/3014/3014697.png',
        icon: '🌾'
    },
    {
        name: 'Oil & Ghee',
        description: 'Cooking oils and pure ghee',
        group: 'Pantry Staples',
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050228.png',
        icon: '🏺'
    },
    {
        name: 'Spices & Masalas',
        description: 'Whole spices and powders',
        group: 'Pantry Staples',
        image: 'https://cdn-icons-png.flaticon.com/512/2909/2909890.png',
        icon: '🌶️'
    },

    // Snacks & Beverages
    {
        name: 'Biscuits & Cookies',
        description: 'Tea time snacks and cookies',
        group: 'Snacks & Beverages',
        image: 'https://cdn-icons-png.flaticon.com/512/2919/2919932.png',
        icon: '🍪'
    },
    {
        name: 'Chips & Namkeen',
        description: 'Crunchy snacks and chips',
        group: 'Snacks & Beverages',
        image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
        icon: '🍟'
    },
    {
        name: 'Tea & Coffee',
        description: 'Beverages and energy drinks',
        group: 'Snacks & Beverages',
        image: 'https://cdn-icons-png.flaticon.com/512/1047/1047503.png',
        icon: '☕'
    },
    {
        name: 'Soft Drinks',
        description: 'Juices and carbonated drinks',
        group: 'Snacks & Beverages',
        image: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png',
        icon: '🥤'
    },

    // Breakfast & Dairy
    {
        name: 'Milk & Dairy',
        description: 'Fresh milk, cheese, and butter',
        group: 'Breakfast & Dairy',
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png',
        icon: '🥛'
    },
    {
        name: 'Cereals & Oats',
        description: 'Healthy breakfast options',
        group: 'Breakfast & Dairy',
        image: 'https://cdn-icons-png.flaticon.com/512/3076/3076044.png',
        icon: '🥣'
    },
    {
        name: 'Bread & Eggs',
        description: 'Bakery items and fresh eggs',
        group: 'Breakfast & Dairy',
        image: 'https://cdn-icons-png.flaticon.com/512/3014/3014524.png',
        icon: '🍞'
    },

    // Instant Food
    {
        name: 'Noodles & Pasta',
        description: 'Instant noodles and pasta',
        group: 'Instant Food',
        image: 'https://cdn-icons-png.flaticon.com/512/2718/2718224.png',
        icon: '🍜'
    },
    {
        name: 'Ready to Eat',
        description: 'Pre-cooked meals and mixes',
        group: 'Instant Food',
        image: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png',
        icon: '🍛'
    },
    {
        name: 'Chocolates & Sweets',
        description: 'Desserts, chocolates, and candies',
        group: 'Instant Food',
        image: 'https://cdn-icons-png.flaticon.com/512/2553/2553655.png',
        icon: '🍫'
    }
];

const groupOrder = [
    'Pantry Staples',
    'Snacks & Beverages',
    'Breakfast & Dairy',
    'Instant Food'
];

async function seedFoodSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify Parent Category Exists
        const parentCategory = await categoriesCollection.findOne({ _id: FOOD_CATEGORY_ID });
        if (!parentCategory) {
            console.error("❌ Parent Category 'Food' not found! Please run seed-categories first.");
            return;
        }
        console.log(`ℹ️ Found Parent Category: ${parentCategory.name}`);

        // Update Parent Category with Group Order
        await categoriesCollection.updateOne(
            { _id: FOOD_CATEGORY_ID },
            { $set: { subCategoryGroupOrder: groupOrder } }
        );
        console.log("✅ Updated Parent Category with Group Order");

        // Delete existing subcategories for this parent to avoid duplicates
        const deleteResult = await categoriesCollection.deleteMany({ parentCategory: FOOD_CATEGORY_ID });
        console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing subcategories`);

        // Prepare and Insert Subcategories
        const subcategoryDocs = subcategories.map((sub, index) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            description: sub.description,
            image: sub.image,
            icon: sub.icon,
            parentCategory: FOOD_CATEGORY_ID,
            group: sub.group,
            isActive: true,
            order: index + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const insertResult = await categoriesCollection.insertMany(subcategoryDocs);
        console.log(`✅ Seeded ${insertResult.insertedCount} subcategories for Food`);

    } catch (error) {
        console.error("❌ Error seeding Food subcategories:", error);
    } finally {
        await client.close();
        console.log("✅ MongoDB connection closed");
    }
}

seedFoodSubcategories();
