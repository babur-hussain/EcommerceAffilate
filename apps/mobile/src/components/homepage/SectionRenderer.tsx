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

// T-Shirt Components
import TShirtHeader from '../../../app/bannerPages/components/tshirt/TShirtHeader';
import TShirtHorizontalList from '../../../app/bannerPages/components/tshirt/TShirtHorizontalList';
import TShirtGrid from '../../../app/bannerPages/components/tshirt/TShirtGrid';

// Men Fashion Components (New)
import MenFashionHeader from '../../../app/bannerPages/components/men_fashion/MenFashionHeader';
import MenFashionTabs from '../../../app/bannerPages/components/men_fashion/MenFashionTabs';
import MenFashionGrid from '../../../app/bannerPages/components/men_fashion/MenFashionGrid';
import MenFashionFooterCTA from '../../../app/bannerPages/components/men_fashion/MenFashionFooterCTA';

// Girls Fashion Components (New)
import GirlsFashionHeader from '../../../app/bannerPages/components/girls_fashion/GirlsFashionHeader';
import GirlsFashionHero from '../../../app/bannerPages/components/girls_fashion/GirlsFashionHero';
import GirlsFashionTabs from '../../../app/bannerPages/components/girls_fashion/GirlsFashionTabs';
import GirlsFashionGrid from '../../../app/bannerPages/components/girls_fashion/GirlsFashionGrid';
import GirlsFashionNewsletter from '../../../app/bannerPages/components/girls_fashion/GirlsFashionNewsletter';

// Luxury Fashion Components (New)
import LuxeHeader from '../../../app/bannerPages/components/luxury_fashion/LuxeHeader';
import LuxeHero from '../../../app/bannerPages/components/luxury_fashion/LuxeHero';
import LuxeTabs from '../../../app/bannerPages/components/luxury_fashion/LuxeTabs';
import LuxeGrid from '../../../app/bannerPages/components/luxury_fashion/LuxeGrid';

// Aesthete Collection Components (New)
import AestheteHeader from '../../../app/bannerPages/components/new_collection/AestheteHeader';
import AestheteTabs from '../../../app/bannerPages/components/new_collection/AestheteTabs';
import AestheteGrid from '../../../app/bannerPages/components/new_collection/AestheteGrid';
import AestheteFooter from '../../../app/bannerPages/components/new_collection/AestheteFooter';

// Big Beauty Sale Components (New)
import BeautyHeader from '../../../app/bannerPages/components/big_beauty/BeautyHeader';
import BeautyCategories from '../../../app/bannerPages/components/big_beauty/BeautyCategories';
import BeautyGrid from '../../../app/bannerPages/components/big_beauty/BeautyGrid';
import BeautyBottomNav from '../../../app/bannerPages/components/big_beauty/BeautyBottomNav';

// Look Beautiful / Elegant Components (New)
import ElegantHeader from '../../../app/bannerPages/components/look_beautiful/ElegantHeader';
import ElegantCategories from '../../../app/bannerPages/components/look_beautiful/ElegantCategories';
import ElegantGrid from '../../../app/bannerPages/components/look_beautiful/ElegantGrid';
import ElegantTrending from '../../../app/bannerPages/components/look_beautiful/ElegantTrending';
import ElegantBottomNav from '../../../app/bannerPages/components/look_beautiful/ElegantBottomNav';

// Luxurious New Collection Components (New)
import LuxHeader from '../../../app/bannerPages/components/luxurious_new/LuxHeader';
import LuxTabs from '../../../app/bannerPages/components/luxurious_new/LuxTabs';
import LuxGrid from '../../../app/bannerPages/components/luxurious_new/LuxGrid';
import LuxBottomNav from '../../../app/bannerPages/components/luxurious_new/LuxBottomNav';

// 50 Percent Off Components (New)
import LumiereHeader from '../../../app/bannerPages/components/percent_off/LumiereHeader';
import LumiereSection from '../../../app/bannerPages/components/percent_off/LumiereSection';
import LumiereNewsletter from '../../../app/bannerPages/components/percent_off/LumiereNewsletter';
import LumiereBottomNav from '../../../app/bannerPages/components/percent_off/LumiereBottomNav';

// Cosmetic Sale Components (New)
import CosmeticHeader from '../../../app/bannerPages/components/cosmetic_sale/CosmeticHeader';
import CosmeticCategories from '../../../app/bannerPages/components/cosmetic_sale/CosmeticCategories';
import CosmeticGrid from '../../../app/bannerPages/components/cosmetic_sale/CosmeticGrid';
import CosmeticJoinClub from '../../../app/bannerPages/components/cosmetic_sale/CosmeticJoinClub';
import CosmeticBottomNav from '../../../app/bannerPages/components/cosmetic_sale/CosmeticBottomNav';

