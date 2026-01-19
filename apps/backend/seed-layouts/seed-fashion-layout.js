const { MongoClient } = require("mongodb");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// ============================================================================
// FASHION LAYOUT
// ============================================================================
const fashionLayout = {
    pageSlug: 'fashion',
    name: 'Fashion Page',
    isActive: true,
    sections: [
        {
            id: 'fashion_banners',
            type: 'fashion_banners',
            priority: 10,
            content: {
                banners: [
                    { imageUrl: 'https://loremflickr.com/1000/400/fashion,model?lock=1', actionUrl: '/fashion/collection/women' },
                    { imageUrl: 'https://loremflickr.com/1000/400/fashion,sale?lock=2', actionUrl: '/fashion/collection/men' },
                    { imageUrl: 'https://loremflickr.com/1000/400/kids,fashion?lock=3', actionUrl: '/fashion/collection/kids' }
                ]
            }
        },
        {
            id: 'fashion_subcats',
            type: 'fashion_subcategories',
            priority: 20,
            content: {
                dataSource: { endpoint: '/api/categories/fashion/subcategories', params: {} }
            }
        },
        {
            id: 'fashion_shopping_others',
            type: 'fashion_shopping_others',
            priority: 30,
            content: {
                title: 'Shopping for Others?',
                headerActionUrl: '/fashion/collection/all',
                items: [
                    { name: 'Women', image: 'https://loremflickr.com/400/400/woman,fashion?lock=1', actionUrl: '/fashion/collection/women' },
                    { name: 'Men', image: 'https://loremflickr.com/400/400/man,fashion?lock=4', actionUrl: '/fashion/collection/men' },
                    { name: 'Kids', image: 'https://loremflickr.com/400/400/kids,fashion?lock=3', actionUrl: '/fashion/collection/kids' },
                    { name: 'Gen Z Drips', image: 'https://loremflickr.com/400/400/couple,fashion?lock=2', actionUrl: '/fashion/collection/gen-z-drips' },
                    { name: 'Luxe', image: 'https://loremflickr.com/400/400/luxury,fashion?lock=5', actionUrl: '/fashion/collection/luxe' }
                ]
            }
        },
        {
            id: 'fashion_early_bird',
            type: 'fashion_early_bird',
            priority: 40,
            content: {
                title: 'Early Bird Deals!',
                headerActionUrl: '/fashion/collection/early-bird-deals',
                items: [
                    { brand: 'Nike', offer: 'Min 40% Off', image: 'https://loremflickr.com/300/300/nike,shoes?lock=14', actionUrl: '/common-category/fashion?name=Nike Deals&filters={"brand":"Nike"}' },
                    { brand: 'Adidas', offer: 'Min 30% Off', image: 'https://loremflickr.com/300/300/adidas,shoes?lock=15', actionUrl: '/common-category/fashion?name=Adidas Deals&filters={"brand":"Adidas"}' },
                    { brand: 'Puma', offer: 'Min 50% Off', image: 'https://loremflickr.com/300/300/puma,shoes?lock=16', actionUrl: '/common-category/fashion?name=Puma Deals&filters={"brand":"Puma"}' }
                ]
            }
        },
        {
            id: 'fashion_festive',
            type: 'fashion_festive',
            priority: 50,
            content: {
                title: 'Sankranti Festival',
                headerActionUrl: '/common-category/fashion?name=Sankranti Collection&filters={"search":"ethnic"}',
                items: [
                    { title: 'Kurtas', price: 'Under ₹499', image: 'https://loremflickr.com/300/300/kurta,ethnic?lock=17', actionUrl: '/common-category/fashion?name=Kurtas&filters={"subCategory":"Kurtas"}' },
                    { title: 'Sarees', price: 'Under ₹999', image: 'https://loremflickr.com/300/300/saree,ethnic?lock=18', actionUrl: '/common-category/fashion?name=Sarees&filters={"subCategory":"Sarees"}' }
                ]
            }
        },
        {
            id: 'fashion_shoe_fest',
            type: 'fashion_shoe_fest',
            priority: 60,
            content: {
                title: "Shoe's Steal Fest",
                headerActionUrl: '/common-category/fashion?name=Shoe Fest',
                items: [
                    { title: 'Sneakers', offer: 'Min 50% Off', image: 'https://loremflickr.com/300/300/sneakers,shoes?lock=19', actionUrl: '/common-category/fashion?name=Sneakers&filters={"subCategory":"Sneakers"}' },
                    { title: 'Formal', offer: 'Min 40% Off', image: 'https://loremflickr.com/300/300/formal,shoes?lock=20', actionUrl: '/common-category/fashion?name=Formal Shoes&filters={"subCategory":"Formal Shoes"}' }
                ]
            }
        },
        {
            id: 'fashion_winter_clearance',
            type: 'fashion_winter_clearance',
            priority: 70,
            content: {
                title: 'Winter Clearance Sale',
                headerActionUrl: '/common-category/fashion?name=Winter Clearance',
                items: [
                    { brand: 'H&M', offer: 'Flat 50% Off', image: 'https://loremflickr.com/300/300/coat,winter?lock=21', actionUrl: '/common-category/fashion?name=H&M&filters={"brand":"H&M"}' },
                    { brand: 'Zara', offer: 'Flat 40% Off', image: 'https://loremflickr.com/300/300/jacket,winter?lock=22', actionUrl: '/common-category/fashion?name=Zara&filters={"brand":"Zara"}' }
                ]
            }
        },
        {
            id: 'fashion_deals',
            type: 'fashion_deals_of_day',
            priority: 80,
            content: {
                title: 'Deals of the Day',
                subtitle: 'Clock is ticking!',
                headerActionUrl: '/common-category/fashion?name=Deals of the Day',
                items: [
                    { brand: 'Levis', offer: 'Min 40% Off', price: '₹999', image: 'https://loremflickr.com/300/300/jeans?lock=23', actionUrl: '/common-category/fashion?name=Levis&filters={"brand":"Levis"}' },
                    { brand: 'Gap', offer: 'Min 50% Off', price: '₹799', image: 'https://loremflickr.com/300/300/clothing?lock=24', actionUrl: '/common-category/fashion?name=Gap&filters={"brand":"Gap"}' }
                ]
            }
        },
        {
            id: 'fashion_budget_buys',
            type: 'fashion_budget_buys',
            priority: 90,
            content: {
                title: 'Budget Buys',
                headerActionUrl: '/common-category/fashion?name=Budget Buys&filters={"maxPrice":500}',
                items: [
                    { price: '299', image: 'https://loremflickr.com/300/300/tshirt?lock=25', actionUrl: '/common-category/fashion?name=Under 299&filters={"maxPrice":299}' },
                    { price: '499', image: 'https://loremflickr.com/300/300/dress?lock=26', actionUrl: '/common-category/fashion?name=Under 499&filters={"maxPrice":499}' }
                ]
            }
        },
        {
            id: 'fashion_forecast',
            type: 'fashion_forecast',
            priority: 100,
            content: {
                title: 'FASHION FORECAST',
                headerActionUrl: '/common-category/fashion?name=Fashion Forecast',
                items: [
                    { title: 'SUMMER VIBES', sub: 'Cool & Breezy', align: 'left', image: 'https://loremflickr.com/600/400/summer,fashion?lock=27', actionUrl: '/common-category/fashion?name=Summer Vibes&filters={"search":"Summer"}' },
                    { title: 'URBAN CHIC', sub: 'Street Style', align: 'right', image: 'https://loremflickr.com/600/400/urban,fashion?lock=28', actionUrl: '/common-category/fashion?name=Urban Chic&filters={"search":"Urban"}' }
                ]
            }
        },
        {
            id: 'fashion_winter_collection',
            type: 'fashion_winter_collection',
            priority: 110,
            content: {
                title: 'Winter Collection ❄️',
                headerActionUrl: '/common-category/fashion?name=Winter Collection',
                items: [
                    { name: 'Jackets', offer: 'Min 30% Off', image: 'https://loremflickr.com/300/300/jacket?lock=29', actionUrl: '/common-category/fashion?name=Jackets&filters={"subCategory":"Jackets"}' },
                    { name: 'Sweaters', offer: 'Min 40% Off', image: 'https://loremflickr.com/300/300/sweater?lock=30', actionUrl: '/common-category/fashion?name=Sweaters&filters={"subCategory":"Sweaters"}' }
                ]
            }
        },
        {
            id: 'fashion_prod_grid',
            type: 'fashion_product_grid',
            priority: 120,
            content: {
                dataSource: { endpoint: '/api/products', params: { category: 'Fashion', limit: 10 } }
            }
        }
    ]
};

async function seedFashionLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(); // Use default DB from URI ('ecommerce')
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'fashion' });
        await collection.insertOne(fashionLayout);

        console.log("✅ Fashion Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding fashion layout:", err);
    } finally {
        await client.close();
    }
}

seedFashionLayout();
