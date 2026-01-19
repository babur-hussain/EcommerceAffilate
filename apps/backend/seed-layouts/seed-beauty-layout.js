const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../.env' });

// ============================================================================
// BEAUTY LAYOUT
// ============================================================================
const beautyLayout = {
    pageSlug: 'beauty',
    name: 'Beauty Page',
    isActive: true,
    sections: [
        {
            id: 'beauty_banners',
            type: 'fashion_banners',
            priority: 10,
            title: 'Beauty Banners',
            content: {
                banners: [
                    { imageUrl: 'https://images.unsplash.com/photo-1612817288484-9691c9567225?auto=format&fit=crop&w=1000&q=80', actionUrl: '/common-category/skincare' },
                    { imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=1000&q=80', actionUrl: '/common-category/makeup' },
                    { imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80', actionUrl: '/common-category/k-beauty' }
                ]
            }
        },
        {
            id: 'beauty_subcats',
            type: 'beauty_subcategories',
            priority: 20,
            content: {
                dataSource: { endpoint: '/api/categories/beauty/subcategories', params: {} }
            }
        },
        {
            id: 'beauty_promo',
            type: 'beauty_promo_poster',
            priority: 30,
            content: {
                image: 'https://images.unsplash.com/photo-1571781535041-39c2c9535311?auto=format&fit=crop&w=1200&q=80',
                actionUrl: '/common-category/mega-sale'
            }
        },
        {
            id: 'beauty_harvest',
            type: 'beauty_glow_harvest',
            priority: 40,
            content: {
                title: 'Glow for the Harvest',
                items: [
                    { name: 'Golden Glow', image: 'https://loremflickr.com/300/300/highlighter?lock=22', offer: '40% Off', actionUrl: '/common-category/highlighters' },
                    { name: 'Night Repair', image: 'https://loremflickr.com/300/300/cream,night?lock=23', offer: 'Min 20% Off', actionUrl: '/common-category/night-creams' },
                    { name: 'Sun Block', image: 'https://loremflickr.com/300/300/sunscreen?lock=24', offer: 'Under ₹499', actionUrl: '/common-category/sunscreen' }
                ]
            }
        },
        {
            id: 'beauty_consult',
            type: 'beauty_consultation',
            priority: 50,
            content: {
                headerActionUrl: '/services/consultation'
            }
        },
        {
            id: 'beauty_trending',
            type: 'beauty_trending_brands',
            priority: 60,
            content: {
                title: 'Trending Brands',
                headerActionUrl: '/beauty/trending-brands',
                items: [
                    { name: 'Lakme', image: 'https://loremflickr.com/300/300/makeup?lock=31', offer: 'Min 20% Off', bg: '#FFEBEE', actionUrl: '/common-category/lakme' },
                    { name: 'Maybelline', image: 'https://loremflickr.com/300/300/lipstick?lock=32', offer: 'Min 25% Off', bg: '#E3F2FD', actionUrl: '/common-category/maybelline' },
                    { name: 'Nykaa', image: 'https://loremflickr.com/300/300/beauty?lock=33', offer: 'Up to 40% Off', bg: '#FCE4EC', actionUrl: '/common-category/nykaa' },
                    { name: 'Plum', image: 'https://loremflickr.com/300/300/vegan,beauty?lock=34', offer: 'Flat 15% Off', bg: '#E0F2F1', actionUrl: '/common-category/plum' }
                ]
            }
        },
        {
            id: 'beauty_alisters',
            type: 'beauty_alisters',
            priority: 70,
            content: {
                title: 'Globally Loved A-Listers',
                headerActionUrl: '/beauty/alisters',
                items: [
                    { brand: 'Loreal', subBrand: 'Paris', model: 'https://loremflickr.com/300/400/model,face?lock=41', product: 'https://loremflickr.com/100/100/bottle?lock=42', offer: 'Flat 15% Off', bg: '#F3E5F5', actionUrl: '/common-category/loreal' },
                    { brand: 'MAC', subBrand: 'Cosmetics', model: 'https://loremflickr.com/300/400/model,makeup?lock=43', product: 'https://loremflickr.com/100/100/compact?lock=44', offer: 'Flat 10% Off', bg: '#E0F7FA', actionUrl: '/common-category/mac' },
                    { brand: 'Clinique', subBrand: '', model: 'https://loremflickr.com/300/400/skin,model?lock=45', product: 'https://loremflickr.com/100/100/lotion?lock=46', offer: 'Min 10% Off', bg: '#FFF3E0', actionUrl: '/common-category/clinique' }
                ]
            }
        },
        {
            id: 'beauty_launch',
            type: 'beauty_launch_party',
            priority: 80,
            content: {
                title: 'The Launch Party',
                headerActionUrl: '/beauty/launch-party',
                items: [
                    { image: 'https://loremflickr.com/300/400/beauty,new?lock=51', offer: 'New Arrival', actionUrl: '/common-category/new-arrivals' },
                    { image: 'https://loremflickr.com/300/400/perfume,new?lock=52', offer: 'Just Launched', actionUrl: '/common-category/fragrances' },
                    { image: 'https://loremflickr.com/300/400/makeup,kit?lock=53', offer: 'Exclusive', actionUrl: '/common-category/exclusives' }
                ]
            }
        },
        {
            id: 'beauty_trend_more',
            type: 'beauty_trend_more',
            priority: 90,
            content: {
                title: 'Trend More, Spend Less',
                headerActionUrl: '/beauty/trend-more',
                items: [
                    { title: 'Glass Skin', image: 'https://loremflickr.com/300/300/face,glow?lock=61', brands: 'Many Brands', offer: 'Under ₹499', actionUrl: '/common-category/glass-skin' },
                    { title: 'Bold Lips', image: 'https://loremflickr.com/300/300/lips,red?lock=62', brands: 'Top Picks', offer: 'Under ₹299', actionUrl: '/common-category/bold-lips' },
                    { title: 'Hydration', image: 'https://loremflickr.com/300/300/water,skin?lock=63', brands: 'Best Sellers', offer: 'Under ₹399', actionUrl: '/common-category/hydration' }
                ]
            }
        },
        {
            id: 'beauty_internet',
            type: 'beauty_internet_famed',
            priority: 100,
            content: {
                title: 'Internet Famed Brands',
                headerActionUrl: '/beauty/internet-famed',
                items: [
                    { brand: 'Minimalist', desc: 'Science based skincare', image: 'https://loremflickr.com/300/300/bottle,white?lock=71', offer: 'Up to 20% Off', actionUrl: '/common-category/minimalist' },
                    { brand: 'Sugar', desc: 'Bold makeup', image: 'https://loremflickr.com/300/300/makeup,colorful?lock=72', offer: 'Up to 40% Off', actionUrl: '/common-category/sugar' },
                    { brand: 'Mamaearth', desc: 'Natural goodness', image: 'https://loremflickr.com/300/300/natural,product?lock=73', offer: 'Flat 15% Off', actionUrl: '/common-category/mamaearth' },
                    { brand: 'The Derma Co', desc: 'Dermatologist designed', image: 'https://loremflickr.com/300/300/derma,care?lock=74', offer: 'Min 10% Off', actionUrl: '/common-category/derma-co' }
                ]
            }
        },
        {
            id: 'beauty_kbeauty',
            type: 'beauty_k_beauty',
            priority: 110,
            content: {
                title: 'K-Beauty Obsessed',
                headerActionUrl: '/beauty/k-beauty',
                items: [
                    { brand: 'COSRX', image: 'https://loremflickr.com/400/600/korean,girl?lock=81', ingredientTitle: 'Star Ingredient', ingredient: 'Snail Mucin', offer: 'Best Seller', bg: '#81D4FA', actionUrl: '/common-category/cosrx' },
                    { brand: 'Innisfree', image: 'https://loremflickr.com/400/600/nature,face?lock=82', ingredientTitle: 'Star Ingredient', ingredient: 'Green Tea', offer: 'Trending', bg: '#A5D6A7', actionUrl: '/common-category/innisfree' },
                    { brand: 'Laneige', image: 'https://loremflickr.com/400/600/sleeping,mask?lock=83', ingredientTitle: 'Star Ingredient', ingredient: 'Water Bank', offer: 'Must Have', bg: '#90CAF9', actionUrl: '/common-category/laneige' }
                ]
            }
        },
        {
            id: 'beauty_glam',
            type: 'beauty_glam_budget',
            priority: 120,
            content: {
                title: 'Glam on a Budget',
                headerActionUrl: '/beauty/glam-budget',
                items: [
                    { label: 'Under', value: '₹99', bg: ['#E3F2FD', '#BBDEFB'], actionUrl: '/common-category/under-99' },
                    { label: 'Under', value: '₹299', bg: ['#F3E5F5', '#E1BEE7'], actionUrl: '/common-category/under-299' },
                    { label: 'Under', value: '₹499', bg: ['#E0F2F1', '#B2DFDB'], actionUrl: '/common-category/under-499' },
                    { label: 'Under', value: '₹999', bg: ['#FFFDE7', '#FFF59D'], actionUrl: '/common-category/under-999' },
                    { label: 'Min', value: '50%', sub: 'Off', bg: ['#E8F5E9', '#A5D6A7'], actionUrl: '/common-category/min-50-off' },
                    { label: 'Buy 1', value: 'Get 1', bg: ['#FBE9E7', '#FFCCBC'], actionUrl: '/common-category/bogo' }
                ]
            }
        },
        {
            id: 'beauty_grid',
            type: 'beauty_product_grid',
            priority: 130,
            content: {
                title: 'Latest in Beauty',
                dataSource: { endpoint: '/api/products', params: { category: 'Beauty', limit: 10 } }
            }
        }
    ]
};

async function seedBeautyLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'beauty' });
        await collection.insertOne(beautyLayout);

        console.log("✅ Beauty Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding beauty layout:", err);
    } finally {
        await client.close();
    }
}

seedBeautyLayout();