// Beauty Product / Luminous Components (New)
import LuminousHeader from '../../../app/bannerPages/components/beauty_product/LuminousHeader';
import LuminousCategories from '../../../app/bannerPages/components/beauty_product/LuminousCategories';
import LuminousGrid from '../../../app/bannerPages/components/beauty_product/LuminousGrid';
import LuminousSale from '../../../app/bannerPages/components/beauty_product/LuminousSale';
import LuminousBottomNav from '../../../app/bannerPages/components/beauty_product/LuminousBottomNav';

// Big Promo Electronics Components (New)
import PromoHeader from '../../../app/bannerPages/components/big_promo/PromoHeader';
import PromoCategories from '../../../app/bannerPages/components/big_promo/PromoCategories';
import PromoGrid from '../../../app/bannerPages/components/big_promo/PromoGrid';
import PromoBottomNav from '../../../app/bannerPages/components/big_promo/PromoBottomNav';

// Mega Deal Electronics Components (New)
import MegaHeader from '../../../app/bannerPages/components/mega_deal/MegaHeader';
import MegaFlashSale from '../../../app/bannerPages/components/mega_deal/MegaFlashSale';
import MegaGrid from '../../../app/bannerPages/components/mega_deal/MegaGrid';
import MegaBottomNav from '../../../app/bannerPages/components/mega_deal/MegaBottomNav';

// Special Sale Electronics Components (New)
import SpecialHeader from '../../../app/bannerPages/components/special_sale/SpecialHeader';
import SpecialFlashSale from '../../../app/bannerPages/components/special_sale/SpecialFlashSale';
import SpecialCategories from '../../../app/bannerPages/components/special_sale/SpecialCategories';
import SpecialGrid from '../../../app/bannerPages/components/special_sale/SpecialGrid';
import SpecialBottomNav from '../../../app/bannerPages/components/special_sale/SpecialBottomNav';

// Cyber Sale Fashion Components (New)
import CyberHeader from '../../../app/bannerPages/components/cyber_sale/CyberHeader';
import CyberCategories from '../../../app/bannerPages/components/cyber_sale/CyberCategories';
import CyberGrid from '../../../app/bannerPages/components/cyber_sale/CyberGrid';
import CyberFlashDeal from '../../../app/bannerPages/components/cyber_sale/CyberFlashDeal';
import CyberBottomNav from '../../../app/bannerPages/components/cyber_sale/CyberBottomNav';

// Flash Sale Luxury Components (New)
import FlashHeader from '../../../app/bannerPages/components/flash_sale/FlashHeader';
import FlashCategories from '../../../app/bannerPages/components/flash_sale/FlashCategories';
import FlashCountdown from '../../../app/bannerPages/components/flash_sale/FlashCountdown';
import FlashGrid from '../../../app/bannerPages/components/flash_sale/FlashGrid';
import FlashBottomNav from '../../../app/bannerPages/components/flash_sale/FlashBottomNav';

