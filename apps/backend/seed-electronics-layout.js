const { MongoClient } = require("mongodb");
require('dotenv').config();

const electronicsLayout = {
    pageSlug: 'electronics',
    name: 'Electronics Page',
    isActive: true,
    sections: [
        {
            id: 'elec_banners',
            type: 'electronics_banners',
            title: 'Electronics Banners',
            priority: 10,
            content: {
                banners: [
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&w=1200&q=80',
                        actionUrl: '/category/laptops-electronics'
                    },
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
                        actionUrl: '/category/smartphones-electronics'
                    },
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80',
                        actionUrl: '/category/desktop-pcs-electronics'
                    }
                ]
            }
        },
        {
            id: 'elec_subcats',
            type: 'electronics_subcategories',
            title: 'Shop by Category',
            priority: 20,
            content: {
                dataSource: {
                    endpoint: '/api/categories/695ff7de3f61939001a0637c/subcategories',
                    params: {}
                }
            }
        },
        {
            id: 'elec_latest_products',
            type: 'electronics_product_grid',
            title: 'Latest in Electronics',
            priority: 30,
            content: {
                dataSource: {
                    endpoint: '/api/products',
                    params: { category: '695ff7de3f61939001a0637c', limit: 10 }
                }
            }
        }
    ]
};

async function seedElectronicsLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const pageLayoutsCollection = db.collection("pagelayouts"); // Ensure collection name matches model

        // Upsert the layout: Update if exists, Insert if new
        const result = await pageLayoutsCollection.updateOne(
            { pageSlug: electronicsLayout.pageSlug },
            {
                $set: {
                    name: electronicsLayout.name,
                    isActive: electronicsLayout.isActive,
                    sections: electronicsLayout.sections,
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log(`✅ Created new Electronics layout (ID: ${result.upsertedId})`);
        } else {
            console.log(`✅ Updated existing Electronics layout`);
        }

    } catch (error) {
        console.error("❌ Error seeding Electronics layout:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

seedElectronicsLayout();
