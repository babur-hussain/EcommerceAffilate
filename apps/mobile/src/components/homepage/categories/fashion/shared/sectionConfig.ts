// Central configuration for all fashion section pages
import { SectionConfig } from '../../shared/types';

export const SECTIONS: Record<string, SectionConfig> = {
    // ============================================================
    // PAGE: SHOPPING FOR OTHERS - WOMEN
    // Layout: Grid with Banner
    // ============================================================
    WOMEN: {
        id: 'women',
        title: "Women's Fashion",
        subtitle: 'Explore the latest trends for women',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://loremflickr.com/1000/400/woman,fashion,banner?lock=1',
        theme: {
            backgroundColor: '#fff',
            headerTextColor: '#111827',
            subtitleColor: '#6B7280',
        },
        filters: { gender: 'women' },
    },
    // ============================================================
    // PAGE: SHOPPING FOR OTHERS - MEN
    // Layout: Grid with Banner
    // ============================================================
    MEN: {
        id: 'men',
        title: "Men's Fashion",
        subtitle: 'Discover stylish picks for men',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://loremflickr.com/1000/400/man,fashion,banner?lock=2',
        theme: {
            backgroundColor: '#fff',
            headerTextColor: '#111827',
            subtitleColor: '#6B7280',
        },
        filters: { gender: 'men' },
    },
    // ============================================================
    // PAGE: SHOPPING FOR OTHERS - KIDS
    // Layout: Grid with Banner
    // ============================================================
    KIDS: {
        id: 'kids',
        title: 'Kids Fashion',
        subtitle: 'Cute styles for little ones',
        variant: 'standard',
        layout: 'kids-hub',
        theme: {
            backgroundColor: '#FFFFFF',
            headerTextColor: '#000000',
            subtitleColor: '#6B7280',
        },
        filters: { gender: 'kids' },
        hubData: [
            {
                type: 'circle-nav',
                items: [] // Will be populated dynamically by ID 6968f0e29424899fc3d9cc54
            },
            {
                type: 'banner',
                bannerData: {
                    title: 'Best sellers in footwear!',
                    subtitle: 'Kids Footwear',
                    priceTag: 'From ₹129',
                    image: 'https://loremflickr.com/800/600/kids,shoes,running?lock=6',
                }
            },
            {
                type: 'scroll-row',
                title: 'Shop by age',
                items: [
                    { id: 'age-group:0-2-years', label: '0-2 years', price: 'From ₹99', image: 'https://loremflickr.com/300/300/baby,toddler?lock=7' },
                    { id: 'age-group:2-6-years', label: '2-6 years', price: 'From ₹99', image: 'https://loremflickr.com/300/300/child,play?lock=8' },
                    { id: 'age-group:6-10-years', label: '6-10 years', price: 'From ₹99', image: 'https://loremflickr.com/300/300/kid,school?lock=9' },
                    { id: 'age-group:11-16-years', label: '11-16 years', price: 'From ₹99', image: 'https://loremflickr.com/300/300/teenager,cool?lock=10' },
                ]
            },
            {
                type: 'scroll-row',
                title: 'Shop by type',
                items: [
                    { id: '6968fa04014bf5328126a1e5', label: 'Combo sets', price: 'From ₹179', image: 'https://loremflickr.com/300/300/kids,clothing?lock=11' },
                    { id: '6968fb7d46e0970fd74aaa71', label: 'Dresses', price: 'From ₹179', image: 'https://loremflickr.com/300/300/girl,dress?lock=12' },
                    { id: '6968fab4014bf5328126a204', label: 'Tees & shirts', price: 'From ₹179', image: 'https://loremflickr.com/300/300/shirt,kid?lock=13' },
                    { id: '6968facd4e7bb5b784b04175', label: 'Jeans, Tracks & Pants', price: 'From ₹149', image: 'https://loremflickr.com/300/300/jeans,kid?lock=14' },
                ]
            },
            {
                type: 'scroll-row',
                title: "Kids' footwear & accessories",
                items: [
                    { id: '6968fa04014bf5328126a1e6', label: 'Boys footwear', price: 'From ₹199', image: 'https://loremflickr.com/300/300/boy,shoes?lock=15' },
                    { id: '6968fa04014bf5328126a1e7', label: 'Girls footwear', price: 'From ₹149', image: 'https://loremflickr.com/300/300/girl,shoes?lock=16' },
                    { id: '6968fa04014bf5328126a1e8', label: 'Hair Accessories', price: 'From ₹49', image: 'https://loremflickr.com/300/300/hair,accessory?lock=17' },
                    { id: '6968fa04014bf5328126a1e9', label: 'School Bags', price: 'From ₹149', image: 'https://loremflickr.com/300/300/schoolbag?lock=18' },
                ]
            },
            {
                type: 'brand-scroll',
                title: 'Featured Brands',
                items: [
                    { id: 'brand1', label: 'Max', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Max_Fashion_Logo.png/800px-Max_Fashion_Logo.png', image: 'https://loremflickr.com/300/400/kid,fashion,smile?lock=20', offer: 'Under ₹199' },
                    { id: 'brand2', label: 'Pantaloons', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Pantaloons_Logo.png', image: 'https://loremflickr.com/300/400/kid,summer,fun?lock=21', offer: 'Under ₹199' },
                    { id: 'brand3', label: 'Allen Solly', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Allen_Solly_Logo.svg/1200px-Allen_Solly_Logo.svg.png', image: 'https://loremflickr.com/300/400/kid,cool?lock=22', offer: 'Min. 60% Off' },
                ]
            },
            {
                type: 'winter-scroll',
                title: 'Winter is coming',
                items: [
                    { id: '6968fa04014bf5328126a1ea', label: 'Jackets', image: 'https://loremflickr.com/300/400/kid,jacket,winter?lock=25', offer: 'Min. 65% Off', color: '#B57EDC' },
                    { id: '6968fa04014bf5328126a1eb', label: 'Sweaters', image: 'https://loremflickr.com/300/400/kid,sweater?lock=26', offer: 'Under ₹399', color: '#D8BFD8' },
                    { id: '6968fa04014bf5328126a1ec', label: 'Sweatshirts', image: 'https://loremflickr.com/300/400/kid,hoodie?lock=27', offer: 'Under ₹499', color: '#DDA0DD' },
                ]
            },
            {
                type: 'curated-scroll',
                title: 'Curated collection for you',
                items: [
                    { id: 'curated1', label: 'Tiranga collection', image: 'https://loremflickr.com/300/400/indian,boy,flag?lock=30', price: 'From ₹199' },
                    { id: 'curated2', label: 'Police & soldier...', image: 'https://loremflickr.com/300/400/kid,soldier,costume?lock=31', price: 'From ₹299' },
                    { id: 'curated3', label: 'Wedding Collection', image: 'https://loremflickr.com/300/400/kid,wedding,dress?lock=32', price: 'From ₹499' },
                ]
            },
            {
                type: 'bestseller-grid',
                title: 'Bestsellers',
                items: [
                    { id: 'best1', label: 'Fasla', image: 'https://loremflickr.com/300/300/kid,fashion?lock=40', offer: 'Under ₹399' },
                    { id: 'best2', label: 'Kuchipoo', image: 'https://loremflickr.com/300/300/girl,cute?lock=41', offer: 'Min. 60% Off' },
                    { id: 'best3', label: 'Mars Infiniti', image: 'https://loremflickr.com/300/300/boy,cool?lock=42', offer: 'From ₹179' },
                    { id: 'best4', label: 'BabyGo', image: 'https://loremflickr.com/300/300/baby,fashion?lock=43', offer: 'Under ₹399' },
                    { id: 'best5', label: 'Cute n Tight', image: 'https://loremflickr.com/300/300/kid,smile?lock=44', offer: 'From ₹199' },
                    { id: 'best6', label: 'Trampoline', image: 'https://loremflickr.com/300/300/boy,shirt?lock=45', offer: 'Min. 60% Off' },
                    { id: 'best7', label: 'Kookie Kids', image: 'https://loremflickr.com/300/300/girl,dress?lock=46', offer: 'Under ₹299' },
                    { id: 'best8', label: 'Hellcat', image: 'https://loremflickr.com/300/300/boy,tshirt?lock=47', offer: 'From ₹149' },
                    { id: 'best9', label: 'Miss & Chief', image: 'https://loremflickr.com/300/300/kid,play?lock=48', offer: 'Min. 50% Off' },
                    { id: 'best10', label: 'Gini & Jony', image: 'https://loremflickr.com/300/300/fashion,kid?lock=49', offer: 'Under ₹499' },
                    { id: 'best11', label: 'US Polo Assn', image: 'https://loremflickr.com/300/300/polo,kid?lock=50', offer: 'Min. 40% Off' },
                    { id: 'best12', label: 'Allen Solly', image: 'https://loremflickr.com/300/300/smart,kid?lock=51', offer: 'From ₹399' },
                    { id: 'best12', label: 'Allen Solly', image: 'https://loremflickr.com/300/300/smart,kid?lock=51', offer: 'From ₹399' },
                ]
            },
            {
                type: 'winter-scroll',
                title: 'Festive collection',
                items: [
                    { id: 'festive1', label: 'Ethnic sets', image: 'https://loremflickr.com/300/400/kid,ethnic,india?lock=60', offer: 'Under ₹299', color: '#B048B5' },
                    { id: 'festive2', label: 'Party wear', image: 'https://loremflickr.com/300/400/boy,suit,party?lock=61', offer: 'Min. 70% Off', color: '#B048B5' },
                    { id: 'festive3', label: 'Lehengas', image: 'https://loremflickr.com/300/400/girl,lehenga?lock=62', offer: 'Under ₹499', color: '#B048B5' },
                ]
            },
            {
                type: 'winter-scroll',
                title: 'Value packs',
                items: [
                    { id: 'value1', label: 'Winter accessories', image: 'https://loremflickr.com/300/400/kid,hat,winter?lock=65', offer: 'Under ₹299', color: '#B048B5' },
                    { id: 'value2', label: 'Dress combos', image: 'https://loremflickr.com/300/400/girl,dress,combo?lock=66', offer: 'Under ₹399', color: '#B048B5' },
                    { id: 'value3', label: 'Trousers', image: 'https://loremflickr.com/300/400/boy,trousers?lock=67', offer: 'Under ₹299', color: '#B048B5' },
                ]
            },
            {
                type: 'winter-scroll',
                title: 'Viral on insta',
                items: [
                    { id: 'viral1', label: 'Trending', image: 'https://loremflickr.com/300/400/kid,fashion,trend?lock=70', offer: 'Min. 50% Off', color: '#B048B5' },
                    { id: 'viral2', label: 'New Arrivals', image: 'https://loremflickr.com/300/400/kid,cool,shades?lock=71', offer: 'Under ₹499', color: '#B048B5' },
                    { id: 'viral3', label: 'Must Haves', image: 'https://loremflickr.com/300/400/kid,style,pose?lock=72', offer: 'From ₹399', color: '#B048B5' },
                ]
            },
            {
                type: 'trend-list',
                title: 'Trends section',
                items: [
                    { id: 'trend1', label: 'Led shoes', image: 'https://loremflickr.com/300/400/shoes,led,light?lock=80', offer: 'Up to 80% Off' },
                    { id: 'trend2', label: 'impluse', image: 'https://loremflickr.com/300/400/backpack,school,space?lock=81', offer: 'Min. 50% Off' },
                    { id: 'trend3', label: 'Oversized tees', image: 'https://loremflickr.com/300/400/tshirt,oversized,kid?lock=82', offer: 'Under ₹299' },
                ]
            }
        ]
    },
    // ============================================================
    // PAGE: GEN Z DRIPS
    // Layout: Masonry (Staggered Grid)
    // Theme: Dark Mode
    // ============================================================
    GEN_Z_DRIPS: {
        id: 'gen-z-drips',
        title: 'Gen Z Drips',
        subtitle: 'Trendy picks for the new generation',
        variant: 'standard',
        layout: 'masonry',
        bannerImage: 'https://loremflickr.com/1000/400/party,fashion?lock=99', // Added banner
        theme: {
            backgroundColor: '#000',
            headerTextColor: '#FFF',
            subtitleColor: '#9CA3AF',
            cardBackground: '#1F2937',
            backgroundImage: 'https://loremflickr.com/1000/1000/neon,dark?lock=98', // Background texture
        },
    },
    // ============================================================
    // PAGE: LUXE COLLECTION
    // Layout: Showcase (Full Width Cards)
    // Theme: Premium Dark
    // ============================================================
    LUXE: {
        id: 'luxe',
        title: 'Luxe Collection',
        subtitle: 'Premium luxury fashion',
        variant: 'standard',
        layout: 'showcase',
        bannerImage: 'https://loremflickr.com/1000/400/luxury,jewelry?lock=4', // Added banner
        theme: {
            backgroundColor: '#1C1917',
            headerTextColor: '#E7E5E4',
            subtitleColor: '#A8A29E',
            accentColor: '#D4AF37',
        },
    },

    // ============================================================
    // PAGE: EARLY BIRD DEALS
    // Layout: List View
    // Theme: Blue / Sale
    // ============================================================
    EARLY_BIRD_DEALS: {
        id: 'early-bird-deals',
        title: 'Early Bird Deals!',
        subtitle: 'Grab the best deals before they fly away',
        variant: 'deal-badge',
        layout: 'list',
        bannerImage: 'https://loremflickr.com/1000/400/sale,shopping?lock=5', // Added banner
        theme: {
            backgroundColor: '#EFF6FF', // Lighter blue
            headerTextColor: '#1E3A8A',
            subtitleColor: '#3B82F6',
            badgeColor: '#0056D2',
            badgeTextColor: '#FFFFFF',
        },
        filters: { minDiscount: 60 },
    },
    // ============================================================
    // PAGE: SANKRANTI FESTIVAL
    // Layout: Grid with Festive Banner
    // Theme: Purple / Festive
    // ============================================================
    SANKRANTI: {
        id: 'sankranti',
        title: 'Shine bright this Sankranti',
        subtitle: 'Celebrate in style with our festive collection',
        variant: 'festive',
        layout: 'grid',
        bannerImage: 'https://loremflickr.com/1000/400/festival,india?lock=10',
        theme: {
            backgroundColor: '#FAF5FF', // Very light purple
            headerTextColor: '#581C87',
            subtitleColor: '#7E22CE',
            accentColor: '#D8B4FE',
        },
    },
    // ============================================================
    // PAGE: SHOE STEAL FEST
    // Layout: Grid
    // ============================================================
    SHOE_STEAL_FEST: {
        id: 'shoe-steal-fest',
        title: "Shoe's Steal Fest",
        subtitle: 'Step into savings with amazing footwear deals',
        variant: 'shoe-fest',
        layout: 'grid',
        bannerImage: 'https://loremflickr.com/1000/400/shoes,sneakers?lock=6', // Added banner
        theme: {
            backgroundColor: '#F3F4F6',
            headerTextColor: '#111827',
            subtitleColor: '#4B5563',
        },
        filters: { category: 'footwear' },
    },
    // ============================================================
    // PAGE: WINTER CLEARANCE
    // Layout: Grid with Winter Banner
    // Theme: Icy Blue
    // ============================================================
    WINTER_CLEARANCE: {
        id: 'winter-clearance',
        title: 'Winter Clearance Sale',
        subtitle: 'Warm up with hot deals on winter wear',
        variant: 'winter-clearance',
        layout: 'grid',
        bannerImage: 'https://loremflickr.com/1000/400/snow,winter?lock=11',
        theme: {
            backgroundColor: '#F0F9FF',
            headerTextColor: '#0C4A6E',
            subtitleColor: '#0EA5E9',
            accentColor: '#38BDF8',
        },
    },
    // ============================================================
    // PAGE: DEALS OF THE DAY
    // Layout: List View
    // Theme: Red / Urgent
    // ============================================================
    DEALS_OF_THE_DAY: {
        id: 'deals-of-the-day',
        title: 'Deals of the Day',
        subtitle: "Today's hottest deals - Limited time only!",
        variant: 'standard',
        layout: 'list',
        bannerImage: 'https://loremflickr.com/1000/400/clock,time?lock=7', // Added banner
        theme: {
            backgroundColor: '#FEF2F2',
            headerTextColor: '#991B1B',
            subtitleColor: '#EF4444',
        },
    },
    // ============================================================
    // PAGE: BUDGET BUYS
    // Layout: Grid with Overlays
    // Theme: Green / Budget
    // ============================================================
    BUDGET_BUYS: {
        id: 'budget-buys',
        title: 'Budget Buys',
        subtitle: "Style doesn't have to be expensive",
        variant: 'budget-overlay',
        layout: 'grid',
        bannerImage: 'https://loremflickr.com/1000/400/money,wallet?lock=8', // Added banner
        theme: {
            backgroundColor: '#F0FDF4',
            headerTextColor: '#064E3B',
            subtitleColor: '#10B981',
        },
    },
    // ============================================================
    // PAGE: FASHION FORECAST
    // Layout: Showcase
    // Theme: Dark / Editorial
    // ============================================================
    FASHION_FORECAST: {
        id: 'fashion-forecast',
        title: 'FASHION FORECAST',
        subtitle: "What's trending this season",
        variant: 'forecast',
        layout: 'showcase',
        bannerImage: 'https://loremflickr.com/1000/400/runway,model?lock=9', // Added banner
        theme: {
            backgroundColor: '#18181B',
            headerTextColor: '#F4F4F5',
            subtitleColor: '#71717A',
        },
    },
    // ============================================================
    // PAGE: WINTER COLLECTION
    // Layout: Grid
    // ============================================================
    WINTER_COLLECTION: {
        id: 'winter-collection',
        title: 'Winter Collection ❄️',
        subtitle: 'Stay warm and stylish this winter',
        variant: 'winter',
        layout: 'grid',
        bannerImage: 'https://loremflickr.com/1000/400/winter,fashion?lock=12',
        theme: {
            backgroundColor: '#E3F2FD',
            headerTextColor: '#111827',
            subtitleColor: '#546E7A',
            accentColor: '#B3E5FC',
        },
    },
};

// ============================================================
// PAGE: KIDS CLOTHING (Generic Landing for Kids Sub-sections)
// Layout: Grid
// ============================================================
SECTIONS.KIDS_CLOTHING = {
    id: 'kids-clothing',
    title: 'Kids Clothing',
    subtitle: 'Latest styles for your little ones',
    variant: 'standard',
    layout: 'grid',
    theme: {
        backgroundColor: '#FFFFFF',
        headerTextColor: '#000000',
        subtitleColor: '#6B7280',
    },
    filters: { gender: 'kids' },
};

// Helper to get section by ID
export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
