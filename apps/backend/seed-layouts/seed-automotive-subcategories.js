const { MongoClient, ObjectId } = require("mongodb");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Automotive Category ID: 695f88c75f463eeb3c42e76c
const AUTOMOTIVE_CATEGORY_ID = new ObjectId('695f88c75f463eeb3c42e76c');

const subcategories = [
    // Car Accessories
    {
        name: 'Car Interior',
        description: 'Seat covers, mats, and air fresheners',
        group: 'Car Accessories',
        image: 'https://cdn-icons-png.flaticon.com/512/3069/3069188.png',
        icon: '🚘'
    },
    {
        name: 'Car Exterior',
        description: 'Covers, cleaners, and polish',
        group: 'Car Accessories',
        image: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
        icon: '🚿'
    },
    {
        name: 'Car Electronics',
        description: 'Audio systems, GPS, and chargers',
        group: 'Car Accessories',
        image: 'https://cdn-icons-png.flaticon.com/512/3163/3163212.png',
        icon: '📻'
    },

    // Bike Accessories
    {
        name: 'Helmets',
        description: 'Safety helmets for riders',
        group: 'Bike Accessories',
        image: 'https://cdn-icons-png.flaticon.com/512/3069/3069176.png',
        icon: '⛑️'
    },
    {
        name: 'Gloves & Gear',
        description: 'Riding gloves and protective gear',
        group: 'Bike Accessories',
        image: 'https://cdn-icons-png.flaticon.com/512/3466/3466986.png',
        icon: '🧤'
    },
    {
        name: 'Bike Covers',
        description: 'Protective covers for two-wheelers',
        group: 'Bike Accessories',
        image: 'https://cdn-icons-png.flaticon.com/512/2403/2403698.png',
        icon: '🏍️'
    },

    // Tools & Care
    {
        name: 'Car Tools',
        description: 'Jacks, wrenches, and tool kits',
        group: 'Tools & Care',
        image: 'https://cdn-icons-png.flaticon.com/512/2965/2965300.png',
        icon: '🔧'
    },
    {
        name: 'Tyre Care',
        description: 'Inflators, gauges, and repair kits',
        group: 'Tools & Care',
        image: 'https://cdn-icons-png.flaticon.com/512/3069/3069192.png',
        icon: '⚙️'
    },
    {
        name: 'Oils & Fluids',
        description: 'Engine oil, coolant, and lubricants',
        group: 'Tools & Care',
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        icon: '🛢️'
    }
];

const groupOrder = [
    'Car Accessories',
    'Bike Accessories',
    'Tools & Care'
];

async function seedAutomotiveSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify Parent Category Exists
        const parentCategory = await categoriesCollection.findOne({ _id: AUTOMOTIVE_CATEGORY_ID });
        if (!parentCategory) {
            console.error("❌ Parent Category 'Automotive' not found! Please run seed-categories first.");
            return;
        }
        console.log(`ℹ️ Found Parent Category: ${parentCategory.name}`);

        // Update Parent Category with Group Order
        await categoriesCollection.updateOne(
            { _id: AUTOMOTIVE_CATEGORY_ID },
            { $set: { subCategoryGroupOrder: groupOrder } }
        );
        console.log("✅ Updated Parent Category with Group Order");

        // Delete existing subcategories for this parent to avoid duplicates
        const deleteResult = await categoriesCollection.deleteMany({ parentCategory: AUTOMOTIVE_CATEGORY_ID });
        console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing subcategories`);

        // Prepare and Insert Subcategories
        const subcategoryDocs = subcategories.map((sub, index) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            description: sub.description,
            image: sub.image,
            icon: sub.icon,
            parentCategory: AUTOMOTIVE_CATEGORY_ID,
            group: sub.group,
            isActive: true,
            order: index + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const insertResult = await categoriesCollection.insertMany(subcategoryDocs);
        console.log(`✅ Seeded ${insertResult.insertedCount} subcategories for Automotive`);

    } catch (error) {
        console.error("❌ Error seeding Automotive subcategories:", error);
    } finally {
        await client.close();
        console.log("✅ MongoDB connection closed");
    }
}

seedAutomotiveSubcategories();