// Furniture Big Sale Components (New)
import FurnitureHeader from '../../../app/bannerPages/components/furniture_sale/FurnitureHeader';
import FurnitureCategories from '../../../app/bannerPages/components/furniture_sale/FurnitureCategories';
import FurnitureGrid from '../../../app/bannerPages/components/furniture_sale/FurnitureGrid';
import FurnitureBottomNav from '../../../app/bannerPages/components/furniture_sale/FurnitureBottomNav';

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
                return <TrendingNearYou limit={content?.limit} productIds={content?.productIds} />;
            }
            // Fallback for generic lists (not implemented yet)
            return null;

        case 'curated_collections':
            return <CuratedCollections data={content} />;

        case 'lightning_deals':
            return <LightningDeals limit={content?.limit} productIds={content?.productIds} />;

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
            // Pass full objects so clicks work, same as electronics
            const fashionBanners = content?.banners || [];
            return <CategoryBannerSlider banners={fashionBanners} />;

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

        // --- T-Shirt Sections ---
        case 'tshirt_header':
            return <TShirtHeader data={content} />;
        case 'tshirt_horizontal_list':
            return <TShirtHorizontalList data={content} />;
        case 'tshirt_grid':
            return <TShirtGrid data={content} />;

        // --- Men Fashion Sections ---
        case 'men_fashion_header':
            return <MenFashionHeader data={content} />;
        case 'men_fashion_tabs':
            return <MenFashionTabs data={content} />;
        case 'men_fashion_grid':
            return <MenFashionGrid data={content} />;
        case 'men_fashion_footer_cta':
            return <MenFashionFooterCTA data={content} />;

        // --- Girls Fashion Sections ---
        case 'girls_fashion_header':
            return <GirlsFashionHeader data={content} />;
        case 'girls_fashion_hero':
            return <GirlsFashionHero data={content} />;
        case 'girls_fashion_tabs':
            return <GirlsFashionTabs data={content} />;
        case 'girls_fashion_grid':
            return <GirlsFashionGrid data={content} />;
        case 'girls_fashion_newsletter':
            return <GirlsFashionNewsletter data={content} />;

        // --- Luxury Fashion Sections ---
        case 'luxe_header':
            return <LuxeHeader data={content} />;
        case 'luxe_hero':
            return <LuxeHero data={content} />;
        case 'luxe_tabs':
            return <LuxeTabs data={content} />;
        case 'luxe_grid':
            return <LuxeGrid data={content} />;

        // --- Aesthete Collection Sections ---
        case 'aesthete_header':
            return <AestheteHeader data={content} />;
        case 'aesthete_tabs':
            return <AestheteTabs data={content} />;
        case 'aesthete_grid':
            return <AestheteGrid data={content} />;
        case 'aesthete_footer':
            return <AestheteFooter data={content} />;

        // --- Big Beauty Sale Sections ---
        case 'beauty_header':
            return <BeautyHeader data={content} />;
        case 'beauty_categories':
            return <BeautyCategories data={content} />;
        case 'beauty_grid':
            return <BeautyGrid data={content} />;
        case 'beauty_bottom_nav':
            return <BeautyBottomNav />;

        // --- Look Beautiful (Elegant) Sections ---
        case 'elegant_header':
            return <ElegantHeader data={content} />;
        case 'elegant_categories':
            return <ElegantCategories data={content} />;
        case 'elegant_grid':
            return <ElegantGrid data={content} />;
        case 'elegant_trending':
            return <ElegantTrending data={content} />;
        case 'elegant_bottom_nav':
            return <ElegantBottomNav />;

        // --- Luxurious New Collection Sections ---
        case 'lux_header':
            return <LuxHeader data={content} />;
        case 'lux_tabs':
            return <LuxTabs data={content} />;
        case 'lux_grid':
            return <LuxGrid data={content} />;
        case 'lux_bottom_nav':
            return <LuxBottomNav />;

        // --- 50 Percent Off Sections ---
        case 'lumiere_header':
            return <LumiereHeader data={content} />;
        case 'lumiere_section':
            return <LumiereSection data={content} />;
        case 'lumiere_newsletter':
            return <LumiereNewsletter />;
        case 'lumiere_bottom_nav':
            return <LumiereBottomNav />;

        // --- Cosmetic Sale Sections ---
        case 'cosmetic_header':
            return <CosmeticHeader data={content} />;
        case 'cosmetic_categories':
            return <CosmeticCategories data={content} />;
        case 'cosmetic_grid':
            return <CosmeticGrid data={content} />;
        case 'cosmetic_join_club':
            return <CosmeticJoinClub />;
        case 'cosmetic_bottom_nav':
            return <CosmeticBottomNav />;

        // --- Beauty Product / Luminous Sections ---
        case 'luminous_header':
            return <LuminousHeader data={content} />;
        case 'luminous_categories':
            return <LuminousCategories data={content} />;
        case 'luminous_grid':
            return <LuminousGrid data={content} />;
        case 'luminous_sale':
            return <LuminousSale data={content} />;
        case 'luminous_bottom_nav':
            return <LuminousBottomNav />;

        // --- Big Promo Electronics Sections ---
        case 'promo_header':
            return <PromoHeader data={content} />;
        case 'promo_categories':
            return <PromoCategories data={content} />;
        case 'promo_grid':
            return <PromoGrid data={content} />;
        case 'promo_bottom_nav':
            return <PromoBottomNav />;

        // --- Mega Deal Electronics Sections ---
        case 'mega_header':
            return <MegaHeader data={content} />;
        case 'mega_flash_sale':
            return <MegaFlashSale data={content} />;
        case 'mega_grid':
            return <MegaGrid data={content} />;
        case 'mega_bottom_nav':
            return <MegaBottomNav />;

        // --- Special Sale Electronics Sections ---
        case 'special_header':
            return <SpecialHeader data={content} />;
        case 'special_flash_sale':
            return <SpecialFlashSale data={content} />;
        case 'special_categories':
            return <SpecialCategories data={content} />;
        case 'special_grid':
            return <SpecialGrid data={content} />;
        case 'special_bottom_nav':
            return <SpecialBottomNav />;

        // --- Cyber Sale Fashion Sections ---
        case 'cyber_header':
            return <CyberHeader data={content} />;
        case 'cyber_categories':
            return <CyberCategories data={content} />;
        case 'cyber_grid':
            return <CyberGrid data={content} />;
        case 'cyber_flash_deal':
            return <CyberFlashDeal data={content} />;
        case 'cyber_bottom_nav':
            return <CyberBottomNav />;

        // --- Flash Sale Luxury Sections ---
        case 'flash_header':
            return <FlashHeader data={content} />;
        case 'flash_categories':
            return <FlashCategories data={content} />;
        case 'flash_countdown':
            return <FlashCountdown data={content} />;
        case 'flash_grid':
            return <FlashGrid data={content} />;
        case 'flash_bottom_nav':
            return <FlashBottomNav />;

        // --- Furniture Big Sale Sections ---
        case 'furniture_header':
            return <FurnitureHeader data={content} />;
        case 'furniture_categories':
            return <FurnitureCategories data={content} />;
        case 'furniture_grid':
            return <FurnitureGrid data={content} />;
        case 'furniture_bottom_nav':
            return <FurnitureBottomNav />;

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
