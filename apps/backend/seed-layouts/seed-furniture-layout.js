const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../.env' });

// ============================================================================
// FURNITURE LAYOUT
// ============================================================================
const furnitureLayout = {
    pageSlug: 'furniture',
    name: 'Furniture Page',
    isActive: true,
    sections: [
        {
            id: 'furn_banners',
            type: 'fashion_banners',
            priority: 10,
            title: 'Furniture Banners',
            content: {
                banners: [
                    { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', actionUrl: '/common-category/living-room' },
                    { imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80', actionUrl: '/common-category/bedroom' },
                    { imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', actionUrl: '/common-category/furniture-sale' }
                ]
            }
        },
        {
            id: 'furn_subcats',
            type: 'furniture_subcategories',
            priority: 20,
            content: {
                dataSource: { endpoint: '/api/categories/furniture/subcategories', params: {} }
            }
        },
        {
            id: 'furn_deal_day',
            type: 'furniture_deal_of_day',
            priority: 30,
            content: {
                title: 'Deal of the Day',
                subtitle: 'Unbeatable prices',
                headerActionUrl: '/furniture/collection/deal-of-the-day',
                items: [
                    { title: 'Office Chairs', price: 'Min 60% Off', image: 'https://loremflickr.com/400/300/chair,office?lock=411', actionUrl: '/common-category/office-chairs' },
                    { title: 'Bean Bags', price: 'Min 50% Off', image: 'https://loremflickr.com/400/300/beanbag?lock=412', actionUrl: '/common-category/bean-bags' },
                    { title: 'Shoe Racks', price: 'Min 40% Off', image: 'https://loremflickr.com/400/300/shelf,shoe?lock=413', actionUrl: '/common-category/shoe-racks' }
                ]
            }
        },
        {
            id: 'furn_top_brands',
            type: 'furniture_top_brands',
            priority: 40,
            content: {
                title: 'Top Furniture Brands',
                headerActionUrl: '/furniture/collection/top-brands',
                items: [
                    { name: 'Sleepwell', price: 'Min 30% Off', image: 'https://loremflickr.com/300/400/mattress?lock=421', logo: 'https://loremflickr.com/100/100/logo?lock=991', actionUrl: '/common-category/sleepwell' },
                    { name: 'Wakefit', price: 'Min 25% Off', image: 'https://loremflickr.com/300/400/bed?lock=422', logo: 'https://loremflickr.com/100/100/logo?lock=992', actionUrl: '/common-category/wakefit' },
                    { name: 'Nilkamal', price: 'Min 20% Off', image: 'https://loremflickr.com/300/400/plastic,chair?lock=423', logo: 'https://loremflickr.com/100/100/logo?lock=993', actionUrl: '/common-category/nilkamal' }
                ]
            }
        },
        {
            id: 'furn_sponsor',
            type: 'furniture_sponsorship_banner',
            priority: 50,
            content: {
                items: [
                    { image: 'https://loremflickr.com/1000/400/furniture,sale?lock=431', actionUrl: '/common-category/furniture-sale' }
                ]
            }
        },
        {
            id: 'furn_grab',
            type: 'furniture_grab_or_gone',
            priority: 60,
            content: {
                title: 'Grab or Gone',
                items: [
                    { title: 'Bedsheets', price: '₹299', image: 'https://loremflickr.com/400/300/bedsheet?lock=441', actionUrl: '/common-category/bedsheet-promo' },
                    { title: 'Curtains', price: '₹399', image: 'https://loremflickr.com/400/300/curtain?lock=442', actionUrl: '/common-category/curtain-promo' },
                    { title: 'Cushions', price: '₹99', image: 'https://loremflickr.com/400/300/cushion?lock=443', actionUrl: '/common-category/cushion-promo' },
                    { title: 'Towels', price: '₹199', image: 'https://loremflickr.com/400/300/towel?lock=444', actionUrl: '/common-category/towel-promo' }
                ]
            }
        },
        {
            id: 'furn_room',
            type: 'furniture_shop_by_room',
            priority: 70,
            content: {
                title: 'Shop By Room',
                headerActionUrl: '/furniture/collection/shop-by-room',
                items: [
                    { title: 'Living Room', image: 'https://loremflickr.com/400/400/livingroom?lock=451', color: '#FFF59D', actionUrl: '/common-category/living-room' },
                    { title: 'Bedroom', image: 'https://loremflickr.com/400/400/bedroom?lock=452', color: '#C5E1A5', actionUrl: '/common-category/bedroom' },
                    { title: 'Study', image: 'https://loremflickr.com/400/400/study,room?lock=453', color: '#90CAF9', actionUrl: '/common-category/study' },
                    { title: 'Dining', image: 'https://loremflickr.com/400/400/dining,room?lock=454', color: '#FFAB91', actionUrl: '/common-category/dining' }
                ]
            }
        },
        {
            id: 'furn_samarth',
            type: 'furniture_samarth_store',
            priority: 80,
            content: {
                title: 'Samarth Store',
                headerActionUrl: '/furniture/collection/samarth-store',
                items: [
                    { image: 'https://loremflickr.com/1000/300/handicraft,india?lock=461', actionUrl: '/common-category/samarth-store' }
                ]
            }
        },
        {
            id: 'furn_emi',
            type: 'furniture_emi_offers',
            priority: 90,
            content: {
                title: 'No Cost EMI Offers',
                headerActionUrl: '/furniture/collection/emi-offers',
                items: [
                    { title: 'Sofas', price: 'From ₹999/mo', image: 'https://loremflickr.com/300/400/sofa?lock=471', actionUrl: '/common-category/sofas' },
                    { title: 'Beds', price: 'From ₹899/mo', image: 'https://loremflickr.com/300/400/bed?lock=472', actionUrl: '/common-category/beds' },
                    { title: 'Dining', price: 'From ₹799/mo', image: 'https://loremflickr.com/300/400/dining,table?lock=473', actionUrl: '/common-category/dining-sets' }
                ]
            }
        },
        {
            id: 'furn_top_furn_brands',
            type: 'furniture_top_furniture_brands',
            priority: 100,
            content: {
                title: 'Top Furniture Brands',
                headerActionUrl: '/furniture/collection/top-brands',
                items: [
                    { logo: 'https://loremflickr.com/200/200/logo,brand?lock=481', actionUrl: '/common-category/brand1' },
                    { logo: 'https://loremflickr.com/200/200/logo,company?lock=482', actionUrl: '/common-category/brand2' },
                    { logo: 'https://loremflickr.com/200/200/logo,business?lock=483', actionUrl: '/common-category/brand3' },
                    { logo: 'https://loremflickr.com/200/200/logo,furniture?lock=484', actionUrl: '/common-category/brand4' },
                    { logo: 'https://loremflickr.com/200/200/logo,shop?lock=485', actionUrl: '/common-category/brand5' },
                    { isViewAll: true, actionUrl: '/furniture/collection/all-brands' }
                ]
            }
        },
        {
            id: 'furn_material',
            type: 'furniture_shop_by_material',
            priority: 110,
            content: {
                title: 'Shop By Material',
                headerActionUrl: '/furniture/collection/shop-by-material',
                items: [
                    { name: 'Solid Wood', image: 'https://loremflickr.com/300/300/wood,texture?lock=491', actionUrl: '/common-category/solid-wood' },
                    { name: 'Engineered Wood', image: 'https://loremflickr.com/300/300/plywood?lock=492', actionUrl: '/common-category/engineered-wood' },
                    { name: 'Metal', image: 'https://loremflickr.com/300/300/metal,furniture?lock=493', actionUrl: '/common-category/metal-furniture' },
                    { name: 'Glass', image: 'https://loremflickr.com/300/300/glass,table?lock=494', actionUrl: '/common-category/glass-furniture' }
                ]
            }
        },
        {
            id: 'furn_trending',
            type: 'furniture_trending_now',
            priority: 120,
            content: {
                title: 'Trending Now',
                headerActionUrl: '/furniture/collection/trending'
            }
        },
        {
            id: 'furn_wishlist',
            type: 'furniture_wishlist',
            priority: 130,
            content: {
                title: 'Add to Your Wishlist',
                headerActionUrl: '/furniture/collection/wishlist',
                items: [
                    { title: 'Recliners', price: 'Under ₹9999', image: 'https://loremflickr.com/300/300/recliner?lock=501', actionUrl: '/common-category/recliners' },
                    { title: 'Bookshelves', price: 'Under ₹2999', image: 'https://loremflickr.com/300/300/bookshelf?lock=502', actionUrl: '/common-category/bookshelves' },
                    { title: 'TV Units', price: 'Under ₹4999', image: 'https://loremflickr.com/300/300/tvunit?lock=503', actionUrl: '/common-category/tv-units' },
                    { title: 'Wardrobes', price: 'Under ₹7999', image: 'https://loremflickr.com/300/300/wardrobe?lock=504', actionUrl: '/common-category/wardrobes' }
                ]
            }
        },
        {
            id: 'furn_reviews',
            type: 'furniture_customer_reviews',
            priority: 140,
            content: {
                title: 'Reviews by Customers',
                headerActionUrl: '/furniture/collection/customer-reviews',
                items: [
                    { product: 'Wingback Chair', rating: 5, review: 'Amazing quality and comfort!', user: 'Priya S.', image: 'https://loremflickr.com/300/300/chair,wingback?lock=511', actionUrl: '/product/wingback-chair' },
                    { product: 'Queen Bed', rating: 4, review: 'Sturdy and looks great.', user: 'Rahul M.', image: 'https://loremflickr.com/300/300/bed,queen?lock=512', actionUrl: '/product/queen-bed' },
                    { product: 'Coffee Table', rating: 5, review: 'Perfect for my living room.', user: 'Sneha K.', image: 'https://loremflickr.com/300/300/coffeetable?lock=513', actionUrl: '/product/coffee-table' }
                ]
            }
        },
        {
            id: 'furn_everybody',
            type: 'furniture_everybody_list',
            priority: 150,
            content: {
                title: "On Everybody's List",
                headerActionUrl: '/furniture/collection/everybody-list',
                items: [
                    { title: 'Portable Tables', subtitle: 'Under ₹499', image: 'https://loremflickr.com/300/300/table,laptop?lock=521', actionUrl: '/common-category/portable-tables' },
                    { title: 'Hammocks', subtitle: 'Under ₹999', image: 'https://loremflickr.com/300/300/hammock?lock=522', actionUrl: '/common-category/hammocks' },
                    { title: 'Plant Stands', subtitle: 'Under ₹399', image: 'https://loremflickr.com/300/300/plantstand?lock=523', actionUrl: '/common-category/plant-stands' },
                    { title: 'Wall Shelves', subtitle: 'Under ₹299', image: 'https://loremflickr.com/300/300/wallshelf?lock=524', actionUrl: '/common-category/wall-shelves' }
                ]
            }
        },
        {
            id: 'furn_rare',
            type: 'furniture_rare_finds',
            priority: 160,
            content: {
                title: "Rare Finds",
                headerActionUrl: '/furniture/collection/rare-finds',
                items: [
                    { title: 'Handwoven', image: 'https://loremflickr.com/500/500/rug,woven?lock=531', actionUrl: '/common-category/handwoven' },
                    { title: 'Vintage', image: 'https://loremflickr.com/500/500/vintage,chair?lock=532', actionUrl: '/common-category/vintage' },
                    { title: 'Artistic', image: 'https://loremflickr.com/500/500/art,furniture?lock=533', actionUrl: '/common-category/artistic' }
                ]
            }
        },
        {
            id: 'furn_statement',
            type: 'furniture_statement_pieces',
            priority: 170,
            content: {
                title: 'Shop Statement Pieces',
                headerActionUrl: '/furniture/collection/statement-pieces',
                items: [
                    { title: 'Royal Sofa', image: 'https://loremflickr.com/500/600/sofa,royal?lock=541', actionUrl: '/common-category/royal-sofa' },
                    { title: 'Grand Bed', image: 'https://loremflickr.com/500/600/bed,luxury?lock=542', actionUrl: '/common-category/grand-bed' }
                ]
            }
        },
        {
            id: 'furn_grid',
            type: 'furniture_product_grid',
            priority: 180,
            content: {
                dataSource: { endpoint: '/api/products', params: { category: 'Furniture', limit: 10 } }
            }
        }
    ]
};

async function seedFurnitureLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'furniture' });
        await collection.insertOne(furnitureLayout);

        console.log("✅ Furniture Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding furniture layout:", err);
    } finally {
        await client.close();
    }
}

seedFurnitureLayout();
