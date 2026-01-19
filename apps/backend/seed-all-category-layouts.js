const { MongoClient } = require("mongodb");
require('dotenv').config();

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
                    { brand: 'Nike', offer: 'Min 40% Off', image: 'https://loremflickr.com/300/300/nike,shoes?lock=14', actionUrl: '/fashion/collection/nike' },
                    { brand: 'Adidas', offer: 'Min 30% Off', image: 'https://loremflickr.com/300/300/adidas,shoes?lock=15', actionUrl: '/fashion/collection/adidas' },
                    { brand: 'Puma', offer: 'Min 50% Off', image: 'https://loremflickr.com/300/300/puma,shoes?lock=16', actionUrl: '/fashion/collection/puma' }
                ]
            }
        },
        {
            id: 'fashion_festive',
            type: 'fashion_festive',
            priority: 50,
            content: {
                title: 'Sankranti Festival',
                headerActionUrl: '/fashion/collection/sankranti',
                items: [
                    { title: 'Kurtas', price: 'Under ₹499', image: 'https://loremflickr.com/300/300/kurta,ethnic?lock=17', actionUrl: '/fashion/collection/kurtas' },
                    { title: 'Sarees', price: 'Under ₹999', image: 'https://loremflickr.com/300/300/saree,ethnic?lock=18', actionUrl: '/fashion/collection/sarees' }
                ]
            }
        },
        {
            id: 'fashion_shoe_fest',
            type: 'fashion_shoe_fest',
            priority: 60,
            content: {
                title: "Shoe's Steal Fest",
                headerActionUrl: '/fashion/collection/shoe-steal-fest',
                items: [
                    { title: 'Sneakers', offer: 'Min 50% Off', image: 'https://loremflickr.com/300/300/sneakers,shoes?lock=19', actionUrl: '/fashion/collection/sneakers' },
                    { title: 'Formal', offer: 'Min 40% Off', image: 'https://loremflickr.com/300/300/formal,shoes?lock=20', actionUrl: '/fashion/collection/formal-shoes' }
                ]
            }
        },
        {
            id: 'fashion_winter_clearance',
            type: 'fashion_winter_clearance',
            priority: 70,
            content: {
                title: 'Winter Clearance Sale',
                headerActionUrl: '/fashion/collection/winter-clearance',
                items: [
                    { brand: 'H&M', offer: 'Flat 50% Off', image: 'https://loremflickr.com/300/300/coat,winter?lock=21', actionUrl: '/fashion/collection/hm' },
                    { brand: 'Zara', offer: 'Flat 40% Off', image: 'https://loremflickr.com/300/300/jacket,winter?lock=22', actionUrl: '/fashion/collection/zara' }
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
                headerActionUrl: '/fashion/collection/deals-of-the-day',
                items: [
                    { brand: 'Levis', offer: 'Min 40% Off', price: '₹999', image: 'https://loremflickr.com/300/300/jeans?lock=23', actionUrl: '/fashion/collection/levis' },
                    { brand: 'Gap', offer: 'Min 50% Off', price: '₹799', image: 'https://loremflickr.com/300/300/clothing?lock=24', actionUrl: '/fashion/collection/gap' }
                ]
            }
        },
        {
            id: 'fashion_budget_buys',
            type: 'fashion_budget_buys',
            priority: 90,
            content: {
                title: 'Budget Buys',
                headerActionUrl: '/fashion/collection/budget-buys',
                items: [
                    { price: '299', image: 'https://loremflickr.com/300/300/tshirt?lock=25', actionUrl: '/fashion/collection/under-299' },
                    { price: '499', image: 'https://loremflickr.com/300/300/dress?lock=26', actionUrl: '/fashion/collection/under-499' }
                ]
            }
        },
        {
            id: 'fashion_forecast',
            type: 'fashion_forecast',
            priority: 100,
            content: {
                title: 'FASHION FORECAST',
                headerActionUrl: '/fashion/collection/fashion-forecast',
                items: [
                    { title: 'SUMMER VIBES', sub: 'Cool & Breezy', align: 'left', image: 'https://loremflickr.com/600/400/summer,fashion?lock=27', actionUrl: '/fashion/collection/summer-vibes' },
                    { title: 'URBAN CHIC', sub: 'Street Style', align: 'right', image: 'https://loremflickr.com/600/400/urban,fashion?lock=28', actionUrl: '/fashion/collection/urban-chic' }
                ]
            }
        },
        {
            id: 'fashion_winter_collection',
            type: 'fashion_winter_collection',
            priority: 110,
            content: {
                title: 'Winter Collection ❄️',
                headerActionUrl: '/fashion/collection/winter-collection',
                items: [
                    { name: 'Jackets', offer: 'Min 30% Off', image: 'https://loremflickr.com/300/300/jacket?lock=29', actionUrl: '/fashion/collection/jackets' },
                    { name: 'Sweaters', offer: 'Min 40% Off', image: 'https://loremflickr.com/300/300/sweater?lock=30', actionUrl: '/fashion/collection/sweaters' }
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
// Note: 'electronics_banners' could be used if I add the case to SectionRenderer for beauty. 
// But beauty uses specific components. I'll stick to what is mapped.

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

// ============================================================================
// BOOKS LAYOUT
// ============================================================================
const booksLayout = {
    pageSlug: 'books',
    name: 'Books Page',
    isActive: true,
    sections: [
        {
            id: 'book_banners',
            type: 'fashion_banners',
            priority: 10,
            content: {
                banners: [
                    { imageUrl: 'https://loremflickr.com/1000/400/library,books?lock=301', actionUrl: '/category/fiction' },
                    { imageUrl: 'https://loremflickr.com/1000/400/reading,coffee?lock=302', actionUrl: '/category/non-fiction' },
                    { imageUrl: 'https://loremflickr.com/1000/400/bookstore?lock=303', actionUrl: '/category/best-sellers' }
                ]
            }
        },
        {
            id: 'book_subcats',
            type: 'book_subcategories',
            priority: 20,
            content: {
                dataSource: { endpoint: '/api/categories/books/subcategories', params: {} }
            }
        },
        {
            id: 'book_music',
            type: 'book_music_genres',
            priority: 30,
            content: {
                title: 'Music Genres',
                items: [
                    { name: 'Lo-Fi', subtitle: 'Beats to study', image: 'https://loremflickr.com/300/400/lofi,art?lock=311', gradientColors: ['#FF9A9E', '#FECFEF'], accentColor: '#FFF', actionUrl: '/music/lo-fi' },
                    { name: 'Classical', subtitle: 'Focus & Calm', image: 'https://loremflickr.com/300/400/violin?lock=312', gradientColors: ['#a18cd1', '#fbc2eb'], accentColor: '#FFF', actionUrl: '/music/classical' },
                    { name: 'Jazz', subtitle: 'Smooth vibes', image: 'https://loremflickr.com/300/400/saxophone?lock=313', gradientColors: ['#84fab0', '#8fd3f4'], accentColor: '#FFF', actionUrl: '/music/jazz' }
                ]
            }
        },
        {
            id: 'book_genres',
            type: 'book_genres',
            priority: 40,
            content: {
                title: 'Book Genres',
                items: [
                    { name: 'Thriller', subtitle: 'Edge of seat', image: 'https://loremflickr.com/300/400/mystery,book?lock=321', gradientColors: ['#434343', '#000000'], accentColor: '#FF0000', actionUrl: '/category/thriller' },
                    { name: 'Romance', subtitle: 'Love stories', image: 'https://loremflickr.com/300/400/romance,book?lock=322', gradientColors: ['#ff9a9e', '#fecfef'], accentColor: '#FFF', actionUrl: '/category/romance' },
                    { name: 'Sci-Fi', subtitle: 'Future worlds', image: 'https://loremflickr.com/300/400/space,art?lock=323', gradientColors: ['#0f0c29', '#302b63'], accentColor: '#00FFFF', actionUrl: '/category/sci-fi' }
                ]
            }
        },
        {
            id: 'book_brands',
            type: 'book_superstar_brands',
            priority: 50,
            content: {
                title: 'Superstar Brands',
                items: [
                    { logo: 'https://loremflickr.com/200/200/penguin,logo?lock=331', actionUrl: '/publisher/penguin' },
                    { logo: 'https://loremflickr.com/200/200/harper,logo?lock=332', actionUrl: '/publisher/harper-collins' },
                    { logo: 'https://loremflickr.com/200/200/scholastic,logo?lock=333', actionUrl: '/publisher/scholastic' },
                    { logo: 'https://loremflickr.com/200/200/marvel,logo?lock=334', actionUrl: '/publisher/marvel' },
                    { logo: 'https://loremflickr.com/200/200/dc,logo?lock=335', actionUrl: '/publisher/dc' }
                ]
            }
        },
        {
            id: 'book_authors',
            type: 'book_authors_best',
            priority: 60,
            content: {
                title: 'Authors Best Work',
                items: [
                    { image: 'https://loremflickr.com/300/400/author,man?lock=341', bgColor: '#FFEBEE', actionUrl: '/author/stephen-king' },
                    { image: 'https://loremflickr.com/300/400/author,woman?lock=342', bgColor: '#E3F2FD', actionUrl: '/author/jk-rowling' },
                    { image: 'https://loremflickr.com/300/400/writer?lock=343', bgColor: '#E0F2F1', actionUrl: '/author/dan-brown' }
                ]
            }
        },
        {
            id: 'book_budget',
            type: 'book_budget_carnival',
            priority: 70,
            content: {
                title: 'Budget Carnival',
                items: [
                    { name: 'Under ₹199', image: 'https://loremflickr.com/300/400/books,pile?lock=351', priceTag: 'Store', tagColor: '#F44336', actionUrl: '/store/under-199' },
                    { name: 'Under ₹299', image: 'https://loremflickr.com/300/400/reading?lock=352', priceTag: 'Store', tagColor: '#2196F3', actionUrl: '/store/under-299' },
                    { name: 'Under ₹499', image: 'https://loremflickr.com/300/400/library?lock=353', priceTag: 'Store', tagColor: '#4CAF50', actionUrl: '/store/under-499' }
                ]
            }
        },
        {
            id: 'book_grid',
            type: 'book_product_grid',
            priority: 80,
            content: {
                dataSource: { endpoint: '/api/products', params: { category: 'Books', limit: 10 } }
            }
        }
    ]
};

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

// ============================================================================
// HOME & KITCHEN LAYOUT
// ============================================================================
const homeLayout = {
    pageSlug: 'home-kitchen', // Matches the slug used in HomeCategoryPage
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


async function seedAllLayouts() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db();
        const pageLayoutsCollection = db.collection("pagelayouts");

        const layouts = [
            fashionLayout,
            beautyLayout,
            furnitureLayout,
            booksLayout,
            sportsLayout,
            homeLayout
        ];

        for (const layout of layouts) {
            const result = await pageLayoutsCollection.updateOne(
                { pageSlug: layout.pageSlug },
                {
                    $set: {
                        name: layout.name,
                        isActive: layout.isActive,
                        sections: layout.sections,
                        updatedAt: new Date()
                    },
                    $setOnInsert: {
                        createdAt: new Date()
                    }
                },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                console.log(`✅ Created ${layout.name} (Slug: ${layout.pageSlug})`);
            } else {
                console.log(`✅ Updated ${layout.name} (Slug: ${layout.pageSlug})`);
            }
        }

    } catch (error) {
        console.error("❌ Error seeding layouts:", error);
    } finally {
        await client.close();
        console.log("\n✅ MongoDB connection closed");
    }
}

seedAllLayouts();
