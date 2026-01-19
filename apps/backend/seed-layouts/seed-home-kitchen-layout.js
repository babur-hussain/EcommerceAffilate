const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../.env' });

// ============================================================================
// HOME & KITCHEN LAYOUT
// ============================================================================
const homeLayout = {
    pageSlug: 'home-kitchen',
    name: 'Home & Kitchen Page',
    isActive: true,
    sections: [
        {
            id: 'home_banners',
            type: 'fashion_banners',
            priority: 10,
            content: {
                banners: [
                    { imageUrl: 'https://loremflickr.com/1000/400/kitchen,modern?lock=91', actionUrl: '/category/kitchen-appliances' },
                    { imageUrl: 'https://loremflickr.com/1000/400/decor,home?lock=92', actionUrl: '/category/decor' },
                    { imageUrl: 'https://loremflickr.com/1000/400/furniture,living?lock=93', actionUrl: '/category/furniture' }
                ]
            }
        },
        {
            id: 'home_subcats',
            type: 'home_subcategories',
            priority: 20,
            content: {
                dataSource: { endpoint: '/api/categories/home-kitchen/subcategories', params: {} }
            }
        },
        {
            id: 'home_bestsellers',
            type: 'home_kitchen_bestsellers',
            priority: 30,
            content: {
                title: 'Kitchen Bestsellers',
                headerActionUrl: '/category/kitchen-bestsellers',
                items: [
                    { title: 'Cookware Set', price: '₹1499', image: 'https://loremflickr.com/300/300/pan,cooking?lock=101', actionUrl: '/product/cookware' },
                    { title: 'Blender', price: '₹2499', image: 'https://loremflickr.com/300/300/blender?lock=102', actionUrl: '/product/blender' },
                    { title: 'Knife Set', price: '₹999', image: 'https://loremflickr.com/300/300/knife,kitchen?lock=103', actionUrl: '/product/knife-set' },
                    { title: 'Spice Rack', price: '₹499', image: 'https://loremflickr.com/300/300/spice?lock=104', actionUrl: '/product/spice-rack' }
                ]
            }
        },
        {
            id: 'home_decor_trends',
            type: 'home_decor_trends',
            priority: 40,
            content: {
                title: 'Home Decor Trends',
                headerActionUrl: '/category/decor-trends',
                items: [
                    { title: 'Wall Art', price: 'From ₹299', image: 'https://loremflickr.com/300/300/art,wall?lock=111', actionUrl: '/category/wall-art' },
                    { title: 'Vases', price: 'From ₹399', image: 'https://loremflickr.com/300/300/vase?lock=112', actionUrl: '/category/vases' },
                    { title: 'Lamps', price: 'From ₹799', image: 'https://loremflickr.com/300/300/lamp?lock=113', actionUrl: '/category/lamps' },
                    { title: 'Rugs', price: 'From ₹1299', image: 'https://loremflickr.com/300/300/rug?lock=114', actionUrl: '/category/rugs' }
                ]
            }
        },
        {
            id: 'home_furnishing',
            type: 'home_furnishing_deals',
            priority: 50,
            content: {
                title: 'Furnishing Deals',
                headerActionUrl: '/category/furnishing-deals',
                items: [
                    { title: 'Bed Sheets', price: 'Min 50% Off', image: 'https://loremflickr.com/300/300/bedsheet?lock=121', actionUrl: '/category/bedsheets' },
                    { title: 'Curtains', price: 'Min 40% Off', image: 'https://loremflickr.com/300/300/curtain?lock=122', actionUrl: '/category/curtains' },
                    { title: 'Cushions', price: 'Under ₹299', image: 'https://loremflickr.com/300/300/cushion?lock=123', actionUrl: '/category/cushions' },
                    { title: 'Towels', price: 'Buy 1 Get 1', image: 'https://loremflickr.com/300/300/towel?lock=124', actionUrl: '/category/towels' }
                ]
            }
        },
        {
            id: 'home_grid',
            type: 'home_product_grid',
            priority: 99,
            content: {
                title: 'Latest in Home & Kitchen',
                dataSource: { endpoint: '/api/products', params: { category: 'Home & Kitchen', limit: 10 } }
            }
        }
    ]
};

async function seedHomeKitchenLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'home-kitchen' });
        await collection.insertOne(homeLayout);

        console.log("✅ Home & Kitchen Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding home & kitchen layout:", err);
    } finally {
        await client.close();
    }
}

seedHomeKitchenLayout();
