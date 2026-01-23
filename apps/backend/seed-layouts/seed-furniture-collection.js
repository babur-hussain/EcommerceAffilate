
const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../.env' });

// ============================================================================
// FURNITURE COLLECTION LAYOUT (LUSSO)
// ============================================================================
const collectionLayout = {
    pageSlug: 'furniture-collection',
    name: 'Furniture Collection LUSSO',
    isActive: true,
    sections: [
        {
            id: "sec_mod_header",
            type: "modern_coll_header",
            priority: 1,
            content: {} // Static content in component for now as per design
        },
        {
            id: "sec_mod_categories",
            type: "modern_coll_categories",
            priority: 2,
            content: {}
        },
        {
            id: "sec_mod_grid",
            type: "modern_coll_grid",
            priority: 3,
            content: {
                products: [
                    {
                        id: "1",
                        title: "Lounge Chair",
                        subtitle: "Grey Fabric",
                        price: "$120.00",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKzYUpN4uKBExp76PBGdFvxSjxiNkdHOFQ4zYWh2JZL5kH6G_CUwLGCw5JoZ9MJPU4l84CBfaOyAqT1NqKWyQayoxxnyiXjYF-B5-EDV5zpGooCLLbOEE56OfVJNubo5Iv2DbinE-nUaAeXxsfs55KCQIN0M20glLoK-aZuyKph2IMMTjS0DncRbtR9OpL6SyzYVL7qY-GlPk9Jost6ytNxkGQ4VoEWWIFj74nCczE2duyiJKOoPizRi2Fueu4b3CMdmu3QQfjmtij"
                    },
                    {
                        id: "2",
                        title: "Minimal Lamp",
                        subtitle: "Brass Finish",
                        price: "$85.00",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC797HoaClxX8PEKea9iHg-qXInR5yKkpnhptnjSeAWUIydFL3-cvczMnkehcgeXCooMSkOqcLE9Ne4EA9xDE7eE0BslZSN0Gh6e9Pw_I67Grp-NnNPeKsY4gom72I5u87-zeOLCSJTqPXwdhQgXxPUqlQIWTVY7aaKeeUU2bhIKv81IW1ddTmwRkzzGz7XYy90GMeRFqLikWvk4_j5pSRpBKmcfWUn_qMqPjyOtiH4fdLm9CPTQL9L1i2T5JJBQnIiablmN92i9Gve",
                        staggered: true
                    },
                    {
                        id: "3",
                        title: "Oak Table",
                        subtitle: "Natural Wood",
                        price: "$150.00",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiGnq0Ti8mJziO7eAxNyZWgNfXiT6BG1V7IzRdYO4-AnxM5n3HJgIHnmlouovV5blIPsnNTBqilPya0SOrRjBxoeHPXcyIjIEtlVZOi8bEUQTjboRyIMi3iZmCmJ6L6XwTd4Ev3ICnt5_pc071zbdFRiz2UT-jvP_EvftqunKoW0Gf3VTAADBCafSQb93WaL7tt2_7sAfxqoBcbLYWdIUFyWb119dVcvDK3h6xhO2NFkxrIoukr1DRgnB1DCr-qQT-JhLjY9PqHVaO"
                    },
                    {
                        id: "4",
                        title: "Velvet Cushion",
                        subtitle: "Teal Blue",
                        price: "$35.00",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2YdtvViW8GyylBO7KsYNHkmdVY94CIwrfm9Skjh58_oJXQAsz6hsFhBHoqQ9UUn5xxBJ5ycfOh3DkcMTXvDSKG7A5vy1Ec09ZwKI69ZmUtU-T95M5xhz4pZDxqhM7sUQgyyKnpt1Q7-PwEszbfwCjDmBXTQmPPAEgnXMF6P2IMqo7GQaLhO63Olh8PRFOGuBgGCSLzvKSjK0njVvk6Mt_sj_wlqYGEMbGHEJ0b4ZkM4aUJiE9ImdApTT43Hfr07nylguh2yTC5YvC",
                        staggered: true
                    }
                ]
            }
        },
        {
            id: "sec_mod_footer",
            type: "modern_coll_footer",
            priority: 4,
            content: {}
        }
    ]
};

async function seedLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'furniture-collection' });
        await collection.insertOne(collectionLayout);

        console.log("✅ Furniture Collection Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding layout:", err);
    } finally {
        await client.close();
    }
}

seedLayout();
