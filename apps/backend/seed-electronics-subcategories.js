const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const electronicsCategoryId = "695ff7de3f61939001a0637c";

const subcategories = [
    // --- Tech (Core) ---
    { name: "Smartphones", group: "Tech", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80" },
    { name: "Laptops", group: "Tech", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80" },
    { name: "Tablets", group: "Tech", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80" },
    { name: "Headphones", group: "Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
    { name: "Smartwatches", group: "Tech", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" },
    { name: "Cameras", group: "Tech", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80" },
    { name: "Gaming Consoles", group: "Tech", image: "https://images.unsplash.com/photo-1481487484163-9d881958b430?auto=format&fit=crop&w=400&q=80" },
    { name: "Bluetooth Speakers", group: "Tech", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80" },
    { name: "Desktop PCs", group: "Tech", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=400&q=80" },
    { name: "Monitors", group: "Tech", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80" },
    { name: "Printers", group: "Tech", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80" },

    // --- Mobile Accessories ---
    { name: "Power Banks", group: "Mobile Accessories", image: "https://images.unsplash.com/photo-1609592424367-bf4825d19455?auto=format&fit=crop&w=400&q=80" },
    { name: "Cases & Covers", group: "Mobile Accessories", image: "https://images.unsplash.com/photo-1603313011101-320f721ccd68?auto=format&fit=crop&w=400&q=80" },
    { name: "Screen Protectors", group: "Mobile Accessories", image: "https://images.unsplash.com/photo-1592837943588-34a980756774?auto=format&fit=crop&w=400&q=80" },
    { name: "Chargers & Cables", group: "Mobile Accessories", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80" },
    { name: "Memory Cards", group: "Mobile Accessories", image: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?auto=format&fit=crop&w=400&q=80" },
    { name: "Selfie Sticks", group: "Mobile Accessories", image: "https://images.unsplash.com/photo-1533228124798-8fbce522026d?auto=format&fit=crop&w=400&q=80" },

    // --- Computer Accessories & Peripherals ---
    { name: "Keyboards", group: "Computer Accessories", image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&w=400&q=80" },
    { name: "Mice", group: "Computer Accessories", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80" },
    { name: "Laptop Bags", group: "Computer Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80" },
    { name: "Hard Drives", group: "Computer Accessories", image: "https://images.unsplash.com/photo-1531492391811-9fa8e7343e52?auto=format&fit=crop&w=400&q=80" },
    { name: "Pen Drives", group: "Computer Accessories", image: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?auto=format&fit=crop&w=400&q=80" }, // Using memory card image as fallback
    { name: "Webcams", group: "Computer Accessories", image: "https://images.unsplash.com/photo-1622618776625-ffa8c212239d?auto=format&fit=crop&w=400&q=80" },
    { name: "Routers", group: "Computer Accessories", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80" },

    // --- Audio & Home Entertainment ---
    { name: "Home Theatre", group: "Home Entertainment", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80" },
    { name: "Soundbars", group: "Home Entertainment", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80" },
    { name: "Streaming Devices", group: "Home Entertainment", image: "https://images.unsplash.com/photo-1540417056011-893bd576e938?auto=format&fit=crop&w=400&q=80" }, // Generic remote/device
    { name: "Projectors", group: "Home Entertainment", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80" },

    // --- Camera & Photography ---
    { name: "DSLR Cameras", group: "Cameras & Accessories", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80" },
    { name: "Action Cameras", group: "Cameras & Accessories", image: "https://images.unsplash.com/photo-1526437937748-d38392576d1e?auto=format&fit=crop&w=400&q=80" },
    { name: "Drones", group: "Cameras & Accessories", image: "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=400&q=80" },
    { name: "Camera Lenses", group: "Cameras & Accessories", image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=400&q=80" },
    { name: "Tripods", group: "Cameras & Accessories", image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&w=400&q=80" },

    // --- Home Appliances ---
    { name: "Refrigerators", group: "Home Appliances", image: "https://images.unsplash.com/photo-1571175443880-49e1d58b794a?auto=format&fit=crop&w=400&q=80" },
    { name: "Washing Machines", group: "Home Appliances", image: "https://images.unsplash.com/photo-1626806775351-538af710221e?auto=format&fit=crop&w=400&q=80" },
    { name: "Air Conditioners", group: "Home Appliances", image: "https://images.unsplash.com/photo-1614631446501-abcf7694973f?auto=format&fit=crop&w=400&q=80" },
    { name: "Microwaves", group: "Home Appliances", image: "https://images.unsplash.com/photo-1585659722983-3a675aba5f1d?auto=format&fit=crop&w=400&q=80" },
    { name: "Televisions", group: "Home Appliances", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80" },
    { name: "Irons", group: "Home Appliances", image: "https://images.unsplash.com/photo-1544983633-87b6400bdc08?auto=format&fit=crop&w=400&q=80" }, // Generic
    { name: "Vacuum Cleaners", group: "Home Appliances", image: "https://images.unsplash.com/photo-1558317374-a35c20204666?auto=format&fit=crop&w=400&q=80" },

    // --- Kitchen Appliances ---
    { name: "Mixer Grinders", group: "Kitchen Appliances", image: "https://images.unsplash.com/photo-1570222094114-28a9d88a2b64?auto=format&fit=crop&w=400&q=80" },
    { name: "Electric Kettles", group: "Kitchen Appliances", image: "https://images.unsplash.com/photo-1594213114663-d94db9b17126?auto=format&fit=crop&w=400&q=80" },
    { name: "Dishwashers", group: "Kitchen Appliances", image: "https://images.unsplash.com/photo-1582234151336-db26baf1d996?auto=format&fit=crop&w=400&q=80" },
    { name: "Water Purifiers", group: "Kitchen Appliances", image: "https://images.unsplash.com/photo-1678566415534-118f972049e6?auto=format&fit=crop&w=400&q=80" },
    { name: "Induction Cooktops", group: "Kitchen Appliances", image: "https://images.unsplash.com/photo-1585514258810-7249bfa81676?auto=format&fit=crop&w=400&q=80" }, // Generic stove
    { name: "Toasters", group: "Kitchen Appliances", image: "https://images.unsplash.com/photo-1588619461348-185c72d829dc?auto=format&fit=crop&w=400&q=80" },

    // --- Personal Care ---
    { name: "Trimmers", group: "Personal Care", image: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80" },
    { name: "Hair Dryers", group: "Personal Care", image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=400&q=80" },
    { name: "Shavers", group: "Personal Care", image: "https://images.unsplash.com/photo-1598585253805-4d2d78704043?auto=format&fit=crop&w=400&q=80" },
    { name: "Hair Straighteners", group: "Personal Care", image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=400&q=80" },
    { name: "Epilators", group: "Personal Care", image: "https://images.unsplash.com/photo-1596473187122-841951559868?auto=format&fit=crop&w=400&q=80" }, // Generic skin tool

    // --- Computer Components ---
    { name: "Processors", group: "Components", image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80" },
    { name: "Graphics Cards", group: "Components", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80" },
    { name: "Storage (SSD/HDD)", group: "Components", image: "https://images.unsplash.com/photo-1597852074816-d933c7d6b688?auto=format&fit=crop&w=400&q=80" },
    { name: "Motherboards", group: "Components", image: "https://images.unsplash.com/photo-1624701928517-44c8ac49d93c?auto=format&fit=crop&w=400&q=80" },
    { name: "RAM", group: "Components", image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80" },
    { name: "Power Supplies", group: "Components", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80" }, // Generic component

    // --- Smart Home & Automation ---
    { name: "Smart Lights", group: "Smart Home", image: "https://images.unsplash.com/photo-1582234026850-8b065a6c317f?auto=format&fit=crop&w=400&q=80" }, // Bulb
    { name: "Smart Locks", group: "Smart Home", image: "https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&w=400&q=80" },
    { name: "Security Cameras", group: "Smart Home", image: "https://images.unsplash.com/photo-1557324232-b8917d3c3d63?auto=format&fit=crop&w=400&q=80" },
    { name: "Smart Plugs", group: "Smart Home", image: "https://images.unsplash.com/photo-1563720746-db6d306b3252?auto=format&fit=crop&w=400&q=80" }, // Generic white plastic

    // --- Gaming ---
    { name: "Video Games", group: "Gaming", image: "https://images.unsplash.com/photo-1592155931584-901ac1576d13?auto=format&fit=crop&w=400&q=80" },
    { name: "Controllers", group: "Gaming", image: "https://images.unsplash.com/photo-1534488972407-5a4aa1e47d83?auto=format&fit=crop&w=400&q=80" },
    { name: "Gaming Headsets", group: "Gaming", image: "https://images.unsplash.com/photo-1599669454699-b48819846e8da?auto=format&fit=crop&w=400&q=80" },
    { name: "Gaming Keyboards", group: "Gaming", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80" },
    { name: "Gaming Chairs", group: "Gaming", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=400&q=80" },
];

async function seedElectronicsSubcategories() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const categoriesCollection = db.collection("categories");

        // Verify parent category exists
        const parentCategory = await categoriesCollection.findOne({ _id: new ObjectId(electronicsCategoryId) });
        if (!parentCategory) {
            console.error("❌ Electronics category not found with ID:", electronicsCategoryId);
            // Verify if we should create it? 
            // The user implies it exists with that ID.
            // If not found, we might want to check if the ID is correct or create a placeholder.
            // But let's assume it exists or the user gave the ID from their DB.
            return;
        }
        console.log(`✅ Found parent category: ${parentCategory.name}`);

        // Delete existing subcategories for Electronics
        // Note: This wipes existing ones to ensure clean state as per "seed all ... with proper groups"
        const deleteResult = await categoriesCollection.deleteMany({
            parentCategory: new ObjectId(electronicsCategoryId)
        });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing subcategories`);

        // Insert new subcategories
        const subcategoriesToInsert = subcategories.map((sub) => ({
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-electronics",
            parentCategory: new ObjectId(electronicsCategoryId),
            group: sub.group,
            image: sub.image,
            icon: sub.image,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const result = await categoriesCollection.insertMany(subcategoriesToInsert);
        console.log(`✅ Inserted ${result.insertedCount} subcategories for Electronics`);

        // Display inserted subcategories by group
        const groupedSubs = subcategories.reduce((acc, sub) => {
            if (!acc[sub.group]) acc[sub.group] = [];
            acc[sub.group].push(sub.name);
            return acc;
        }, {});

        console.log("\n📋 Subcategories by group:");
        Object.entries(groupedSubs).forEach(([group, subs]) => {
            console.log(`\n  ${group}:`);
            subs.forEach(name => console.log(`    - ${name}`));
        });

    } catch (error) {
        console.error("❌ Error seeding Electronics subcategories:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

seedElectronicsSubcategories();
