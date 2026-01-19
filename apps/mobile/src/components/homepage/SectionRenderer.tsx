import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Section } from '../../hooks/usePageLayout';

// Components
import HeroBanner from './HeroBanner';
import RecentHistorySection from './RecentHistorySection';
import GrocerySection from './GrocerySection';
import TrendingNearYou from './foryou/TrendingNearYou';
import CuratedCollections from './foryou/CuratedCollections';
import LightningDeals from './foryou/LightningDeals';
import GrandKitchenSale from './foryou/GrandKitchenSale';
import FiftyPercentOffZone from './foryou/FiftyPercentOffZone';
import ProductCard from './ProductCard';
// We need a reusable grid wrapper essentially
import CategoryPulseLoader from '../shared/CategoryPulseLoader';
import api from '../../lib/api';
import { useRouter } from 'expo-router';

// Fashion Components
import CategoryBannerSlider from './CategoryBannerSlider';
import {
    FashionSubcategories,
    FashionShoppingForOthers,
    FashionEarlyBirdDeals,
    FashionFestiveSection,
    FashionShoeFest,
    FashionWinterClearance,
    FashionBudgetBuys,
    FashionForecast,
    FashionWinterCollection,
    FashionDealsOfTheDay,
    FashionProductGrid
} from './categories/fashion/FashionSections';

// Beauty Components
import {
    BeautySubcategories,
    BeautyPromoPoster,
    BeautyGlowHarvest,
    BeautyConsultationBanner,
    BeautyTrendingBrands,
    BeautyAlisters,
    BeautyLaunchParty,
    BeautyTrendMore,
    BeautyInternetFamed,
    BeautyKBeauty,
    BeautyGlamBudget,
    BeautyProductGrid
} from './categories/beauty/BeautySections';

// Home & Kitchen Components
import {
    HomeSubcategories,
    HomeKitchenBestsellers,
    HomeDecorTrends,
    HomeFurnishingDeals,
    HomeProductGrid
} from './categories/home/HomeSections';

// Electronics Components
import {
    ElectronicsSubcategories
} from './categories/electronics/ElectronicsSections';

// Sport Components
import {
    SportSubcategories,
    SportCricketSeason,
    SportWinnerBrands,
    SportSupportGoals,
    SportGymAccessories,
    SportCombos,
    SportSavings,
    SportProductGrid
} from './categories/sports/SportSections';

// Book Components
import {
    BookSubcategories,
    BookMusicGenres,
    BookGenres,
    BookSuperstarBrands,
    BookAuthorsBest,
    BookBudgetCarnival,
    BookProductGrid
} from './categories/books/BookSections';

// Furniture Components
import {
    FurnitureSubcategories,
    FurnitureDealOfDay,
    FurnitureTopBrands,
    FurnitureSponsorshipBanner,
    FurnitureGrabOrGone,
    FurnitureShopByRoom,
    FurnitureSamarthStore,
    FurnitureEmiOffers,
    FurnitureTopFurnitureBrands,
    FurnitureShopByMaterial,
    FurnitureTrendingNow,
    FurnitureWishlist,
    FurnitureCustomerReviews,
    FurnitureEverybodyList,
    FurnitureRareFinds,
    FurnitureStatementPieces,
    FurnitureProductGrid
} from './categories/furniture/FurnitureSections';

// A simple generic Product Grid component to replace the hardcoded "Featured Products"
const DynamicProductGrid = ({ title, dataSource }: { title?: string, dataSource?: any }) => {
    const router = useRouter();
    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const endpoint = dataSource?.endpoint || '/api/products';
                const params = dataSource?.params || { limit: 6 };
                const res = await api.get(endpoint, { params });
                const list = Array.isArray(res.data) ? res.data : (res.data.products || []);
                setProducts(list);
            } catch (e) {
                console.error("Grid fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [dataSource]);

    if (loading) return <CategoryPulseLoader />;
    if (products.length === 0) return null;

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title || "Products"}</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
                {products.map((p) => (
                    <ProductCard
                        key={p._id}
                        product={p}
                        onPress={() => router.push(`/product/${p._id}`)}
                    />
                ))}
            </View>
        </View>
    );
};

