import { Router, Request, Response } from "express";
import { PageLayout, IPageSection } from "../models/page.layout.model";
import { requireAdmin } from "../middlewares/rbac";

const router = Router();

// Helper: Seed Home (migrated from old route) - Public for setup
router.post("/seed-layout/home", async (req: Request, res: Response) => {
    try {
        await PageLayout.deleteMany({ pageSlug: 'home' });

        const initialSections: IPageSection[] = [
            {
                id: 'hero_1',
                type: 'hero_carousel',
                adminLabel: 'Main Hero Banner',
                priority: 10,
                content: {
                    banners: [
                        { imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/sale' },
                        { imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/fashion' }
                    ]
                }
            },
            {
                id: 'recent_1',
                type: 'recent_history',
                title: 'Keep shopping for',
                adminLabel: 'Recent History',
                priority: 20,
                content: {}
            },
            {
                id: 'grocery_1',
                type: 'grocery_row',
                title: 'Grocery Essentials',
                adminLabel: 'Grocery Row',
                priority: 30,
                content: { categoryId: 'grocery' }
            },
            {
                id: 'trending_1',
                type: 'product_list_horizontal',
                title: 'Trending near you',
                adminLabel: 'Trending List',
                priority: 40,
                content: {
                    dataSource: { endpoint: '/api/products', params: { sort: 'most_viewed', limit: 10 } }
                }
            },
            {
                id: 'curated_1',
                type: 'curated_collections',
                title: 'Curated For You',
                adminLabel: 'Curated Collections',
                priority: 50,
                content: {}
            },
            {
                id: 'lightning_1',
                type: 'lightning_deals',
                title: 'Lightning Deals',
                adminLabel: 'Lightning Deals',
                priority: 60,
                content: {}
            },
            {
                id: 'kitchen_1',
                type: 'grand_kitchen',
                title: 'Grand Kitchen Sale',
                adminLabel: 'Kitchen Sale Banner',
                priority: 70,
                content: {
                    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                    actionUrl: '/category/kitchen',
                    height: 200
                }
            },
            {
                id: 'fifty_1',
                type: 'fifty_percent_off',
                title: 'Min. 50% Off',
                adminLabel: '50% Off Zone',
                priority: 80,
                content: {}
            }
        ];

        const layout = await PageLayout.create({
            pageSlug: 'home',
            name: 'Home Page',
            description: 'Main application homepage',
            isActive: true,
            sections: initialSections
        });

        res.json({ message: "Seeded home", layout });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Helper: Seed Fashion Page
router.post("/seed-layout/fashion", async (req: Request, res: Response) => {
    try {
        await PageLayout.deleteMany({ pageSlug: 'fashion' });

        const initialSections: IPageSection[] = [
            {
                id: 'fashion_hero_1',
                type: 'fashion_banners',
                adminLabel: 'Fashion Main Hero',
                priority: 10,
                content: {
                    banners: [
                        { imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/fashion' },
                        { imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/sale' },
                        { imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/new-arrivals' }
                    ]
                }
            },
            {
                id: 'fashion_subcats_1',
                type: 'fashion_subcategories',
                adminLabel: 'Fashion Subcategories',
                priority: 20,
                content: {
                    dataSource: { endpoint: '/api/categories/fashion/subcategories' },
                    // Placeholder items if API fails or during loading (optional, currently component uses items as init state)
                    items: []
                }
            },
            {
                id: 'fashion_shopping_others_1',
                type: 'fashion_shopping_others',
                title: 'Shopping for others?',
                adminLabel: 'Shopping For Others',
                priority: 30,
                content: {
                    headerActionUrl: '/fashion/shopping-for-others',
                    items: [
                        { name: 'Women', slug: 'women', image: 'https://loremflickr.com/400/400/woman,fashion?lock=1', actionUrl: '/fashion/collection/women' },
                        { name: 'Gen Z Drips', slug: 'gen-z-drips', image: 'https://loremflickr.com/400/400/couple,fashion?lock=2', actionUrl: '/fashion/collection/gen-z-drips' },
                        { name: 'Kids', slug: 'kids', image: 'https://loremflickr.com/400/400/kids,fashion?lock=3', actionUrl: '/fashion/collection/kids' },
                        { name: 'Men', slug: 'men', image: 'https://loremflickr.com/400/400/man,fashion?lock=4', actionUrl: '/fashion/collection/men' },
                        { name: 'Luxe', slug: 'luxe', image: 'https://loremflickr.com/400/400/luxury,fashion?lock=5', actionUrl: '/fashion/collection/luxe' },
                    ]
                }
            },
            {
                id: 'fashion_early_bird_1',
                type: 'fashion_early_bird',
                title: 'Early Bird Deals!',
                adminLabel: 'Early Bird Deals',
                priority: 40,
                content: {
                    headerActionUrl: '/fashion/early-bird',
                    items: [
                        { id: 'dummy_cat_01', brand: 'USPA & more', offer: 'Min. 60% Off', image: 'https://loremflickr.com/300/400/shirt,men?lock=10', actionUrl: '/category/uspa' },
                        { id: 'dummy_cat_02', brand: 'PUMA & more', offer: 'Min. 70% Off', image: 'https://loremflickr.com/300/400/shoes,sneakers?lock=11', actionUrl: '/category/puma' },
                        { id: 'dummy_cat_03', brand: 'Titan & more', offer: '30-60% Off', image: 'https://loremflickr.com/300/400/watch?lock=12', actionUrl: '/category/titan' },
                        { id: 'dummy_cat_04', brand: 'Levis & more', offer: 'Min. 50% Off', image: 'https://loremflickr.com/300/400/jeans?lock=13', actionUrl: '/category/levis' },
                    ]
                }
            },
            {
                id: 'fashion_festive_1',
                type: 'fashion_festive',
                title: 'Shine bright this Sankranti',
                adminLabel: 'Sankranti Specials',
                priority: 50,
                content: {
                    headerActionUrl: '/fashion/sankranti',
                    items: [
                        { id: 'sankranti_cat_01', title: 'Short kurtas', price: 'From ₹199', image: 'https://loremflickr.com/300/400/kurta,men?lock=20', actionUrl: '/category/kurtas' },
                        { id: 'sankranti_cat_02', title: 'Kurtas & sets', price: 'From ₹299', image: 'https://loremflickr.com/300/400/kurta,man?lock=21', actionUrl: '/category/sets' },
                        { id: 'sankranti_cat_03', title: 'Ethnic sets', price: 'Under ₹499', image: 'https://loremflickr.com/300/400/kid,ethnic?lock=22', actionUrl: '/category/ethnic' },
                    ]
                }
            },
            {
                id: 'fashion_shoe_fest_1',
                type: 'fashion_shoe_fest',
                title: 'Shoe\'s steal Fest',
                adminLabel: 'Shoe Fest',
                priority: 60,
                content: {
                    headerActionUrl: '/fashion/shoe-fest',
                    items: [
                        { id: 'shoes_cat_01', title: 'Men’s sneakers', offer: 'Min. 70% Off', image: 'https://loremflickr.com/300/400/sneakers?lock=30', actionUrl: '/category/sneakers' },
                        { id: 'shoes_cat_02', title: 'Heels, wedges & more', offer: 'Under ₹499', image: 'https://loremflickr.com/300/400/heels?lock=31', actionUrl: '/category/heels' },
                        { id: 'shoes_cat_03', title: 'Men’s sports shoes', offer: 'Under ₹449', image: 'https://loremflickr.com/300/400/sportshoes?lock=32', actionUrl: '/category/sports-shoes' },
                    ]
                }
            },
            {
                id: 'fashion_winter_clearance_1',
                type: 'fashion_winter_clearance',
                title: 'Winter Clearance Sale is live!',
                adminLabel: 'Winter Clearance',
                priority: 70,
                content: {
                    headerActionUrl: '/fashion/winter-clearance',
                    items: [
                        { offer: 'Min. 60% Off', brand: 'FORT COLLINS', image: 'https://loremflickr.com/300/400/winter,jacket?lock=40', actionUrl: '/category/winter' },
                        { offer: 'Min. 50% Off', brand: 'MONTE CARLO', image: 'https://loremflickr.com/300/400/jacket,men?lock=41', actionUrl: '/category/winter' },
                    ]
                }
            },
            {
                id: 'fashion_deals_day_1',
                type: 'fashion_deals_of_day',
                title: 'Deals of the Day',
                adminLabel: 'Deals of the Day',
                priority: 75,
                content: {
                    title: 'Deals of the Day',
                    subtitle: 'Clock is ticking!',
                    headerActionUrl: '/fashion/deals-of-day',
                    items: [
                        { brand: 'Flying Machine', offer: 'Min. 40% Off', price: 'Under ₹999', image: 'https://loremflickr.com/300/400/jeans,men?lock=50', actionUrl: '/category/flying-machine' },
                        { brand: 'U.S. Polo Assn', offer: 'Min. 30% Off', price: 'Under ₹1299', image: 'https://loremflickr.com/300/400/shirt,polo?lock=51', actionUrl: '/category/uspa' },
                        { brand: 'Puma', offer: 'Min. 50% Off', price: 'Under ₹1499', image: 'https://loremflickr.com/300/400/shoes,running?lock=52', actionUrl: '/category/puma' },
                    ]
                }
            },
            {
                id: 'fashion_budget_buys_1',
                type: 'fashion_budget_buys',
                title: 'Budget Buys',
                adminLabel: 'Budget Buys',
                priority: 80,
                content: {
                    headerActionUrl: '/fashion/budget-buys',
                    items: [
                        { price: '299', image: 'https://loremflickr.com/300/300/fashion,woman?lock=60', actionUrl: '/category/budget-299' },
                        { price: '399', image: 'https://loremflickr.com/300/300/fashion,man?lock=61', actionUrl: '/category/budget-399' },
                        { price: '699', image: 'https://loremflickr.com/300/300/fashion,model?lock=62', actionUrl: '/category/budget-699' },
                        { price: '999', image: 'https://loremflickr.com/300/300/fashion,dress?lock=63', actionUrl: '/category/budget-999' },
                    ]
                }
            },
            {
                id: 'fashion_forecast_1',
                type: 'fashion_forecast',
                title: 'FASHION FORECAST',
                adminLabel: 'Fashion Forecast',
                priority: 90,
                content: {
                    headerActionUrl: '/fashion/forecast',
                    items: [
                        { title: 'TEXTURED\nSWEATERS', sub: 'From ₹249', image: 'https://loremflickr.com/400/200/sweater,man?lock=70', align: 'left', actionUrl: '/category/forecast-sweaters' },
                        { title: 'BAGGY\nJEANS', sub: 'Min. 60% Off', image: 'https://loremflickr.com/400/200/jeans,legs?lock=71', align: 'right', actionUrl: '/category/forecast-jeans' },
                        { title: 'PUFFER\nJACKETS', sub: 'Under ₹999', image: 'https://loremflickr.com/400/200/jacket,fashion?lock=72', align: 'left', actionUrl: '/category/forecast-jackets' },
                        { title: 'PARTY\nDRESSES', sub: 'Min. 50% Off', image: 'https://loremflickr.com/400/200/dress,party?lock=73', align: 'right', actionUrl: '/category/forecast-dresses' },
                    ]
                }
            },
            {
                id: 'fashion_winter_collection_1',
                type: 'fashion_winter_collection',
                title: 'Winter collection',
                adminLabel: 'Winter Collection',
                priority: 100,
                content: {
                    headerActionUrl: '/fashion/winter-collection',
                    items: [
                        { name: 'PUMA, USPA...', offer: 'Min. 50% Off', image: 'https://loremflickr.com/200/250/man,jacket?lock=80', actionUrl: '/category/winter-puma' },
                        { name: 'Allen Solly...', offer: 'Min. 50% Off', image: 'https://loremflickr.com/200/250/man,sweater?lock=81', actionUrl: '/category/winter-allen' },
                    ]
                }
            },
            {
                id: 'fashion_products_1',
                type: 'fashion_product_grid',
                title: 'Latest in Fashion',
                adminLabel: 'Latest Products',
                priority: 110,
                content: {
                    dataSource: { endpoint: '/api/products', params: { category: 'Fashion', limit: 10 } }
                }
            }
        ];

        const layout = await PageLayout.create({
            pageSlug: 'fashion',
            name: 'Fashion Page',
            description: 'Main fashion category page',
            isActive: true,
            sections: initialSections
        });

        res.json({ message: "Seeded fashion", layout });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to seed fashion", message: error.message });
    }
});

// Helper: Seed Beauty Page
router.post("/seed-layout/beauty", async (req: Request, res: Response) => {
    try {
        await PageLayout.deleteMany({ pageSlug: 'beauty' });

        const initialSections: IPageSection[] = [
            {
                id: 'beauty_hero_1',
                type: 'fashion_banners', // Reusing generic banner component
                adminLabel: 'Beauty Hero Banners',
                priority: 10,
                content: {
                    banners: [
                        { imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/beauty-sale' },
                        { imageUrl: 'https://images.unsplash.com/photo-1571781565023-40f8d4752541?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/makeup' },
                        { imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/skincare' }
                    ]
                }
            },
            {
                id: 'beauty_subcats_1',
                type: 'beauty_subcategories',
                adminLabel: 'Beauty Subcategories',
                priority: 20,
                content: {
                    dataSource: { endpoint: '/api/categories/beauty/subcategories' },
                    items: []
                }
            },
            {
                id: 'beauty_promo_1',
                type: 'beauty_promo_poster',
                adminLabel: 'Beauty Promo Poster',
                priority: 30,
                content: {
                    image: 'https://loremflickr.com/800/200/makeup,banner?lock=100'
                }
            },
            {
                id: 'beauty_harvest_1',
                type: 'beauty_glow_harvest',
                title: 'Glow for the harvest',
                adminLabel: 'Glow for Harvest',
                priority: 40,
                content: {
                    items: [
                        { name: 'Lipstick', offer: 'Min. 40% Off', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/lipstick' },
                        { name: 'Eye Makeup', offer: 'Up to 70% Off', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/eye-makeup' },
                        { name: 'Foundations', offer: 'Under ₹499', image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/foundations' },
                        { name: 'Skincare', offer: 'Min. 30% Off', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/skincare' },
                    ]
                }
            },
            {
                id: 'beauty_consultation_1',
                type: 'beauty_consultation',
                title: 'Consultation',
                adminLabel: 'Consultation Banner',
                priority: 50,
                content: {}
            },
            {
                id: 'beauty_trending_1',
                type: 'beauty_trending_brands',
                title: 'Trending brands',
                adminLabel: 'Trending Brands',
                priority: 60,
                content: {
                    headerActionUrl: '/beauty/trending',
                    items: [
                        { name: 'Vaseline', offer: 'Up to 70% Off', bg: '#FFEBEE', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/vaseline' },
                        { name: 'NIVEA', offer: 'Up to 65% Off', bg: '#FCE4EC', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/nivea' },
                        { name: 'Wottagirl!', offer: 'Up to 60% Off', bg: '#F8BBD0', image: 'https://images.unsplash.com/photo-1594038683693-00a0899386c6?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/wottagirl' },
                        { name: 'DENVER', offer: 'Up to 65% Off', bg: '#FFCDD2', image: 'https://images.unsplash.com/photo-1615108422115-3bd44f291307?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/denver' },
                        { name: 'Swiss Beauty', offer: 'Under ₹299', bg: '#FCE4EC', image: 'https://images.unsplash.com/photo-1591327164292-444b79e27303?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/swiss-beauty' },
                        { name: "L'ORÉAL", offer: 'Up to 35% Off', bg: '#F48FB1', image: 'https://images.unsplash.com/photo-1571781565023-40f8d4752541?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/loreal' },
                    ]
                }
            },
            {
                id: 'beauty_alisters_1',
                type: 'beauty_alisters',
                title: 'Globally loved A-listers',
                adminLabel: 'A-Listers',
                priority: 70,
                content: {
                    items: [
                        { brand: 'MAYBELLINE', subBrand: 'NEW YORK', offer: 'Min. 20% Off', model: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400&q=80', product: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=200&q=80', bg: '#FFE0B2', actionUrl: '/category/maybelline' },
                        { brand: 'COLORBAR', offer: 'Up to 40% Off', model: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', product: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=200&q=80', bg: '#FFF3E0', actionUrl: '/category/colorbar' },
                        { brand: "L'ORÉAL", subBrand: 'PROFESSIONNEL PARIS', offer: 'Up to 20% Off', model: 'https://images.unsplash.com/photo-1583195763986-0231cf1db3fd?auto=format&fit=crop&w=400&q=80', product: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80', bg: '#FFECB3', actionUrl: '/category/loreal-pro' },
                        { brand: 'Dove', offer: 'Up to 40% Off', model: 'https://images.unsplash.com/photo-1552699609-899684617562?auto=format&fit=crop&w=400&q=80', product: 'https://images.unsplash.com/photo-1556228720-1957be979c29?auto=format&fit=crop&w=200&q=80', bg: '#FFE0B2', actionUrl: '/category/dove' },
                    ]
                }
            },
            {
                id: 'beauty_launch_party_1',
                type: 'beauty_launch_party',
                title: 'The Launch Party',
                adminLabel: 'Launch Party',
                priority: 80,
                content: {
                    headerActionUrl: '/beauty/launch-party',
                    items: [
                        { brand: "L'ORÉAL PARIS", image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', offer: 'Up to 25% Off', actionUrl: '/category/loreal-paris' },
                        { brand: 'SKIN1004', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80', offer: 'Up to 25% Off', actionUrl: '/category/skin1004' },
                        { brand: 'Glazed Makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=400&q=80', offer: 'Up to 40% Off', actionUrl: '/category/glazed-makeup' },
                    ]
                }
            },
            {
                id: 'beauty_trend_more_1',
                type: 'beauty_trend_more',
                title: 'Trend more, spend less',
                adminLabel: 'Trend More',
                priority: 90,
                content: {
                    headerActionUrl: '/beauty/trend-more',
                    items: [
                        { title: 'Glazed makeup', image: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?auto=format&fit=crop&w=400&q=80', brands: 'SUGAR | RENEE', offer: 'Up to 50% Off', actionUrl: '/category/glazed-makeup' },
                        { title: 'Glass skin', image: 'https://images.unsplash.com/photo-1512257771764-da7f912cd71a?auto=format&fit=crop&w=400&q=80', brands: 'COSRX | THE FACE SHOP', offer: 'Up to 60% Off', actionUrl: '/category/glass-skin' },
                        { title: 'Bold Lips', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80', brands: 'LAKME | MAYBELLINE', offer: 'Up to 40% Off', actionUrl: '/category/bold-lips' },
                    ]
                }
            },
            {
                id: 'beauty_internet_famed_1',
                type: 'beauty_internet_famed',
                title: 'Internet-famed brands',
                adminLabel: 'Internet Famed',
                priority: 100,
                content: {
                    headerActionUrl: '/beauty/internet-famed',
                    items: [
                        { brand: 'PLIX', desc: 'Anti-hairfall shampoo...', offer: 'Up to 30% Off', image: 'https://images.unsplash.com/photo-1556228578-8d84f55d9185?auto=format&fit=crop&w=200&q=80', bg: ['#F8BBD0', '#EC407A'], actionUrl: '/category/plix' },
                        { brand: 'MOXIE', desc: 'Dry shampoos, wax sticks...', offer: 'Up to 10% Off', image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=200&q=80', bg: ['#F48FB1', '#E91E63'], actionUrl: '/category/moxie' },
                        { brand: 'foxtale', desc: 'Face wash, face serums...', offer: 'Up to 30% Off', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=200&q=80', bg: ['#FFCCBC', '#F06292'], actionUrl: '/category/foxtale' },
                        { brand: 'mCaffeine', desc: 'Face & body scrubs...', offer: 'From ₹149', image: 'https://images.unsplash.com/photo-1558222043-4f94480bf131?auto=format&fit=crop&w=200&q=80', bg: ['#FFAB91', '#F4511E'], actionUrl: '/category/mcaffeine' },
                        { brand: 'paradyes', desc: 'Hair tint, hair dye...', offer: 'From ₹299', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80', bg: ['#F48FB1', '#E91E63'], actionUrl: '/category/paradyes' },
                        { brand: 'pilgrim', desc: 'Hair growth serums...', offer: 'Under ₹499', image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=200&q=80', bg: ['#F8BBD0', '#EC407A'], actionUrl: '/category/pilgrim' },
                    ]
                }
            },
            {
                id: 'beauty_k_beauty_1',
                type: 'beauty_k_beauty',
                title: 'K-Beauty obsessed?',
                adminLabel: 'K-Beauty',
                priority: 110,
                content: {
                    headerActionUrl: '/beauty/k-beauty',
                    items: [
                        { brand: 'TIRTIR', ingredientTitle: 'Star\ningredient', ingredient: 'Niacinamide', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', bg: '#880E4F', offer: 'Up to 20% Off', actionUrl: '/category/tirtir' },
                        { brand: 'COSRX', ingredientTitle: 'Star\ningredient', ingredient: 'Snail Mucin', image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=600&q=80', bg: '#FFF9C4', offer: 'Up to 25% Off', darkText: true, actionUrl: '/category/cosrx' },
                        { brand: 'Innisfree', ingredientTitle: 'Star\ningredient', ingredient: 'Green Tea', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80', bg: '#C8E6C9', offer: 'From ₹499', darkText: true, actionUrl: '/category/innisfree' },
                    ]
                }
            },
            {
                id: 'beauty_glam_budget_1',
                type: 'beauty_glam_budget',
                title: 'Glam on a budget',
                adminLabel: 'Glam Budget',
                priority: 120,
                content: {
                    items: [
                        { label: 'Under', value: '₹199', bg: ['#FFFDE7', '#FFD54F'], actionUrl: '/category/under-199' },
                        { label: 'Under', value: '₹299', bg: ['#FFFDE7', '#FFD54F'], actionUrl: '/category/under-299' },
                        { label: 'Under', value: '₹399', bg: ['#FFFDE7', '#FFD54F'], actionUrl: '/category/under-399' },
                        { label: 'Min.', value: '30%', sub: 'Off', bg: ['#FFECB3', '#FFCA28'], actionUrl: '/category/min-30' },
                        { label: 'Min.', value: '50%', sub: 'Off', bg: ['#FFECB3', '#FFCA28'], actionUrl: '/category/min-50' },
                        { label: 'Min.', value: '70%', sub: 'Off', bg: ['#FFECB3', '#FFCA28'], actionUrl: '/category/min-70' },
                    ]
                }
            },
            {
                id: 'beauty_product_grid_1',
                type: 'beauty_product_grid',
                title: 'Latest in Beauty',
                adminLabel: 'Latest Products',
                priority: 130,
                content: {
                    dataSource: { endpoint: '/api/products', params: { category: 'Beauty', limit: 10 } }
                }
            }
        ];

        const layout = await PageLayout.create({
            pageSlug: 'beauty',
            name: 'Beauty Page',
            description: 'Main beauty category page',
            isActive: true,
            sections: initialSections
        });

        res.json({ message: "Seeded beauty", layout });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to seed beauty", message: error.message });
    }
});

// Helper: Seed Home & Kitchen Page
router.post("/seed-layout/home-kitchen", async (req: Request, res: Response) => {
    try {
        await PageLayout.deleteMany({ pageSlug: 'home-kitchen' });

        const initialSections: IPageSection[] = [
            {
                id: 'home_hero_1',
                type: 'fashion_banners', // Reusing generic banner component as it fits perfectly (slider)
                adminLabel: 'Home Hero Banners',
                priority: 10,
                content: {
                    banners: [
                        { imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/kitchen-sale' },
                        { imageUrl: 'https://images.unsplash.com/photo-1616486338812-3lcel0s0c0q0?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/decor-sale' }
                    ]
                }
            },
            {
                id: 'home_subcats_1',
                type: 'home_subcategories',
                adminLabel: 'Home Subcategories',
                priority: 20,
                content: {
                    dataSource: { endpoint: '/api/categories/home-kitchen/subcategories' },
                    items: []
                }
            },
            {
                id: 'home_kitchen_1',
                type: 'home_kitchen_bestsellers',
                title: 'Kitchen Bestsellers',
                adminLabel: 'Kitchen Bestsellers',
                priority: 30,
                content: {
                    headerActionUrl: '/home/collection/kitchen-bestsellers',
                    items: [
                        { title: 'Kitchen Item 1', price: 'Min. 40% Off', image: 'https://loremflickr.com/300/300/kitchen,ware?lock=1', actionUrl: '/category/kitchen-1' },
                        { title: 'Kitchen Item 2', price: 'Min. 40% Off', image: 'https://loremflickr.com/300/300/kitchen,ware?lock=2', actionUrl: '/category/kitchen-2' },
                        { title: 'Kitchen Item 3', price: 'Min. 40% Off', image: 'https://loremflickr.com/300/300/kitchen,ware?lock=3', actionUrl: '/category/kitchen-3' },
                        { title: 'Kitchen Item 4', price: 'Min. 40% Off', image: 'https://loremflickr.com/300/300/kitchen,ware?lock=4', actionUrl: '/category/kitchen-4' },
                    ]
                }
            },
            {
                id: 'home_decor_1',
                type: 'home_decor_trends',
                title: 'Home Decor Trends',
                adminLabel: 'Decor Trends',
                priority: 40,
                content: {
                    headerActionUrl: '/home/collection/home-decor-trends',
                    items: [
                        { title: 'Decor Item 0', price: 'Trending Now', image: 'https://loremflickr.com/300/300/decor,home?lock=10', actionUrl: '/category/decor-0' },
                        { title: 'Decor Item 1', price: 'Trending Now', image: 'https://loremflickr.com/300/300/decor,home?lock=11', actionUrl: '/category/decor-1' },
                        { title: 'Decor Item 2', price: 'Trending Now', image: 'https://loremflickr.com/300/300/decor,home?lock=12', actionUrl: '/category/decor-2' },
                        { title: 'Decor Item 3', price: 'Trending Now', image: 'https://loremflickr.com/300/300/decor,home?lock=13', actionUrl: '/category/decor-3' },
                    ]
                }
            },
            {
                id: 'home_furnishing_1',
                type: 'home_furnishing_deals',
                title: 'Furnishing Deals',
                adminLabel: 'Furnishing Deals',
                priority: 50,
                content: {
                    headerActionUrl: '/home/collection/furnishing-deals',
                    items: [
                        { title: 'Furnishing 0', price: 'Under $50', image: 'https://loremflickr.com/300/300/curtains,rugs?lock=20', actionUrl: '/category/furnishing-0' },
                        { title: 'Furnishing 1', price: 'Under $50', image: 'https://loremflickr.com/300/300/curtains,rugs?lock=21', actionUrl: '/category/furnishing-1' },
                        { title: 'Furnishing 2', price: 'Under $50', image: 'https://loremflickr.com/300/300/curtains,rugs?lock=22', actionUrl: '/category/furnishing-2' },
                        { title: 'Furnishing 3', price: 'Under $50', image: 'https://loremflickr.com/300/300/curtains,rugs?lock=23', actionUrl: '/category/furnishing-3' },
                    ]
                }
            },
            {
                id: 'home_product_grid_1',
                type: 'home_product_grid',
                title: 'Latest in Home & Kitchen',
                adminLabel: 'Latest Products',
                priority: 60,
                content: {
                    dataSource: { endpoint: '/api/products', params: { category: 'Home & Kitchen', limit: 10 } }
                }
            }
        ];

        const layout = await PageLayout.create({
            pageSlug: 'home-kitchen',
            name: 'Home & Kitchen Page',
            description: 'Main home & kitchen category page',
            isActive: true,
            sections: initialSections
        });

        res.json({ message: "Seeded home-kitchen", layout });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to seed home-kitchen", message: error.message });
    }
});

// Helper: Seed Sports Page
router.post("/seed-layout/sports", async (req: Request, res: Response) => {
    try {
        await PageLayout.deleteMany({ pageSlug: 'sports' });

        const initialSections: IPageSection[] = [
            {
                id: 'sport_hero_1',
                type: 'fashion_banners', // Reusing generic slider
                adminLabel: 'Sport Hero Banners',
                priority: 10,
                content: {
                    banners: [
                        { imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/sports-sale' },
                        { imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/gym-gear' }
                    ]
                }
            },
            {
                id: 'sport_subcats_1',
                type: 'sport_subcategories',
                adminLabel: 'Sport Subcategories',
                priority: 20,
                content: {
                    dataSource: { endpoint: '/api/categories/sports/subcategories' },
                    items: []
                }
            },
            {
                id: 'sport_cricket_1',
                type: 'sport_cricket_season',
                title: 'Cricket season kick off',
                adminLabel: 'Cricket Season',
                priority: 30,
                content: {
                    headerActionUrl: '/sports/collection/cricket-season',
                    items: [
                        { mainText: 'MATCH DAY', subText: 'ESSENTIALS', bgImage: 'https://images.unsplash.com/photo-1531415074984-61e663ba38cb?auto=format&fit=crop&q=80&w=500', actionUrl: '/category/cricket-essentials' },
                        { title: 'Cricket kits', offer: 'Min. 60% Off', image: 'https://loremflickr.com/300/400/cricket,bag?lock=101', actionUrl: '/category/cricket-kits' },
                        { title: 'Batting Gear', offer: 'Up to 50% Off', image: 'https://loremflickr.com/300/400/cricket,bat?lock=102', actionUrl: '/category/batting-gear' }
                    ]
                }
            },
            {
                id: 'sport_winner_1',
                type: 'sport_winner_brands',
                title: 'Winner brands',
                adminLabel: 'Winner Brands',
                priority: 40,
                content: {
                    headerActionUrl: '/sports/collection/winner-brands',
                    items: [
                        { brand: 'LEADER CYCLES', offer: 'Min. 40% Off', image: 'https://loremflickr.com/400/400/bicycle?lock=200', logoColor: '#DC2626', actionUrl: '/category/leader-cycles' },
                        { brand: 'NIVIA', offer: 'Min. 30% Off', image: 'https://loremflickr.com/400/400/football?lock=201', logoColor: '#000000', actionUrl: '/category/nivia' },
                        { brand: 'VECTOR X', offer: 'Min. 50% Off', image: 'https://loremflickr.com/400/400/gym?lock=202', logoColor: '#2563EB', actionUrl: '/category/vector-x' }
                    ]
                }
            },
            {
                id: 'sport_goals_1',
                type: 'sport_support_goals',
                title: 'Support your goals',
                adminLabel: 'Support Goals',
                priority: 50,
                content: {
                    headerActionUrl: '/sports/collection/support-goals',
                    items: [
                        { titleLines: ['BODY', 'BUILDING'], subtitle: 'Build strength,\none rep at a time!', bgImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800', gradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)'], actionUrl: '/category/bodybuilding' },
                        { titleLines: ['DAILY', 'LEVELS'], subtitle: 'Train every day,\nsharpen the mind!', bgImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800', gradient: ['rgba(2, 132, 199, 0.4)', 'rgba(8, 47, 73, 0.9)'], actionUrl: '/category/daily-training' }
                    ]
                }
            },
            {
                id: 'sport_accessories_1',
                type: 'sport_gym_accessories',
                title: 'Gym-approved accessories',
                adminLabel: 'Gym Accessories',
                priority: 60,
                content: {
                    headerActionUrl: '/sports/collection/gym-accessories',
                    items: [
                        { title: 'Duffle\nbags', discount: 'Min. 40% Off', image: 'https://loremflickr.com/300/300/gym,bag?lock=1', actionUrl: '/category/duffle-bags' },
                        { title: 'Training\ngloves', discount: 'Up to 60% Off', image: 'https://loremflickr.com/300/300/gloves,gym?lock=2', actionUrl: '/category/training-gloves' },
                        { title: 'Shakers\n& sippers', discount: 'Up to 75% Off', image: 'https://loremflickr.com/300/300/shaker,bottle?lock=3', actionUrl: '/category/shakers' },
                        { title: 'Resistance\ntubes', discount: 'Min. 55% Off', image: 'https://loremflickr.com/300/300/resistance,band?lock=4', actionUrl: '/category/resistance-tubes' }
                    ]
                }
            },
            {
                id: 'sport_combos_1',
                type: 'sport_combos',
                title: 'Sports combos',
                adminLabel: 'Sports Combos',
                priority: 70,
                content: {
                    headerActionUrl: '/sports/collection/sports-combos',
                    items: [
                        { title: 'Swimming kits', discount: 'Min. 50% Off', image: 'https://loremflickr.com/200/200/swimming,goggles?lock=10', actionUrl: '/category/swimming-kits' },
                        { title: 'Punching kits', discount: 'Min. 40% Off', image: 'https://loremflickr.com/200/200/boxing,gloves?lock=11', actionUrl: '/category/punching-kits' },
                        { title: 'Badminton kits', discount: 'Min. 40% Off', image: 'https://loremflickr.com/200/200/badminton,racket?lock=12', actionUrl: '/category/badminton-kits' },
                        { title: 'Football kits', discount: 'Min. 60% Off', image: 'https://loremflickr.com/200/200/football,ball?lock=13', actionUrl: '/category/football-kits' },
                        { title: 'Skating kits', discount: 'Up to 75% Off', image: 'https://loremflickr.com/200/200/skateboard?lock=14', actionUrl: '/category/skating-kits' },
                        { title: 'Cycling kits', discount: 'Min. 40% Off', image: 'https://loremflickr.com/200/200/bicycle,light?lock=15', actionUrl: '/category/cycling-kits' }
                    ]
                }
            },
            {
                id: 'sport_savings_1',
                type: 'sport_savings',
                title: 'Score big savings on sports',
                adminLabel: 'Big Savings',
                priority: 80,
                content: {
                    headerActionUrl: '/sports/collection/big-savings',
                    items: [
                        { title: 'BADMINTON\nGEAR', offer: 'Min. 50% Off', bgImage: 'https://images.unsplash.com/photo-1626224583764-847890e0e99b?auto=format&fit=crop&q=80&w=800', gradient: ['rgba(8, 47, 73, 0.4)', 'rgba(8, 47, 73, 0.9)'], actionUrl: '/category/badminton-gear' },
                        { title: 'SWIM\nGEAR', offer: 'Up to 60% Off', bgImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=800', gradient: ['rgba(12, 74, 110, 0.4)', 'rgba(2, 132, 199, 0.9)'], actionUrl: '/category/swim-gear' }
                    ]
                }
            },
            {
                id: 'sport_product_grid_1',
                type: 'sport_product_grid',
                title: 'Latest in Sports',
                adminLabel: 'Latest Products',
                priority: 90,
                content: {
                    dataSource: { endpoint: '/api/products', params: { category: 'Sports', limit: 10 } }
                }
            }
        ];

        const layout = await PageLayout.create({
            pageSlug: 'sports',
            name: 'Sports Page',
            description: 'Main sports category page',
            isActive: true,
            sections: initialSections
        });

        res.json({ message: "Seeded sports", layout });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to seed sports", message: error.message });
    }
});

// Helper: Seed Books Page
router.post("/seed-layout/books", async (req: Request, res: Response) => {
    try {
        await PageLayout.deleteMany({ pageSlug: 'books' });

        const initialSections: IPageSection[] = [
            {
                id: 'book_hero_1',
                type: 'fashion_banners',
                adminLabel: 'Book Hero Banners',
                priority: 10,
                content: {
                    banners: [
                        { imageUrl: 'https://images.unsplash.com/photo-1507842217121-6d7c493c52a9?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/books-sale' },
                        { imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/bestsellers' }
                    ]
                }
            },
            {
                id: 'book_subcats_1',
                type: 'book_subcategories',
                adminLabel: 'Book Subcategories',
                priority: 20,
                content: {
                    dataSource: { endpoint: '/api/categories/books/subcategories' },
                    items: []
                }
            },
            {
                id: 'book_music_1',
                type: 'book_music_genres',
                title: 'Music genres',
                adminLabel: 'Music Genres',
                priority: 30,
                content: {
                    headerActionUrl: '/books/collection/music-genres',
                    items: [
                        { name: 'Pop', subtitle: 'Keyboards', gradientColors: ['#FF6BB5', '#FF8FC7'], accentColor: '#FFC266', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/music-pop' },
                        { name: 'Jazz', subtitle: 'Violins', gradientColors: ['#6BA3FF', '#8BBAFF'], accentColor: '#A8CFFF', image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/music-jazz' },
                        { name: 'Classical', subtitle: 'Tabla', gradientColors: ['#FFA940', '#FFBD66'], accentColor: '#FFD699', image: 'https://images.unsplash.com/photo-1460036521480-ff49c08c2781?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/music-classical' }
                    ]
                }
            },
            {
                id: 'book_genres_1',
                type: 'book_genres',
                title: 'Books genres',
                adminLabel: 'Book Genres',
                priority: 40,
                content: {
                    headerActionUrl: '/books/collection/books-genres',
                    items: [
                        { name: 'Fiction', subtitle: 'From ₹99', gradientColors: ['#FF6BB5', '#FF8FC7'], accentColor: '#FFCCE0', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/book-fiction' },
                        { name: 'Mystery &\nthriller', subtitle: 'Up to 50% Off', gradientColors: ['#FF9940', '#FFB366'], accentColor: '#FFC266', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/book-mystery' },
                        { name: 'Fantasy', subtitle: 'Min 40% Off', gradientColors: ['#6BA3FF', '#8BBAFF'], accentColor: '#B3D4FF', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/book-fantasy' }
                    ]
                }
            },
            {
                id: 'book_brands_1',
                type: 'book_superstar_brands',
                title: 'Superstar brands',
                adminLabel: 'Superstar Brands',
                priority: 50,
                content: {
                    headerActionUrl: '/books/collection/superstar-brands',
                    items: [
                        { name: 'DigiMore', logo: 'https://ui-avatars.com/api/?name=DigiMore&background=000&color=fff&size=200', actionUrl: '/category/brand-digimore' },
                        { name: 'CASIO', logo: 'https://ui-avatars.com/api/?name=CASIO&background=0066CC&color=fff&size=200&bold=true', actionUrl: '/category/brand-casio' },
                        { name: 'YAMAHA', logo: 'https://ui-avatars.com/api/?name=YAMAHA&background=000&color=fff&size=200&bold=true', actionUrl: '/category/brand-yamaha' },
                        { name: 'Audio-Technica', logo: 'https://ui-avatars.com/api/?name=AT&background=000&color=fff&size=200', actionUrl: '/category/brand-audio-technica' },
                        { name: 'CLAPBOX', logo: 'https://ui-avatars.com/api/?name=CLAPBOX&background=666&color=fff&size=200', actionUrl: '/category/brand-clapbox' },
                        { name: 'AHUJA', logo: 'https://ui-avatars.com/api/?name=AHUJA&background=003366&color=fff&size=200&bold=true', actionUrl: '/category/brand-ahuja' }
                    ]
                }
            },
            {
                id: 'book_authors_1',
                type: 'book_authors_best',
                title: 'Authors best work',
                adminLabel: 'Authors Best',
                priority: 60,
                content: {
                    headerActionUrl: '/books/collection/authors-best-work',
                    items: [
                        { name: 'Sudha Murthy', bgColor: '#6B7FFF', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/author-sudha-murthy' },
                        { name: 'Ruskin Bond', bgColor: '#808080', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/author-ruskin-bond' },
                        { name: 'Dharamvir Bharati', bgColor: '#FF9933', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/author-dharamvir-bharati' }
                    ]
                }
            },
            {
                id: 'book_budget_1',
                type: 'book_budget_carnival',
                title: 'Budget carnival',
                adminLabel: 'Budget Carnival',
                priority: 70,
                content: {
                    headerActionUrl: '/books/collection/budget-carnival',
                    items: [
                        { name: 'Harmonicas', priceTag: 'Under ₹999', tagColor: '#0052FF', tagPosition: 'top-left', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/budget-harmonicas' },
                        { name: 'NCERT books', priceTag: 'Up to 30% Off', tagColor: '#FF3366', tagPosition: 'top-right', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/budget-ncert' },
                        { name: 'Guitars', priceTag: 'From ₹1,699', tagColor: '#0052FF', tagPosition: 'top-right', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/budget-guitars' },
                        { name: 'Microphones', priceTag: 'Min. 45% Off', tagColor: '#FF3366', tagPosition: 'top-left', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/budget-mics' },
                        { name: 'Popular books', priceTag: 'Under ₹299', tagColor: '#0052FF', tagPosition: 'top-right', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/budget-popular-books' },
                        { name: 'Indian instruments', priceTag: 'Up to 40% Off', tagColor: '#FF3366', tagPosition: 'top-right', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/budget-indian-instruments' }
                    ]
                }
            },
            {
                id: 'book_product_grid_1',
                type: 'book_product_grid',
                title: 'Latest Books',
                adminLabel: 'Latest Products',
                priority: 80,
                content: {
                    dataSource: { endpoint: '/api/products', params: { category: 'Books', limit: 10 } }
                }
            }
        ];

        const layout = await PageLayout.create({
            pageSlug: 'books',
            name: 'Books Page',
            description: 'Main books category page',
            isActive: true,
            sections: initialSections
        });

        res.json({ message: "Seeded books", layout });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to seed books", message: error.message });
    }
});

// Helper: Seed Furniture Page
router.post("/seed-layout/furniture", async (req: Request, res: Response) => {
    try {
        await PageLayout.deleteMany({ pageSlug: 'furniture' });

        const initialSections: IPageSection[] = [
            {
                id: 'furn_hero_1',
                type: 'fashion_banners',
                adminLabel: 'Furniture Hero Banners',
                priority: 10,
                content: {
                    banners: [
                        { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/furniture-sale' },
                        { imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/sofas' }
                    ]
                }
            },
            {
                id: 'furn_subcats_1',
                type: 'furniture_subcategories',
                adminLabel: 'Furniture Subcategories',
                priority: 20,
                content: {
                    dataSource: { endpoint: '/api/categories/furniture/subcategories' },
                    items: []
                }
            },
            {
                id: 'furn_deal_1',
                type: 'furniture_deal_of_day',
                title: 'Deal of the day',
                adminLabel: 'Deal of the Day',
                priority: 30,
                content: {
                    headerActionUrl: '/furniture/collection/deal-of-the-day',
                    items: [
                        { title: 'Mattresses', price: 'From ₹2,990', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d7030e?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/mattresses' },
                        { title: 'Office chairs', price: 'From ₹2,490', image: 'https://media.istockphoto.com/id/1297688846/photo/computer-chair-for-gamers.jpg?s=1024x1024&w=is&k=20&c=z6K9kSEecaJb_-Jn7uFeObKmmICGNhisUtb8H6cNlyA=', actionUrl: '/category/office-chairs' },
                        { title: 'Recliners', price: 'From ₹5,999', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d7030e?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/recliners' }
                    ]
                }
            },
            {
                id: 'furn_top_brands_1',
                type: 'furniture_top_brands',
                title: 'Top brands, top offers',
                adminLabel: 'Top Brands Banner',
                priority: 40,
                content: {
                    headerActionUrl: '/furniture/collection/top-brands',
                    items: [
                        { brandName: 'GREEN SOUL', price: 'From ₹16,990', image: 'https://images.unsplash.com/photo-1598300042247-d088f11a3b18?auto=format&fit=crop&w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Verdes.svg/2560px-Flag_of_Verdes.svg.png', actionUrl: '/category/green-soul' },
                        { brandName: 'Kurl-on', price: 'From ₹10,235', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Kurlon_Logo.jpg', actionUrl: '/category/kurl-on' },
                        { brandName: 'Sleepwell', price: 'From ₹10,690', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Sleepwell_logo.png/220px-Sleepwell_logo.png', actionUrl: '/category/sleepwell' }
                    ]
                }
            },
            {
                id: 'furn_sponsor_1',
                type: 'furniture_sponsorship_banner',
                adminLabel: 'Sponsorship Banner',
                priority: 50,
                content: {
                    items: [
                        { image: 'https://loremflickr.com/800/200/furniture,sale?lock=1', actionUrl: '/category/furniture-sale-special' }
                    ]
                }
            },
            {
                id: 'furn_grab_1',
                type: 'furniture_grab_or_gone',
                title: 'Grab or gone',
                adminLabel: 'Grab or Gone',
                priority: 60,
                content: {
                    items: [
                        { title: 'Best Deal Ever', price: 'From ₹10,999', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/deal-dining-set' },
                        { title: 'Best Deal Ever', price: 'From ₹8,999', image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/deal-dining-table' },
                        { title: 'Best deal ever', price: 'From ₹3,899', image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae4?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/deal-chairs' },
                        { title: 'Best deal ever', price: 'From ₹6,999', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/deal-bed' }
                    ]
                }
            },
            {
                id: 'furn_room_1',
                type: 'furniture_shop_by_room',
                title: 'Shop by room',
                adminLabel: 'Shop by Room',
                priority: 70,
                content: {
                    headerActionUrl: '/furniture/collection/shop-by-room',
                    items: [
                        { title: 'Living room', color: '#FFD54F', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/living-room' },
                        { title: 'Bedroom', color: '#C5E1A5', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/bedroom' },
                        { title: 'Outdoor furniture', color: '#AED581', image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/outdoor' },
                        { title: 'Study & office', color: '#FFD54F', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/office' }
                    ]
                }
            },
            {
                id: 'furn_samarth_1',
                type: 'furniture_samarth_store',
                title: 'Samarth store',
                adminLabel: 'Samarth Store',
                priority: 80,
                content: {
                    headerActionUrl: '/furniture/collection/samarth',
                    items: [
                        { image: 'https://rukminim1.flixcart.com/fk-p-flap/850/200/image/8b996652390757d5.jpg?q=90', actionUrl: '/category/samarth' }
                    ]
                }
            },
            {
                id: 'furn_emi_1',
                type: 'furniture_emi_offers',
                title: 'Special offers on no cost EMI',
                adminLabel: 'EMI Offers',
                priority: 90,
                content: {
                    headerActionUrl: '/furniture/collection/emi-offers',
                    items: [
                        { title: 'Beds', price: 'From ₹1,099/mo', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/emi-beds' },
                        { title: 'Mattresses', price: 'From ₹799/mo', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d7030e?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/emi-mattresses' },
                        { title: 'Wardrobes', price: 'From ₹1,499/mo', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/emi-wardrobes' }
                    ]
                }
            },
            {
                id: 'furn_top_brands_grid_1',
                type: 'furniture_top_furniture_brands',
                title: 'Top furniture brands',
                adminLabel: 'Top Brands Grid',
                priority: 100,
                content: {
                    items: [
                        { name: 'Nilkamal', logo: 'https://companieslogo.com/img/orig/NILKAMAL.NS-026c457f.png?t=1612566675', actionUrl: '/category/nilkamal' },
                        { name: 'Wakefit', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Wakefit_Logo.jpg', actionUrl: '/category/wakefit' },
                        { name: 'Perfect Homes', logo: 'https://seeklogo.com/images/F/flipkart-logo-C9E637A758-seeklogo.com.png', actionUrl: '/category/perfect-homes' },
                        { name: 'Wooden Street', logo: 'https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1485862226/u9082260195665_f7d45.png', actionUrl: '/category/wooden-street' },
                        { name: 'Green Soul', logo: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/c325785f-8705-4081-9b16-5275e0dc42aa.__CR0,0,600,180_PT0_SX600_V1___.jpg', actionUrl: '/category/green-soul' },
                        { name: 'View all', isViewAll: true, actionUrl: '/furniture/brands' }
                    ]
                }
            },
            {
                id: 'furn_material_1',
                type: 'furniture_shop_by_material',
                title: 'Shop by material',
                adminLabel: 'Shop by Material',
                priority: 110,
                content: {
                    headerActionUrl: '/furniture/collection/shop-by-material',
                    items: [
                        { name: 'Plastic', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/plastic-furniture' },
                        { name: 'Metal', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/metal-furniture' },
                        { name: 'Engineered wood', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/wood-furniture' },
                        { name: 'Bamboo/ Rattan/ Cane', image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/bamboo-furniture' }
                    ]
                }
            },
            {
                id: 'furn_trending_1',
                type: 'furniture_trending_now',
                title: 'Trending now',
                adminLabel: 'Trending Now',
                priority: 120,
                content: {
                    headerActionUrl: '/furniture/collection/trending-now',
                    // Note: Inner items are currently static in the component strictly per design, but could be passed here if refactored.
                    // Keeping minimal here as component has hardcoded visual cards.
                }
            },
            {
                id: 'furn_wishlist_1',
                type: 'furniture_wishlist',
                title: 'Add to your wishlist',
                adminLabel: 'Wishlist',
                priority: 130,
                content: {
                    items: [
                        { title: 'Best deal ever', price: 'From ₹11,299', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/best-deal-beds' },
                        { title: 'Best deal ever', price: 'From ₹11,299', image: 'https://images.unsplash.com/photo-1616594039964-b0804955c66b?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/best-deal-beds-2' },
                        { title: 'Best deal ever', price: 'From ₹11,299', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/best-deal-bedroom' },
                        { title: 'Best Deal Ever', price: 'From ₹10,999', image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/best-deal-dining' }
                    ]
                }
            },
            {
                id: 'furn_reviews_1',
                type: 'furniture_customer_reviews',
                title: 'Reviews by customers',
                adminLabel: 'Customer Reviews',
                priority: 140,
                content: {
                    headerActionUrl: '/furniture/reviews',
                    items: [
                        { product: 'FK Perfect Homes Sofas', rating: 5, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', review: 'Beauty MARVELLOUS SUPER quality', user: 'Preet Agrawal' },
                        { product: 'Wakefit Bookshelf', rating: 4, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80', review: 'Packing was good & were provided with Sleep...', user: 'Rizwan Mansuri' }
                    ]
                }
            },
            {
                id: 'furn_everybody_1',
                type: 'furniture_everybody_list',
                title: "On everybody's list",
                adminLabel: 'Everybody List',
                priority: 150,
                content: {
                    items: [
                        { title: 'Best Deal Ever', subtitle: 'Upto 40% Off', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/bean-bags' },
                        { title: 'Best deal ever', subtitle: 'From ₹2,499', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/bed-offers' },
                        { title: 'Best deal ever', subtitle: 'From ₹2,499', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/bed-offers-2' },
                        { title: 'Best deal ever', subtitle: 'From ₹2,999', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d7030e?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/mattress-offers' }
                    ]
                }
            },
            {
                id: 'furn_rare_1',
                type: 'furniture_rare_finds',
                title: "Betul's rare finds",
                adminLabel: 'Rare Finds',
                priority: 160,
                content: {
                    headerActionUrl: '/furniture/rare-finds',
                    items: [
                        { title: 'Pet beds', image: 'https://images.unsplash.com/photo-1541781777-c18bd3a3d919?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/pet-beds' },
                        { title: 'Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/decor' },
                        { title: 'Lighting', image: 'https://images.unsplash.com/photo-1513506003011-3b03c80165bd?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/lighting' }
                    ]
                }
            },
            {
                id: 'furn_statement_1',
                type: 'furniture_statement_pieces',
                title: 'Shop statement pieces',
                adminLabel: 'Statement Pieces',
                priority: 170,
                content: {
                    headerActionUrl: '/furniture/statement-pieces',
                    items: [
                        { title: 'Sofa sets', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/sofa-sets' },
                        { title: 'Recliners', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/recliners' },
                        { title: 'Accent Chairs', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=400&q=80', actionUrl: '/category/accent-chairs' }
                    ]
                }
            },
            {
                id: 'furn_product_grid_1',
                type: 'furniture_product_grid',
                title: 'Latest Furniture',
                adminLabel: 'Latest Products',
                priority: 180,
                content: {
                    dataSource: { endpoint: '/api/products', params: { category: 'Furniture', limit: 10 } }
                }
            }
        ];

        const layout = await PageLayout.create({
            pageSlug: 'furniture',
            name: 'Furniture Page',
            description: 'Main furniture category page',
            isActive: true,
            sections: initialSections
        });

        res.json({ message: "Seeded furniture", layout });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to seed furniture", message: error.message });
    }
});

// Protect all following routes
router.use('/admin/layout', requireAdmin);

// GET /api/admin/layout/list - List all pages
router.get("/admin/layout/list", async (req: Request, res: Response) => {
    try {
        const layouts = await PageLayout.find({}, 'pageSlug name description isActive updatedAt');
        res.json(layouts);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch layouts", message: error.message });
    }
});

// GET /api/admin/layout/:slug - Fetch specific layout (full)
router.get("/admin/layout/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const layout = await PageLayout.findOne({ pageSlug: slug });
        if (!layout) return res.status(404).json({ error: "Layout not found" });
        res.json(layout);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch layout", message: error.message });
    }
});

// POST /api/admin/layout - Create new page layout
router.post("/admin/layout", async (req: Request, res: Response) => {
    try {
        const { pageSlug, name, description } = req.body;

        // Basic sections template
        const sections: IPageSection[] = [];

        const layout = await PageLayout.create({
            pageSlug,
            name,
            description,
            sections
        });

        res.json(layout);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to create layout", message: error.message });
    }
});

// PUT /api/admin/layout/:slug - Update layout sections
router.put("/admin/layout/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { sections, name, description } = req.body;

        const layout = await PageLayout.findOne({ pageSlug: slug });
        if (!layout) return res.status(404).json({ error: "Layout not found" });

        if (sections) {
            // Validation could go here
            layout.sections = sections;
        }
        if (name) layout.name = name;
        if (description) layout.description = description;

        await layout.save();
        res.json({ message: "Layout updated successfully", layout });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to update layout", message: error.message });
    }
});

export default router;
