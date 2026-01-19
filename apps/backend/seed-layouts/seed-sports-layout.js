const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../.env' });

// ============================================================================
// SPORTS LAYOUT
// ============================================================================
const sportsLayout = {
    pageSlug: 'sports',
    name: 'Sports Page',
    isActive: true,
    sections: [
        {
            id: 'sport_banners',
            type: 'fashion_banners',
            priority: 10,
            content: {
                banners: [
                    { imageUrl: 'https://loremflickr.com/1000/400/cricket,stadium?lock=201', actionUrl: '/category/cricket' },
                    { imageUrl: 'https://loremflickr.com/1000/400/football,player?lock=202', actionUrl: '/category/football' },
                    { imageUrl: 'https://loremflickr.com/1000/400/gym,workout?lock=203', actionUrl: '/category/gym' }
                ]
            }
        },
        {
            id: 'sport_subcats',
            type: 'sport_subcategories',
            priority: 20,
            content: {
                dataSource: { endpoint: '/api/categories/sports/subcategories', params: {} }
            }
        },
        {
            id: 'sport_cricket',
            type: 'sport_cricket_season',
            priority: 30,
            content: {
                title: 'Cricket Season Kick Off',
                headerActionUrl: '/events/cricket-season',
                items: [
                    { mainText: 'Match Day Essentials', subText: 'Starting ₹199', bgImage: 'https://loremflickr.com/600/400/cricket,bat?lock=211', actionUrl: '/collection/cricket-essentials' },
                    { title: 'Jerseys', offer: 'Min 40% Off', image: 'https://loremflickr.com/300/300/jersey,cricket?lock=212', actionUrl: '/category/jerseys' },
                    { title: 'Training Kits', offer: 'Min 30% Off', image: 'https://loremflickr.com/300/300/sportswear?lock=213', actionUrl: '/category/training-kits' }
                ]
            }
        },
        {
            id: 'sport_winner',
            type: 'sport_winner_brands',
            priority: 40,
            content: {
                title: 'Winner Brands',
                items: [
                    { brand: 'Puma', offer: 'Min 40% Off', image: 'https://loremflickr.com/300/300/puma,shoe?lock=221', logoColor: '#000', actionUrl: '/brand/puma' },
                    { brand: 'Adidas', offer: 'Min 30% Off', image: 'https://loremflickr.com/300/300/adidas,shoe?lock=222', logoColor: '#000', actionUrl: '/brand/adidas' },
                    { brand: 'Nike', offer: 'Min 25% Off', image: 'https://loremflickr.com/300/300/nike,shoe?lock=223', logoColor: '#000', actionUrl: '/brand/nike' }
                ]
            }
        },
        {
            id: 'sport_goals',
            type: 'sport_support_goals',
            priority: 50,
            content: {
                title: 'Support Your Goals',
                items: [
                    { titleLines: ['BUILD', 'MUSCLE'], subtitle: 'Strength Training Gear', bgImage: 'https://loremflickr.com/600/600/gym,dumbbells?lock=231', actionUrl: '/collection/build-muscle' },
                    { titleLines: ['STAY', 'FIT'], subtitle: 'Cardio Essentials', bgImage: 'https://loremflickr.com/600/600/running,shoe?lock=232', actionUrl: '/collection/stay-fit' }
                ]
            }
        },
        {
            id: 'sport_accessories',
            type: 'sport_gym_accessories',
            priority: 60,
            content: {
                title: 'Gym-Approved Accessories',
                items: [
                    { title: 'Gloves', discount: 'Min 20% Off', image: 'https://loremflickr.com/300/300/gym,gloves?lock=241', actionUrl: '/category/gym-gloves' },
                    { title: 'Bottles', discount: 'Min 40% Off', image: 'https://loremflickr.com/300/300/water,bottle?lock=242', actionUrl: '/category/bottles' },
                    { title: 'Bags', discount: 'Min 30% Off', image: 'https://loremflickr.com/300/300/gym,bag?lock=243', actionUrl: '/category/gym-bags' },
                    { title: 'Mats', discount: 'Min 50% Off', image: 'https://loremflickr.com/300/300/yoga,mat?lock=244', actionUrl: '/category/yoga-mats' }
                ]
            }
        },
        {
            id: 'sport_combos',
            type: 'sport_combos',
            priority: 70,
            content: {
                title: 'Sports Combos',
                items: [
                    { title: 'Bat + Ball', discount: 'Min 15% Off', image: 'https://loremflickr.com/300/300/cricket,kit?lock=251', actionUrl: '/bundle/cricket-starter' },
                    { title: 'Racket + Shuttle', discount: 'Min 20% Off', image: 'https://loremflickr.com/300/300/badminton?lock=252', actionUrl: '/bundle/badminton-set' },
                    { title: 'Jersey + Shorts', discount: 'Min 30% Off', image: 'https://loremflickr.com/300/300/football,kit?lock=253', actionUrl: '/bundle/football-kit' }
                ]
            }
        },
        {
            id: 'sport_savings',
            type: 'sport_savings',
            priority: 80,
            content: {
                title: 'Score Big Savings',
                items: [
                    { title: 'Badminton', offer: 'Up to 60% Off', bgImage: 'https://loremflickr.com/600/400/badminton,court?lock=261', actionUrl: '/category/badminton' },
                    { title: 'Football', offer: 'Up to 50% Off', bgImage: 'https://loremflickr.com/600/400/football,field?lock=262', actionUrl: '/category/football' }
                ]
            }
        },
        {
            id: 'sport_grid',
            type: 'sport_product_grid',
            priority: 99,
            content: {
                dataSource: { endpoint: '/api/products', params: { category: 'Sports', limit: 10 } }
            }
        }
    ]
};

async function seedSportsLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'sports' });
        await collection.insertOne(sportsLayout);

        console.log("✅ Sports Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding sports layout:", err);
    } finally {
        await client.close();
    }
}

seedSportsLayout();
