const { MongoClient } = require("mongodb");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const forYouLayout = {
    pageSlug: 'home',
    name: 'Home Page (For You)',
    isActive: true,
    sections: [
        {
            id: 'home_hero',
            type: 'hero_carousel',
            priority: 10,
            content: {
                banners: [
                    { imageUrl: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768755958/5_lgi7sg.webp', actionUrl: '/common-category/fashion?name=New Arrivals&filters={"search":"New"}' },
                    { imageUrl: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768755958/6_dhcaji.webp', actionUrl: '/common-category/electronics?name=Best Sellers&filters={"search":"Best"}' }
                ]
            }
        },
        {
            id: 'home_recent',
            type: 'recent_history',
            priority: 20,
            content: {}
        },
        {
            id: 'home_grocery',
            type: 'grocery_row',
            priority: 30,
            content: {
                categoryId: '695f88c75f463eeb3c42e76d' // Food/Grocery Category ID
            }
        },
        {
            id: 'home_curated',
            type: 'curated_collections',
            priority: 40,
            content: {
                collections: [
                    {
                        title: "Discover your unique style",
                        subtitle: "Elevate your fashion game with trendy picks",
                        backgroundColor: "#FDF2E3",
                        headerImage: "https://cdn-icons-png.flaticon.com/512/3050/3050253.png",
                        items: [
                            {
                                name: 'Smart Gadgets',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768755958/5_lgi7sg.webp',
                                bgColor: '#FADCB8',
                                actionUrl: '/common-category/695f88c75f463eeb3c42e764?name=Smart Gadgets' // Electronics
                            },
                            {
                                name: 'Casual Wear',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768755958/6_dhcaji.webp',
                                bgColor: '#FADCB8',
                                actionUrl: '/common-category/695f88c75f463eeb3c42e765?name=Casual Wear&filters={"search":"Casual"}' // Fashion
                            },
                            {
                                name: 'Jewellery',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768755959/7_mj3ql4.webp',
                                bgColor: '#FADCB8',
                                actionUrl: '/common-category/695f88c75f463eeb3c42e76e?name=Jewellery' // Jewelry
                            },
                            {
                                name: 'Bags & Accessories',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768755959/8_e5pa4z.webp',
                                bgColor: '#FADCB8',
                                actionUrl: '/common-category/6967c4f5b76df21b066b8538?name=Bags' // Bags
                            }
                        ]
                    },
                    {
                        title: "Upgrade your Tech",
                        subtitle: "Latest mobiles and accessories for you",
                        backgroundColor: "#E3F2FD",
                        headerImage: "https://cdn-icons-png.flaticon.com/512/644/644458.png",
                        items: [
                            {
                                name: 'Smartphones',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768756606/9_cgqqvg.webp',
                                bgColor: '#BBDEFB',
                                actionUrl: '/common-category/695f88c75f463eeb3c42e764?name=Smartphones&filters={"search":"Smartphone"}' // Electronics + Smartphone
                            },
                            {
                                name: 'Cases & Covers',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768756606/10_jc7vbz.webp',
                                bgColor: '#BBDEFB',
                                actionUrl: '/common-category/695f88c75f463eeb3c42e764?name=Cases&filters={"search":"Cases"}' // Electronics + Cases
                            },
                            {
                                name: 'Headphones',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768756606/11_g5micx.webp',
                                bgColor: '#BBDEFB',
                                actionUrl: '/common-category/695f88c75f463eeb3c42e764?name=Headphones&filters={"search":"Headphones"}' // Electronics + Headphones
                            },
                            {
                                name: 'Smart Watches',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768756607/12_lzinfh.webp',
                                bgColor: '#BBDEFB',
                                actionUrl: '/common-category/6967c4f5b76df21b066b8537?name=Smart Watches' // Watches
                            }
                        ]
                    },
                    {
                        title: "For a comfortable journey",
                        subtitle: "Get all your travel essentials here",
                        backgroundColor: "#F9FBE7",
                        headerImage: "https://cdn-icons-png.flaticon.com/512/3125/3125713.png",
                        items: [
                            {
                                name: 'Sunscreen',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768756881/13_gsqaos.webp',
                                bgColor: '#F0F4C3',
                                actionUrl: '/common-category/6967d82c85d7230e4eac11de?name=Sunscreen' // Sunscreens Subcat
                            },
                            {
                                name: 'Travel Pillows',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768756882/14_pjit5s.webp',
                                bgColor: '#F0F4C3',
                                actionUrl: '/common-category/695ff7de3f61939001a0637e?name=Travel Pillows&filters={"search":"Travel Pillow"}' // Home + Search
                            },
                            {
                                name: 'Power Banks',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768756882/15_wz05mo.webp',
                                bgColor: '#F0F4C3',
                                actionUrl: '/common-category/695f88c75f463eeb3c42e764?name=Power Banks&filters={"search":"Power Bank"}' // Electronics + Search
                            },
                            {
                                name: 'T-Shirts',
                                image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768756882/16_p3hide.webp',
                                bgColor: '#F0F4C3',
                                actionUrl: '/common-category/6967c4f5b76df21b066b8523?name=T-Shirts' // T-Shirts
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'home_lightning',
            type: 'lightning_deals',
            priority: 50,
            content: {}
        },
        {
            id: 'home_trending',
            type: 'product_list_horizontal',
            title: 'Trending near you',
            priority: 60,
            content: {}
        },
        {
            id: 'home_kitchen_sale',
            type: 'grand_kitchen',
            priority: 70,
            content: {}
        },
        {
            id: 'home_50_off',
            type: 'fifty_percent_off',
            priority: 80,
            content: {}
        },
        {
            id: 'home_grid',
            type: 'product_grid',
            priority: 90,
            title: 'More For You',
            content: {
                dataSource: { endpoint: '/api/products', params: { limit: 10 } }
            }
        }
    ]
};

async function seedHomeLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'home' });
        await collection.insertOne(forYouLayout);

        console.log("✅ Home Layout (For You) Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding home layout:", err);
    } finally {
        await client.close();
    }
}

seedHomeLayout();
