const { MongoClient, ObjectId } = require("mongodb");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Toys Category ID: 695f88c75f463eeb3c42e76a
const TOYS_CATEGORY_ID = new ObjectId('695f88c75f463eeb3c42e76a');

const subcategories = [
    // Action & Adventure
    {
        name: 'Action Figures',
        description: 'Superheroes, villains, and character figures',
        group: 'Action & Adventure',
        image: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png',
        icon: '🦸'
    },
    {
        name: 'Toy Blasters',
        description: 'Foam blasters and toy launchers',
        group: 'Action & Adventure',
        image: 'https://cdn-icons-png.flaticon.com/512/3662/3662588.png',
        icon: '🔫'
    },
    {
        name: 'Role Play & Costumes',
        description: 'Dress-up costumes and role-play sets',
        group: 'Action & Adventure',
        image: 'https://cdn-icons-png.flaticon.com/512/2358/2358893.png',
        icon: '🎭'
    },
    {
        name: 'Robots',
        description: 'Interactive and programmable robots',
        group: 'Action & Adventure',
        image: 'https://cdn-icons-png.flaticon.com/512/616/616430.png',
        icon: '🤖'
    },

    // Dolls & Plush
    {
        name: 'Fashion Dolls',
        description: 'Trendy dolls and accessories',
        group: 'Dolls & Plush',
        image: 'https://cdn-icons-png.flaticon.com/512/2821/2821815.png',
        icon: '🎎'
    },
    {
        name: 'Soft Toys & Teddies',
        description: 'Plush animals and teddy bears',
        group: 'Dolls & Plush',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082042.png',
        icon: '🧸'
    },
    {
        name: 'Dollhouses & Sets',
        description: 'Dollhouses, furniture, and playsets',
        group: 'Dolls & Plush',
        image: 'https://cdn-icons-png.flaticon.com/512/2662/2662503.png',
        icon: '🏠'
    },
    {
        name: 'Puppets',
        description: 'Hand puppets and finger puppets',
        group: 'Dolls & Plush',
        image: 'https://cdn-icons-png.flaticon.com/512/3466/3466986.png',
        icon: '🧤'
    },

    // Learning & Creative
    {
        name: 'STEM Toys',
        description: 'Science, Tech, Engineering, and Math kits',
        group: 'Learning & Creative',
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135767.png',
        icon: '🔬'
    },
    {
        name: 'Arts & Crafts',
        description: 'Drawing, painting, clay, and DIY kits',
        group: 'Learning & Creative',
        image: 'https://cdn-icons-png.flaticon.com/512/1048/1048950.png',
        icon: '🎨'
    },
    {
        name: 'Building Sets',
        description: 'Blocks, bricks, and construction sets',
        group: 'Learning & Creative',
        image: 'https://cdn-icons-png.flaticon.com/512/812/812836.png',
        icon: '🧱'
    },
    {
        name: 'Musical Toys',
        description: 'Instruments and musical gadgets for kids',
        group: 'Learning & Creative',
        image: 'https://cdn-icons-png.flaticon.com/512/2618/2618385.png',
        icon: '🎹'
    },

    // Vehicles & Remote Control (New Group)
    {
        name: 'RC Cars & Vehicles',
        description: 'Remote control cars, trucks, and boats',
        group: 'Vehicles & RC',
        image: 'https://cdn-icons-png.flaticon.com/512/3163/3163212.png',
        icon: '🏎️'
    },
    {
        name: 'Drones',
        description: 'Flying drones and quadcopters',
        group: 'Vehicles & RC',
        image: 'https://cdn-icons-png.flaticon.com/512/900/900498.png',
        icon: '🚁'
    },
    {
        name: 'Die-Cast Cars',
        description: 'Collectible metal model cars',
        group: 'Vehicles & RC',
        image: 'https://cdn-icons-png.flaticon.com/512/3069/3069188.png',
        icon: '🚗'
    },
    {
        name: 'Train Sets',
        description: 'Electric trains and track sets',
        group: 'Vehicles & RC',
        image: 'https://cdn-icons-png.flaticon.com/512/2829/2829095.png',
        icon: '🚂'
    },

    // Games & Puzzles (New Group)
    {
        name: 'Board Games',
        description: 'Strategy, family, and educational board games',
        group: 'Games & Puzzles',
        image: 'https://cdn-icons-png.flaticon.com/512/3076/3076134.png',
        icon: '🎲'
    },
    {
        name: 'Card Games',
        description: 'Playing cards and trading card games',
        group: 'Games & Puzzles',
        image: 'https://cdn-icons-png.flaticon.com/512/2823/2823549.png',
        icon: '🃏'
    },
    {
        name: 'Jigsaw Puzzles',
        description: 'Puzzles for all ages and difficulty levels',
        group: 'Games & Puzzles',
        image: 'https://cdn-icons-png.flaticon.com/512/2393/2393439.png',
        icon: '🧩'
    },

    // Outdoor & Sports
    {
        name: 'Ride-Ons & Scooters',
        description: 'Bicycles, tricycles, and scooters',
        group: 'Outdoor & Sports',
        image: 'https://cdn-icons-png.flaticon.com/512/2403/2403698.png',
        icon: '🚲'
    },
    {
        name: 'Sports Equipment',
        description: 'Balls, bats, and outdoor game sets',
        group: 'Outdoor & Sports',
        image: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png',
        icon: '⚽'
    },
    {
        name: 'Water Toys',
        description: 'Pool floats, squirt guns, and beach toys',
        group: 'Outdoor & Sports',
        image: 'https://cdn-icons-png.flaticon.com/512/2737/2737525.png',
        icon: '🔫'
    }
];

// Define the order of groups to be displayed
const groupOrder = [
    'Action & Adventure',
    'Dolls & Plush',
    'Learning & Creative',
    'Vehicles & RC',
    'Games & Puzzles',
    'Outdoor & Sports'
];

async function seedToysSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify Parent Category Exists
        const parentCategory = await categoriesCollection.findOne({ _id: TOYS_CATEGORY_ID });
        if (!parentCategory) {
            console.error("❌ Parent Category 'Toys' not found! Please run seed-categories first.");
            return;
        }
        console.log(`ℹ️ Found Parent Category: ${parentCategory.name}`);

        // Update Parent Category with Group Order
        await categoriesCollection.updateOne(
            { _id: TOYS_CATEGORY_ID },
            { $set: { subCategoryGroupOrder: groupOrder } }
        );
        console.log("✅ Updated Parent Category with Group Order");

        // Delete existing subcategories for this parent to avoid duplicates
        const deleteResult = await categoriesCollection.deleteMany({ parentCategory: TOYS_CATEGORY_ID });
        console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing subcategories`);

        // Prepare Subcategory Documents
        const subcategoryDocs = subcategories.map((sub, index) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            description: sub.description,
            image: sub.image,
            icon: sub.icon,
            parentCategory: TOYS_CATEGORY_ID,
            group: sub.group,
            isActive: true,
            order: index + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // Insert Subcategories
        const insertResult = await categoriesCollection.insertMany(subcategoryDocs);
        console.log(`✅ Seeded ${insertResult.insertedCount} subcategories for Toys`);

    } catch (error) {
        console.error("❌ Error seeding Toys subcategories:", error);
    } finally {
        await client.close();
        console.log("✅ MongoDB connection closed");
    }
}

seedToysSubcategories();
