import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Helper to normalize URLs (Legacy /category/ -> /common-category/)
const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/category/')) {
        return url.replace('/category/', '/common-category/');
    }
    return url;
};

// --- Types ---
interface SectionProps {
    data: any; // The 'content' from page layout
}

// 1. Subcategories Grid

export const FashionSubcategories = ({ data }: SectionProps) => {
    const router = useRouter();
    const [subcategories, setSubcategories] = React.useState<any[]>(data?.items || []);

    React.useEffect(() => {
        if (data?.dataSource) {
            const fetchSubcats = async () => {
                try {
                    const res = await api.get(data.dataSource.endpoint, { params: data.dataSource.params });
                    if (Array.isArray(res.data)) {
                        setSubcategories(res.data);
                    }
                } catch (e) {
                    console.error("Failed to fetch fashion subcats", e);
                }
            };
            fetchSubcats();
        }
    }, [data]);

    if (!subcategories.length) return null;

    return (
        <View style={styles.subcategoriesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {Array.from({ length: Math.ceil(subcategories.length / 2) }).map((_, colIndex) => {
                    const pair = subcategories.slice(colIndex * 2, colIndex * 2 + 2);
                    return (
                        <View key={colIndex} style={styles.columnWrapper}>
                            {pair.map((sub: any) => (
                                <TouchableOpacity
                                    key={sub._id || sub.id}
                                    style={styles.subcategoryItem}
                                    onPress={() => router.push((sub.actionUrl ? normalizeUrl(sub.actionUrl) : `/common-category/${sub.slug}`) as any)}
                                >
                                    <View style={styles.subcategoryIconContainer}>
                                        <Image source={{ uri: sub.image || sub.icon }} style={styles.subcategoryImage} />
                                    </View>
                                    <Text style={styles.subcategoryName} numberOfLines={2}>{sub.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

// Helper for clickable headers
const SectionHeader = ({ title, actionUrl, router, style }: { title: string, actionUrl?: string, router: any, style?: any }) => {
    if (actionUrl) {
        return (
            <TouchableOpacity onPress={() => router.push(normalizeUrl(actionUrl) as any)}>
                <Text style={[styles.sectionTitleBlack, style]}>{title} ›</Text>
            </TouchableOpacity>
        );
    }
    return <Text style={[styles.sectionTitleBlack, style]}>{title}</Text>;
};

// 2. Shopping For Others
export const FashionShoppingForOthers = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.shoppingForOthersSection}>
            <SectionHeader title={data.title || 'Shopping for others?'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shoppingOthersScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.shoppingOthersItem} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <View style={styles.shoppingOthersImageContainer}>
                            <Image source={{ uri: item.image }} style={styles.shoppingOthersImage} />
                        </View>
                        <Text style={styles.shoppingOthersName}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 3. Early Bird Deals
export const FashionEarlyBirdDeals = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.earlyBirdSection}>
            <TouchableOpacity style={styles.earlyBirdHeader} onPress={() => data.headerActionUrl && router.push(normalizeUrl(data.headerActionUrl) as any)}>
                <Text style={styles.earlyBirdTitle}>{data.title || 'Early Bird Deals!'} ›</Text>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.earlyBirdScrollContent}>
                {items.map((deal: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.earlyBirdCard} onPress={() => router.push(normalizeUrl(deal.actionUrl) as any)}>
                        <View style={styles.earlyBirdImageContainer}>
                            <Image source={{ uri: deal.image }} style={styles.earlyBirdImage} />
                        </View>
                        <View style={styles.earlyBirdOfferBadge}>
                            <Text style={styles.earlyBirdOfferText}>{deal.offer}</Text>
                        </View>
                        <Text style={styles.earlyBirdBrand}>{deal.brand}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 4. Festive / Shine Bright
export const FashionFestiveSection = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.festiveSection}>
            <SectionHeader title={data.title || 'Shine bright'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.festiveCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <View style={styles.festiveImageContainer}>
                            <Image source={{ uri: item.image }} style={styles.festiveImage} />
                        </View>
                        <View style={styles.festiveBanner}>
                            <View style={styles.festiveIconLeft} />
                            <View>
                                <Text style={styles.festiveTitle}>{item.title}</Text>
                                <Text style={styles.festivePrice}>{item.price}</Text>
                            </View>
                            <View style={styles.festiveIconRight} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 5. Shoe's Steal Fest
export const FashionShoeFest = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.shoeFestSection}>
            <SectionHeader title={data.title || "Shoe's steal Fest"} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.shoeFestCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <View style={styles.shoeFestImageContainer}>
                            <Image source={{ uri: item.image }} style={styles.shoeFestImage} />
                        </View>
                        <View style={styles.shoeFestInfo}>
                            <Text style={styles.shoeFestTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.shoeFestOffer}>{item.offer}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 6. Winter Clearance
export const FashionWinterClearance = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.winterClearanceSection}>
            <SectionHeader title={data.title || 'Winter Clearance Sale'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.winterClearanceCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <View style={styles.winterClearanceImageContainer}>
                            <Image source={{ uri: item.image }} style={styles.winterClearanceImage} />
                        </View>
                        <View style={styles.winterClearanceOverlay}>
                            <View style={styles.winterInfo}>
                                <Text style={styles.winterOffer}>{item.offer}</Text>
                                <View style={styles.winterBrandContainer}>
                                    <Text style={styles.winterBrand}>{item.brand}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 6.5. Deals of the Day
export const FashionDealsOfTheDay = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.dealsOfTheDaySection}>
            <View style={styles.dealsHeaderContainer}>
                <View style={styles.dealsHeaderLeft}>
                    <FontAwesome5 name="clock" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.dealsHeaderTitle}>{data.title || 'Deals of the Day'}</Text>
                </View>
                {data.headerActionUrl && (
                    <TouchableOpacity onPress={() => router.push(normalizeUrl(data.headerActionUrl) as any)}>
                        <Text style={styles.dealsViewAll}>View All ›</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.dealsSubHeader}>
                <Text style={styles.dealsSubtitle}>{data.subtitle || "Clock is ticking!"}</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.dealsCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <View style={styles.dealsImageContainer}>
                            <Image source={{ uri: item.image }} style={styles.dealsImage} />
                            <View style={styles.dealsBadge}>
                                <Text style={styles.dealsBadgeText}>{item.offer}</Text>
                            </View>
                        </View>
                        <Text style={styles.dealsBrand} numberOfLines={1}>{item.brand}</Text>
                        <Text style={styles.dealsPrice}>{item.price}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 7. Budget Buys
export const FashionBudgetBuys = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.budgetBuysSection}>
            <SectionHeader title={data.title || 'Budget Buys'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.budgetBuysGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.budgetBuysCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <Image source={{ uri: item.image }} style={styles.budgetBuysImage} />
                        <View style={styles.budgetBuysOverlay}>
                            <Text style={styles.budgetBuysUnder}>UNDER</Text>
                            <Text style={styles.budgetBuysPrice}>₹{item.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 8. Fashion Forecast
export const FashionForecast = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.forecastSection}>
            <TouchableOpacity onPress={() => data.headerActionUrl && router.push(normalizeUrl(data.headerActionUrl) as any)}>
                <Text style={styles.forecastHeader}>{data.title || 'FASHION FORECAST'} ›</Text>
            </TouchableOpacity>
            {items.map((item: any, index: number) => (
                <TouchableOpacity key={index} style={styles.forecastCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                    <Image source={{ uri: item.image }} style={styles.forecastImage} />
                    <View style={[
                        styles.forecastOverlay,
                        item.align === 'left' ? styles.alignLeft :
                            item.align === 'right' ? styles.alignRight :
                                styles.alignBottomLeft
                    ]}>
                        <Text style={styles.forecastTitle}>{item.title}</Text>
                        {item.sub ? <Text style={styles.forecastSub}>{item.sub}</Text> : null}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// 9. Winter Collection
export const FashionWinterCollection = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.winterCollectionSection}>
            <SectionHeader title={data.title || 'Winter collection'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.winterScroll}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.winterCollectionCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <Image source={{ uri: item.image }} style={styles.winterCollectionImage} />
                        <View style={styles.winterCollectionFooter}>
                            <View style={styles.snowflakeLeft}>
                                <FontAwesome5 name="snowflake" size={16} color="#B3E5FC" />
                            </View>
                            <View style={styles.snowflakeRight}>
                                <FontAwesome5 name="snowflake" size={16} color="#B3E5FC" />
                            </View>
                            <Text style={styles.winterCollectionName}>{item.name}</Text>
                            <Text style={styles.winterCollectionOffer}>{item.offer}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 10. Fashion Product Grid (Exact Match)
import ProductCard from '../../ProductCard';
import api from '../../../../lib/api';
import CategoryPulseLoader from '../../../shared/CategoryPulseLoader';

export const FashionProductGrid = ({ data }: SectionProps) => {
    const router = useRouter();
    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const endpoint = data?.dataSource?.endpoint || '/api/products';
                const params = data?.dataSource?.params || { category: 'Fashion', limit: 10 };
                const res = await api.get(endpoint, { params });
                const list = Array.isArray(res.data) ? res.data : (res.data.products || []);
                setProducts(list);
            } catch (e) {
                console.error("Fashion grid fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [data]);

    if (loading) return <View style={styles.productsSection}><CategoryPulseLoader /></View>;
    if (products.length === 0) {
        return (
            <View style={styles.productsSection}>
                <View style={[styles.sectionHeader, { marginBottom: 16, paddingHorizontal: 16 }]}>
                    <Text style={styles.sectionTitle}>{data.title || 'Latest in Fashion'}</Text>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No fashion products found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.productsSection}>
            <View style={[styles.sectionHeader, { marginBottom: 16, paddingHorizontal: 16 }]}>
                <Text style={styles.sectionTitle}>{data.title || 'Latest in Fashion'}</Text>
            </View>

            <View style={styles.productsGrid}>
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onPress={() => router.push(`/product/${product._id}`)}
                    />
                ))}
            </View>
        </View>
    );
};


// --- Styles (Copied from FashionPage.tsx) ---
const styles = StyleSheet.create({
    horizontalScrollContent: { paddingHorizontal: 16 },
    sectionTitleBlack: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12, marginLeft: 16 },

    // Products Styles (Exact match)
    productsSection: { marginTop: 8 },
    sectionHeader: { paddingHorizontal: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 20 },
    emptyState: { width: '100%', padding: 40, alignItems: 'center' },
    emptyText: { color: '#666', fontSize: 16 },

    // Subcategories
    subcategoriesSection: { paddingVertical: 12 },
    columnWrapper: { marginRight: 12, justifyContent: 'flex-start' },
    subcategoryItem: { width: (width - 60) / 4, maxWidth: 85, alignItems: 'center', marginBottom: 16 },
    subcategoryIconContainer: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 6, borderWidth: 1, borderColor: '#F3F4F6' },
    subcategoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    subcategoryName: { fontSize: 12, lineHeight: 16, height: 32, color: '#374151', textAlign: 'center', fontWeight: '500' },

    // Shopping For Others
    shoppingForOthersSection: { marginTop: 8, marginBottom: 20 },
    shoppingOthersScrollContent: { paddingHorizontal: 16 },
    shoppingOthersItem: { width: 110, marginRight: 12, alignItems: 'center' },
    shoppingOthersImageContainer: { width: '100%', aspectRatio: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 8, backgroundColor: '#f0f0f0' },
    shoppingOthersImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    shoppingOthersName: { fontSize: 13, fontWeight: '600', color: '#111', textAlign: 'center' },

    // Early Bird
    earlyBirdSection: { marginHorizontal: 12, marginBottom: 24, backgroundColor: '#A2D2FF', borderRadius: 16, paddingVertical: 16, paddingLeft: 16, overflow: 'hidden' },
    earlyBirdHeader: { marginBottom: 12 },
    earlyBirdTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    earlyBirdScrollContent: { paddingRight: 16 },
    earlyBirdCard: { width: 140, marginRight: 12, alignItems: 'center' },
    earlyBirdImageContainer: { width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 0 },
    earlyBirdImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    earlyBirdOfferBadge: { backgroundColor: '#0056D2', width: '100%', paddingVertical: 6, alignItems: 'center', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginTop: -10, zIndex: 1 },
    earlyBirdOfferText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    earlyBirdBrand: { marginTop: 6, fontSize: 14, color: '#334155', fontWeight: '500' },

    // Festive
    festiveSection: { marginBottom: 24 },
    festiveCard: { width: 130, marginRight: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
    festiveImageContainer: { width: '100%', height: 160, backgroundColor: '#eee' },
    festiveImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    festiveBanner: { backgroundColor: '#BA68C8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 8 },
    festiveIconLeft: { width: 14, height: 14, backgroundColor: '#FFEB3B', transform: [{ rotate: '-45deg' }], borderRadius: 2 },
    festiveIconRight: { width: 14, height: 14, backgroundColor: '#FFEB3B', transform: [{ rotate: '45deg' }], borderRadius: 2 },
    festiveTitle: { color: 'rgba(255,255,255,0.95)', fontSize: 10, textAlign: 'center', marginBottom: 2, fontWeight: '500' },
    festivePrice: { color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },

    // Shoe Fest
    shoeFestSection: { marginBottom: 24 },
    shoeFestCard: { width: 160, marginRight: 12, marginBottom: 4 },
    shoeFestImageContainer: { width: '100%', height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 8, backgroundColor: '#eee' },
    shoeFestImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    shoeFestInfo: { paddingHorizontal: 4, alignItems: 'center' },
    shoeFestTitle: { fontSize: 12, color: '#4B5563', marginBottom: 2, textAlign: 'center' },
    shoeFestOffer: { fontSize: 14, fontWeight: 'bold', color: '#111', textAlign: 'center' },

    // Winter Clearance
    winterClearanceSection: { marginBottom: 24 },
    winterClearanceCard: { width: 150, marginRight: 12, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1E88E5', height: 240 },
    winterClearanceImageContainer: { width: '100%', height: 180, backgroundColor: '#fff', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
    winterClearanceImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    winterClearanceOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, justifyContent: 'center', alignItems: 'center', paddingBottom: 4 },
    winterInfo: { width: '100%', alignItems: 'center', justifyContent: 'center' },
    winterOffer: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
    winterBrandContainer: { backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, minWidth: 80, alignItems: 'center' },
    winterBrand: { color: '#111', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },

    // Deals of the Day
    dealsOfTheDaySection: { marginBottom: 24, backgroundColor: '#EF5350', paddingVertical: 16 }, // Red theme
    dealsHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 4 },
    dealsHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
    dealsHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 },
    dealsViewAll: { color: '#fff', fontWeight: '600', fontSize: 13 },
    dealsSubHeader: { paddingHorizontal: 16, marginBottom: 16 },
    dealsSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
    dealsCard: { width: 150, marginRight: 12, backgroundColor: '#fff', borderRadius: 12, padding: 8, paddingBottom: 12 },
    dealsImageContainer: { width: '100%', height: 150, borderRadius: 8, overflow: 'hidden', marginBottom: 8, position: 'relative', backgroundColor: '#f0f0f0' },
    dealsImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    dealsBadge: { position: 'absolute', top: 0, left: 0, backgroundColor: '#D32F2F', paddingHorizontal: 6, paddingVertical: 3, borderBottomRightRadius: 8 },
    dealsBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    dealsBrand: { fontSize: 12, color: '#666', marginBottom: 2 },
    dealsPrice: { fontSize: 15, fontWeight: 'bold', color: '#B71C1C' },

    // Budget Buys
    budgetBuysSection: { marginBottom: 24, paddingHorizontal: 16 },
    budgetBuysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    budgetBuysCard: { width: '48%', aspectRatio: 1, borderRadius: 12, marginBottom: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#f0f0f0' },
    budgetBuysImage: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.9 },
    budgetBuysOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    budgetBuysUnder: {
        color: '#111',
        fontSize: 18,
        letterSpacing: 2,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
        marginBottom: -4
    },
    budgetBuysPrice: {
        color: '#111',
        fontSize: 42,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
        marginTop: 0
    },

    // Forecast
    forecastSection: { marginBottom: 32, paddingHorizontal: 16 },
    forecastHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif'
    },
    forecastCard: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 16, backgroundColor: '#f0f0f0', position: 'relative' },
    forecastImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    forecastOverlay: { position: 'absolute', padding: 20, justifyContent: 'center' },
    alignLeft: { top: 0, bottom: 0, left: 0, alignItems: 'flex-start' },
    alignRight: { top: 0, bottom: 0, right: 0, alignItems: 'flex-end' },
    alignBottomLeft: { bottom: 0, left: 0, alignItems: 'flex-start' },
    forecastTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 32,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif'
    },
    forecastSub: { color: '#fff', fontSize: 16, fontWeight: '600', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },

    // Winter Collection
    winterCollectionSection: { marginBottom: 32 },
    winterScroll: { paddingHorizontal: 16 },
    winterCollectionCard: { width: 140, height: 220, marginRight: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F5F5DC' },
    winterCollectionImage: { width: '100%', height: '70%', resizeMode: 'cover' },
    winterCollectionFooter: { width: '100%', height: '30%', justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: '#FAF0E6' },
    winterCollectionName: { fontSize: 12, color: '#555', marginBottom: 2, textAlign: 'center' },
    winterCollectionOffer: { fontSize: 14, fontWeight: 'bold', color: '#111', textAlign: 'center' },
    snowflakeLeft: { position: 'absolute', bottom: 10, left: 5, opacity: 0.6, transform: [{ rotate: '15deg' }] },
    snowflakeRight: { position: 'absolute', bottom: 10, right: 5, opacity: 0.6, transform: [{ rotate: '-15deg' }] },
});