export interface SectionProps {
    data: any;
}

interface SectionRendererProps {
    section: Section;
    user?: any; // Pass user context if needed
}

export default function SectionRenderer({ section, user }: SectionRendererProps) {
    const { type, content, title } = section;

    switch (type) {
        case 'hero_carousel':
            // TODO: Update HeroBanner to accept content.banners props
            return <HeroBanner />;

        case 'recent_history':
            return <RecentHistorySection userName={user?.name ? user.name.split(' ')[0] : 'User'} />;

        case 'grocery_row':
            return <GrocerySection categoryId={content?.categoryId} />;

        case 'product_list_horizontal':
            // Specifically handling "Trending near you" logic
            // Ideally TrendingNearYou should accept dataSource/title
            // For now, if title matches "Trending", use specific component
            if (title?.includes('Trending')) {
                // Pass params if we refactor TrendingNearYou, else it uses its own defaults
                return <TrendingNearYou />;
            }
            // Fallback for generic lists (not implemented yet)
            return null;

        case 'curated_collections':
            return <CuratedCollections data={content} />;

        case 'lightning_deals':
            return <LightningDeals />;

        case 'grand_kitchen':
        case 'banner_single': // Mapping kitchen to single banner or generic
            if (type === 'grand_kitchen') return <GrandKitchenSale />;
            // If strictly banner_single logic implemented later:
            return <GrandKitchenSale />; // Fallback 

        case 'fifty_percent_off':
            return <FiftyPercentOffZone />;

        case 'product_grid':
            return <DynamicProductGrid title={title} dataSource={content?.dataSource} />;

        // --- Fashion Sections ---
        case 'fashion_banners':
            // Adapter: seed data has { banners: [{ imageUrl, actionUrl }] }, component expects strings
            // If component expects objects later, we update it. For now, map to strings.
            const bannerImages = content?.banners?.map((b: any) => b.imageUrl) || [];
            return <CategoryBannerSlider banners={bannerImages} />;

        case 'fashion_subcategories':
            return <FashionSubcategories data={content} />;
        case 'fashion_shopping_others':
            return <FashionShoppingForOthers data={content} />;
        case 'fashion_early_bird':
            return <FashionEarlyBirdDeals data={content} />;
        case 'fashion_festive':
            return <FashionFestiveSection data={content} />;
        case 'fashion_shoe_fest':
            return <FashionShoeFest data={content} />;
        case 'fashion_winter_clearance':
            return <FashionWinterClearance data={content} />;
        case 'fashion_budget_buys':
            return <FashionBudgetBuys data={content} />;
        case 'fashion_forecast':
            return <FashionForecast data={content} />;
        case 'fashion_winter_collection':
            return <FashionWinterCollection data={content} />;
        case 'fashion_deals_of_day':
            return <FashionDealsOfTheDay data={content} />;
        case 'fashion_product_grid':
            return <FashionProductGrid data={content} />;

        // --- Beauty Sections ---
        case 'beauty_subcategories':
            return <BeautySubcategories data={content} />;
        case 'beauty_promo_poster':
            return <BeautyPromoPoster data={content} />;
        case 'beauty_glow_harvest':
            return <BeautyGlowHarvest data={content} />;
        case 'beauty_consultation':
            return <BeautyConsultationBanner data={content} />;
        case 'beauty_trending_brands':
            return <BeautyTrendingBrands data={content} />;
        case 'beauty_alisters':
            return <BeautyAlisters data={content} />;
        case 'beauty_launch_party':
            return <BeautyLaunchParty data={content} />;
        case 'beauty_trend_more':
            return <BeautyTrendMore data={content} />;
        case 'beauty_internet_famed':
            return <BeautyInternetFamed data={content} />;
        case 'beauty_k_beauty':
            return <BeautyKBeauty data={content} />;
        case 'beauty_glam_budget':
            return <BeautyGlamBudget data={content} />;
        case 'beauty_product_grid':
            return <BeautyProductGrid data={content} />;

        // --- Home & Kitchen Sections ---
        case 'home_subcategories':
            return <HomeSubcategories data={content} />;
        case 'home_kitchen_bestsellers':
            return <HomeKitchenBestsellers data={content} />;
        case 'home_decor_trends':
            return <HomeDecorTrends data={content} />;
        case 'home_furnishing_deals':
            return <HomeFurnishingDeals data={content} />;
        case 'home_product_grid':
        case 'home_product_grid':
            return <HomeProductGrid data={content} />;

        // --- Electronics Sections ---
        case 'electronics_banners':
            // Pass full objects so CategoryBannerSlider can handle clicks
            const elecBanners = content?.banners || [];
            return <CategoryBannerSlider banners={elecBanners} />;

        case 'electronics_subcategories':
            return <ElectronicsSubcategories data={content} />;

        case 'electronics_product_grid':
            return <DynamicProductGrid title={title} dataSource={content?.dataSource} />;

        // --- Sport Sections ---
        case 'sport_subcategories': // Note: Intentionally singular 'sport' prefix for consistency
            return <SportSubcategories data={content} />;
        case 'sport_cricket_season':
            return <SportCricketSeason data={content} />;
        case 'sport_winner_brands':
            return <SportWinnerBrands data={content} />;
        case 'sport_support_goals':
            return <SportSupportGoals data={content} />;
        case 'sport_gym_accessories':
            return <SportGymAccessories data={content} />;
        case 'sport_combos':
            return <SportCombos data={content} />;
        case 'sport_savings':
            return <SportSavings data={content} />;
        case 'sport_product_grid':
            return <SportProductGrid data={content} />;

        // --- Book Sections ---
        case 'book_subcategories':
            return <BookSubcategories data={content} />;
        case 'book_music_genres':
            return <BookMusicGenres data={content} />;
        case 'book_genres':
            return <BookGenres data={content} />;
        case 'book_superstar_brands':
            return <BookSuperstarBrands data={content} />;
        case 'book_authors_best':
            return <BookAuthorsBest data={content} />;
        case 'book_budget_carnival':
            return <BookBudgetCarnival data={content} />;
        case 'book_product_grid':
            return <BookProductGrid data={content} />;

        // --- Furniture Sections ---
        case 'furniture_subcategories':
            return <FurnitureSubcategories data={content} />;
        case 'furniture_deal_of_day':
            return <FurnitureDealOfDay data={content} />;
        case 'furniture_top_brands':
            return <FurnitureTopBrands data={content} />;
        case 'furniture_sponsorship_banner':
            return <FurnitureSponsorshipBanner data={content} />;
        case 'furniture_grab_or_gone':
            return <FurnitureGrabOrGone data={content} />;
        case 'furniture_shop_by_room':
            return <FurnitureShopByRoom data={content} />;
        case 'furniture_samarth_store':
            return <FurnitureSamarthStore data={content} />;
        case 'furniture_emi_offers':
            return <FurnitureEmiOffers data={content} />;
        case 'furniture_top_furniture_brands':
            return <FurnitureTopFurnitureBrands data={content} />;
        case 'furniture_shop_by_material':
            return <FurnitureShopByMaterial data={content} />;
        case 'furniture_trending_now':
            return <FurnitureTrendingNow data={content} />;
        case 'furniture_wishlist':
            return <FurnitureWishlist data={content} />;
        case 'furniture_customer_reviews':
            return <FurnitureCustomerReviews data={content} />;
        case 'furniture_everybody_list':
            return <FurnitureEverybodyList data={content} />;
        case 'furniture_rare_finds':
            return <FurnitureRareFinds data={content} />;
        case 'furniture_statement_pieces':
            return <FurnitureStatementPieces data={content} />;
        case 'furniture_product_grid':
            return <FurnitureProductGrid data={content} />;

        default:
            console.warn(`Unknown section type: ${type}`);
            return null;
    }
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },
    seeAll: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
});
