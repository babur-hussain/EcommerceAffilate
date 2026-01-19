import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SectionProps } from '../../SectionRenderer';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../../../lib/api';
import ProductCard from '../../ProductCard';
import CategoryPulseLoader from '../../../shared/CategoryPulseLoader';

const { width } = Dimensions.get('window');

// Shared Section Header
const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/category/')) {
        return url.replace('/category/', '/common-category/');
    }
    return url;
};

const SectionHeader = ({ title, actionUrl, router, color = '#111827' }: { title: string, actionUrl?: string, router: any, color?: string }) => (
    <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
        {actionUrl && (
            <TouchableOpacity onPress={() => router.push(normalizeUrl(actionUrl) as any)}>
                <Text style={{ color: '#FF6F00', fontWeight: '600' }}>View All</Text>
            </TouchableOpacity>
        )}
    </View>
);

// 1. Subcategories (2 Rows)
export const BeautySubcategories = ({ data }: SectionProps) => {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>(data?.items || []);

    useEffect(() => {
        if (data?.dataSource) {
            const fetchData = async () => {
                try {
                    const res = await api.get(data.dataSource.endpoint);
                    if (Array.isArray(res.data)) setCategories(res.data);
                } catch (e) {
                    console.log('Beauty subcats fetch error', e);
                }
            };
            fetchData();
        }
    }, [data]);

    if (!categories.length) return null;

    // Split into chunks of 2 for rows
    const chuckSize = 2;
    const chunked = [];
    for (let i = 0; i < categories.length; i += chuckSize) {
        chunked.push(categories.slice(i, i + chuckSize));
    }

    return (
        <View style={styles.subcategoriesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {chunked.map((pair, colIndex) => (
                    <View key={colIndex} style={styles.columnWrapper}>
                        {pair.map((sub: any) => (
                            <TouchableOpacity key={sub._id || sub.slug} style={styles.subcategoryItem} onPress={() => router.push((sub.actionUrl ? normalizeUrl(sub.actionUrl) : `/common-category/${sub.slug}`) as any)}>
                                <View style={styles.subcategoryIconContainer}>
                                    {sub.image || sub.icon ? (
                                        <Image source={{ uri: sub.image || sub.icon }} style={styles.subcategoryImage} />
                                    ) : (
                                        <View style={[styles.subcategoryImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={{ fontSize: 20 }}>💄</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.subcategoryName} numberOfLines={2}>{sub.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// 2. Promo Poster
export const BeautyPromoPoster = ({ data }: SectionProps) => {
    const router = useRouter();
    if (!data?.image) return null;
    return (
        <TouchableOpacity
            style={styles.promoPosterContainer}
            activeOpacity={0.9}
            onPress={() => data.actionUrl && router.push(normalizeUrl(data.actionUrl) as any)}
        >
            <Image source={{ uri: data.image }} style={styles.promoPoster} />
        </TouchableOpacity>
    );
};

// 3. Glow for the Harvest
export const BeautyGlowHarvest = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.harvestSection}>
            <Text style={styles.sectionTitleBlack}>{data.title || 'Glow for the harvest'}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.harvestScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.harvestItemContainer}
                        onPress={() => item.actionUrl && router.push(normalizeUrl(item.actionUrl) as any)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.harvestCard}>
                            <View style={styles.harvestCardInner}>
                                <ImageBackground
                                    source={{ uri: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768414560/IMG_1856_tkqhto.jpg' }}
                                    style={styles.harvestBackground}
                                    imageStyle={{ resizeMode: 'cover', opacity: 0.6 }}
                                >
                                    <View style={styles.harvestImageWrapper}>
                                        <Image source={{ uri: item.image }} style={styles.harvestImage} />
                                        <Text style={styles.kiteIcon}>🪁</Text>
                                        <Text style={styles.kiteIconSmall}>🪁</Text>
                                    </View>
                                    <View style={styles.offerBadge}>
                                        <Text style={styles.offerText}>{item.offer}</Text>
                                    </View>
                                </ImageBackground>
                            </View>
                        </View>
                        <View style={styles.labelPill}>
                            <Text style={styles.labelText}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 4. Consultation Banner (Sponsorship)
export const BeautyConsultationBanner = ({ data }: SectionProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.consultationBanner}
            activeOpacity={0.9}
            onPress={() => (data.actionUrl || data.headerActionUrl) && router.push(normalizeUrl(data.actionUrl || data.headerActionUrl) as any)}
        >
            <View style={styles.consultationContent}>
                <View style={styles.consultationTextContainer}>
                    <View style={styles.consultationTitleRow}>
                        <Text style={{ fontSize: 24, marginRight: 8 }}>🩺</Text>
                        <Text style={styles.consultationTitle}>Free{'\n'}dermatologist's{'\n'}consultation</Text>
                    </View>
                    <View style={styles.consultationDivider} />
                    <View style={styles.callContainer}>
                        <Text style={styles.consultationCallText}>Call on</Text>
                        <Text style={styles.consultationPhone}>011-35664195</Text>
                    </View>
                </View>
                <View style={styles.sarvrachnaBadge}>
                    <Text style={styles.poweredByText}>Powered by</Text>
                    <View style={styles.sarvrachnaLogoContainer}>
                        <Text style={styles.sarvrachnaText}>Sarvrachna</Text>
                    </View>
                </View>
            </View>
            <Image
                source={{ uri: 'https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png' }}
                style={styles.consultationDoctorImage}
            />
            <View style={[styles.bubble, { top: 10, right: 80, width: 20, height: 20, opacity: 0.2 }]} />
            <View style={[styles.bubble, { bottom: 20, right: 100, width: 10, height: 10, opacity: 0.1 }]} />
        </TouchableOpacity>
    );
};

// 5. Trending Brands
export const BeautyTrendingBrands = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.trendingSection}>
            <SectionHeader title={data.title || 'Trending brands'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.trendingGrid}>
                {items.map((brand: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.trendingCardContainer}
                        onPress={() => brand.actionUrl && router.push(normalizeUrl(brand.actionUrl) as any)}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.trendingCard, { backgroundColor: brand.bg }]}>
                            <View style={styles.brandLogoPill}>
                                <Text style={styles.brandLogoText}>{brand.name}</Text>
                            </View>
                            <Image source={{ uri: brand.image }} style={styles.trendingImage} />
                        </View>
                        <Text style={styles.trendingOffer}>{brand.offer}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 6. Globally Loved A-Listers
export const BeautyAlisters = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.alistersSection}>
            <SectionHeader title={data.title || 'Globally loved A-listers'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.trendingGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.trendingCardContainer}
                        onPress={() => item.actionUrl && router.push(normalizeUrl(item.actionUrl) as any)}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.alisterCard, { backgroundColor: item.bg }]}>
                            <View style={styles.alisterHeader}>
                                <Text style={styles.alisterBrandText}>{item.brand}</Text>
                                {item.subBrand && <Text style={styles.alisterSubBrandText}>{item.subBrand}</Text>}
                            </View>
                            <Image source={{ uri: item.model }} style={styles.alisterModel} />
                            <View style={styles.alisterProductWrapper}>
                                <Image source={{ uri: item.product }} style={styles.alisterProduct} />
                            </View>
                        </View>
                        <Text style={styles.trendingOffer}>{item.offer}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 7. The Launch Party
export const BeautyLaunchParty = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <LinearGradient
            colors={['#F06292', '#FF8A65']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.launchPartyContainer}
        >
            <TouchableOpacity onPress={() => data.headerActionUrl && router.push(normalizeUrl(data.headerActionUrl) as any)} style={styles.launchPartyHeaderRow}>
                <Text style={styles.launchTitle}>{data.title || 'The Launch Party'}</Text>
                <View style={styles.launchBadge}>
                    <Text style={styles.launchBadgeText}>The{'\n'}LAUNCH{'\n'}party</Text>
                </View>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.launchScrollContent}>
                {items.map((item: any, index: number) => (
                    <View key={index} style={styles.launchCard}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push((item.actionUrl ? normalizeUrl(item.actionUrl) : '') as any)}>
                            <ImageBackground source={{ uri: item.image }} style={styles.launchCardBg} resizeMode="cover" />
                            <View style={styles.launchFooter}>
                                <Text style={styles.launchFooterText}>{item.offer}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

// 8. Trend More, Spend Less
export const BeautyTrendMore = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.trendMoreSection}>
            <SectionHeader title={data.title || 'Trend more, spend less'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendMoreScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.trendMoreCardContainer}
                        onPress={() => item.actionUrl && router.push(normalizeUrl(item.actionUrl) as any)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.trendMoreCard}>
                            <Text style={styles.trendMoreTitle}>{item.title}</Text>
                            <View style={styles.trendMoreImageContainer}>
                                <Image source={{ uri: item.image }} style={styles.trendMoreImage} />
                            </View>
                        </View>
                        <View style={styles.trendMoreFooter}>
                            <Text style={styles.brandRowText}>{item.brands}</Text>
                            <Text style={styles.trendOfferText}>{item.offer}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 9. Internet Famed Brands
export const BeautyInternetFamed = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.internetSection}>
            <SectionHeader title={data.title || 'Internet-famed brands'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.internetGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.internetCardContainer}
                        onPress={() => item.actionUrl && router.push(normalizeUrl(item.actionUrl) as any)}
                        activeOpacity={0.9}
                    >
                        <LinearGradient colors={item.bg || ['#F8BBD0', '#EC407A']} style={styles.internetCard}>
                            <View style={styles.logoPill}>
                                <Text style={styles.logoPillText}>{item.brand}</Text>
                            </View>
                            <Text style={styles.internetDesc}>{item.desc}</Text>
                            <Image source={{ uri: item.image }} style={styles.internetImage} />
                        </LinearGradient>
                        <Text style={styles.internetOffer}>{item.offer}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 10. K-Beauty Obsessed (Auto Scroll)
export const BeautyKBeauty = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    const scrollRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const CARD_WIDTH = width * 0.85;
    const SPACING = 16;
    const SNAP_INTERVAL = CARD_WIDTH + SPACING;

    useEffect(() => {
        if (!items.length) return;
        const interval = setInterval(() => {
            let next = activeIndex + 1;
            if (next >= items.length) next = 0;
            setActiveIndex(next);
            scrollRef.current?.scrollTo({ x: next * SNAP_INTERVAL, animated: true });
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex, items.length]);

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
        // setActiveIndex(index); // Optional sync
    };

    if (!items.length) return null;

    return (
        <View style={styles.kBeautySection}>
            <SectionHeader title={data.title || 'K-Beauty obsessed?'} actionUrl={data.headerActionUrl} router={router} />

            <View style={styles.kBeautyContainer}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={onScroll}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    snapToInterval={SNAP_INTERVAL}
                    decelerationRate="fast"
                    pagingEnabled={false}
                >
                    {items.map((item: any, index: number) => (
                        <View key={index} style={[styles.kBeautyCard, { backgroundColor: item.bg, width: CARD_WIDTH, marginRight: SPACING }]}>
                            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => router.push((item.actionUrl ? normalizeUrl(item.actionUrl) : '') as any)}>
                                <View style={styles.kBeautyBrandPill}>
                                    <Text style={[styles.kBeautyBrandText, item.darkText && { color: '#000' }]}>{item.brand}</Text>
                                </View>
                                <Image source={{ uri: item.image }} style={styles.kBeautyImage} />
                                <View style={styles.kBeautyIngredientBox}>
                                    <Text style={styles.ingredientTitle}>{item.ingredientTitle || 'Star\ningredient'}</Text>
                                    <View style={styles.ingredientDivider} />
                                    <Text style={styles.ingredientName}>{item.ingredient}</Text>
                                </View>
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.kBeautyGradientFooter}>
                                    <Text style={styles.kBeautyOfferText}>{item.offer}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.paginationContainer}>
                    {items.map((_: any, index: number) => (
                        <View key={index} style={[styles.paginationDot, activeIndex === index ? styles.activeDot : styles.inactiveDot]} />
                    ))}
                </View>
            </View>
        </View>
    );
};

// 11. Glam on a Budget
export const BeautyGlamBudget = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.glamSection}>
            <SectionHeader title={data.title || 'Glam on a budget'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.glamGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.glamCard} onPress={() => router.push((item.actionUrl ? normalizeUrl(item.actionUrl) : '') as any)}>
                        <LinearGradient
                            colors={item.bg || ['#FFFDE7', '#FFD54F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                        />
                        <Text style={styles.glamLabel}>{item.label}</Text>
                        <Text style={styles.glamValue}>{item.value}</Text>
                        {item.sub && <Text style={styles.glamSub}>{item.sub}</Text>}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};


// 12. Beauty Product Grid
export const BeautyProductGrid = ({ data }: SectionProps) => {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const endpoint = data?.dataSource?.endpoint || '/api/products';
                const params = data?.dataSource?.params || { category: 'Beauty', limit: 10 };
                const res = await api.get(endpoint, { params });
                const list = Array.isArray(res.data) ? res.data : (res.data.products || []);
                setProducts(list);
            } catch (e) {
                console.error("Beauty grid fetch error", e);
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
                <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
                    <Text style={styles.sectionTitle}>{data.title || 'Latest in Beauty'}</Text>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No beauty products found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.productsSection}>
            <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
                <Text style={styles.sectionTitle}>{data.title || 'Latest in Beauty'}</Text>
            </View>
            <View style={styles.productsGrid}>
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} onPress={() => router.push(`/product/${product._id}`)} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    sectionTitleBlack: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12 },
    horizontalScrollContent: { paddingHorizontal: 8 },
    productsSection: { marginTop: 8 },
    productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 20 },
    emptyState: { width: '100%', padding: 40, alignItems: 'center' },
    emptyText: { color: '#666', fontSize: 16 },

    // Subcategories
    subcategoriesSection: { paddingTop: 12, paddingBottom: 0 },
    columnWrapper: { marginRight: 12, justifyContent: 'flex-start' },
    subcategoryItem: { width: (width - 60) / 4, maxWidth: 85, alignItems: 'center', marginBottom: 12 },
    subcategoryIconContainer: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 6, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    subcategoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    subcategoryName: { fontSize: 12, lineHeight: 16, height: 32, color: '#374151', textAlign: 'center', fontWeight: '500' },

    // Promo Poster
    promoPosterContainer: { marginTop: 4, marginHorizontal: 16, marginBottom: 20, borderRadius: 12, overflow: 'hidden', height: 120, backgroundColor: '#f0f0f0' },
    promoPoster: { width: '100%', height: '100%', resizeMode: 'cover' },

    // Harvest
    harvestSection: { paddingBottom: 20, paddingLeft: 16 },
    harvestScrollContent: { paddingRight: 16 },
    harvestItemContainer: { marginRight: 12, alignItems: 'center' },
    harvestCard: { width: 140, height: 180, borderRadius: 16, overflow: 'hidden', backgroundColor: '#FFF3E0', marginBottom: 8 },
    harvestCardInner: { flex: 1 },
    harvestBackground: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
    harvestImageWrapper: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    harvestImage: { width: '100%', height: '100%', resizeMode: 'contain', zIndex: 1 },
    kiteIcon: { position: 'absolute', top: -10, right: -15, fontSize: 24, zIndex: 2, transform: [{ rotate: '15deg' }] },
    kiteIconSmall: { position: 'absolute', top: 10, left: -10, fontSize: 16, zIndex: 2, transform: [{ rotate: '-10deg' }] },
    offerBadge: { backgroundColor: '#E91E63', width: '100%', paddingVertical: 6, borderTopLeftRadius: 50, borderTopRightRadius: 50, alignItems: 'center', position: 'absolute', bottom: 0 },
    offerText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    labelPill: { backgroundColor: '#FCE4EC', paddingVertical: 4, paddingHorizontal: 16, borderRadius: 12 },
    labelText: { fontSize: 14, color: '#333', fontWeight: '500' },

    // Consultation
    consultationBanner: { backgroundColor: '#D1E7FC', marginHorizontal: 16, marginBottom: 24, borderRadius: 16, overflow: 'hidden', height: 110, flexDirection: 'row', alignItems: 'center', position: 'relative', paddingLeft: 16 },
    consultationContent: { flex: 1, zIndex: 2 },
    consultationTextContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    consultationTitleRow: { flexDirection: 'row', alignItems: 'center' },
    consultationTitle: { fontSize: 14, fontWeight: 'bold', color: '#0D47A1', lineHeight: 18 },
    consultationDivider: { width: 1, height: 30, backgroundColor: '#90CAF9', marginHorizontal: 12 },
    callContainer: { justifyContent: 'center' },
    consultationCallText: { fontSize: 10, color: '#1565C0' },
    consultationPhone: { fontSize: 13, fontWeight: 'bold', color: '#0D47A1' },
    sarvrachnaBadge: { marginTop: 4 },
    poweredByText: { fontSize: 9, color: '#555' },
    sarvrachnaLogoContainer: { flexDirection: 'row', alignItems: 'center' },
    sarvrachnaText: { fontSize: 11, fontWeight: 'bold', color: '#0056D2', fontStyle: 'italic' },
    consultationDoctorImage: { width: 120, height: 120, resizeMode: 'contain', position: 'absolute', right: 0, bottom: 0 },
    bubble: { backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 999, position: 'absolute' },

    // Trending Brands
    trendingSection: { marginBottom: 24 },
    trendingGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
    trendingCardContainer: { width: '48%', marginBottom: 16, alignItems: 'center' },
    trendingCard: { width: '100%', height: 160, borderRadius: 20, position: 'relative', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10, overflow: 'hidden' },
    brandLogoPill: { position: 'absolute', top: 12, left: 12, backgroundColor: '#fff', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, zIndex: 2 },
    brandLogoText: { fontSize: 10, fontWeight: 'bold', color: '#000', textTransform: 'uppercase' },
    trendingImage: { width: 100, height: 100, resizeMode: 'contain' },
    trendingOffer: { marginTop: 8, fontSize: 14, fontWeight: 'bold', color: '#000', textAlign: 'center' },

    // Alisters
    alistersSection: { marginBottom: 24 },
    alisterCard: { width: '100%', height: 190, borderRadius: 20, position: 'relative', overflow: 'hidden' },
    alisterHeader: { position: 'absolute', top: 15, left: 0, right: 0, alignItems: 'center', zIndex: 2 },
    alisterBrandText: { fontSize: 16, fontWeight: 'bold', color: '#000', letterSpacing: 1, textAlign: 'center' },
    alisterSubBrandText: { fontSize: 8, color: '#333', textTransform: 'uppercase', marginTop: 2 },
    alisterModel: { width: '70%', height: '80%', position: 'absolute', bottom: 0, right: 0, resizeMode: 'cover', borderTopLeftRadius: 50 },
    alisterProductWrapper: { position: 'absolute', bottom: 10, left: 10, width: 70, height: 90, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    alisterProduct: { width: '90%', height: '90%', resizeMode: 'contain', transform: [{ rotate: '-10deg' }] },

    // Launch Party
    launchPartyContainer: { marginHorizontal: 16, borderRadius: 20, padding: 16, marginBottom: 24 },
    launchPartyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    launchTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 4 },
    launchBadge: { backgroundColor: '#E91E63', borderRadius: 50, paddingVertical: 6, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
    launchBadgeText: { color: '#fff', fontSize: 8, fontWeight: 'bold', textAlign: 'center', lineHeight: 10 },
    launchScrollContent: { paddingRight: 0 },
    launchCard: { width: 150, height: 200, borderRadius: 16, marginRight: 12, overflow: 'hidden', backgroundColor: '#fff' },
    launchCardBg: { flex: 1, width: '100%', justifyContent: 'flex-end' },
    launchFooter: { backgroundColor: '#D32F2F', paddingVertical: 8, alignItems: 'center' },
    launchFooterText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    // Trend More
    trendMoreSection: { marginBottom: 24 },
    trendMoreScrollContent: { paddingHorizontal: 16 },
    trendMoreCardContainer: { marginRight: 16, alignItems: 'center' },
    trendMoreCard: { width: 160, height: 200, backgroundColor: '#E91E63', borderRadius: 24, paddingTop: 16, alignItems: 'center', overflow: 'hidden' },
    trendMoreTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    trendMoreImageContainer: { flex: 1, width: '100%', borderTopLeftRadius: 100, borderTopRightRadius: 100, overflow: 'hidden', backgroundColor: '#fff', marginTop: 4 },
    trendMoreImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    trendMoreFooter: { marginTop: 8, alignItems: 'center' },
    brandRowText: { fontSize: 10, color: '#666', fontWeight: '500', marginBottom: 2, textTransform: 'uppercase' },
    trendOfferText: { fontSize: 14, fontWeight: 'bold', color: '#000' },

    // Internet Famed
    internetSection: { marginBottom: 24 },
    internetGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
    internetCardContainer: { width: '48%', marginBottom: 16, alignItems: 'center' },
    internetCard: { width: '100%', height: 200, borderRadius: 20, borderTopLeftRadius: 80, borderTopRightRadius: 80, alignItems: 'center', paddingTop: 20, overflow: 'hidden' },
    logoPill: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
    logoPillText: { fontSize: 12, fontWeight: 'bold', color: '#000', textTransform: 'uppercase' },
    internetDesc: { color: '#fff', fontSize: 11, textAlign: 'center', paddingHorizontal: 10, marginBottom: 8, fontWeight: '500' },
    internetImage: { width: '70%', height: 100, resizeMode: 'contain', position: 'absolute', bottom: 0 },
    internetOffer: { marginTop: 6, fontSize: 14, fontWeight: 'bold', color: '#000' },

    // K-Beauty
    kBeautySection: { marginBottom: 32, paddingHorizontal: 16 },
    kBeautyContainer: { borderRadius: 20, overflow: 'hidden' },
    kBeautyCard: { height: 340, borderRadius: 20, position: 'relative', overflow: 'hidden' },
    kBeautyBrandPill: { position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, zIndex: 2 },
    kBeautyBrandText: { fontSize: 24, fontWeight: '300', color: '#fff', letterSpacing: 2 },
    kBeautyImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    kBeautyIngredientBox: { position: 'absolute', right: 0, top: '45%', backgroundColor: '#E91E63', paddingVertical: 16, paddingHorizontal: 12, borderTopLeftRadius: 16, borderBottomLeftRadius: 16, zIndex: 2, elevation: 4 },
    ingredientTitle: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    ingredientDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.5)', marginVertical: 4, width: '100%' },
    ingredientName: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    kBeautyGradientFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 },
    kBeautyOfferText: { color: '#fff', fontSize: 24, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
    paginationContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
    paginationDot: { height: 4, borderRadius: 2, marginHorizontal: 4 },
    activeDot: { width: 24, backgroundColor: '#000' },
    inactiveDot: { width: 12, backgroundColor: '#E0E0E0' },

    // Glam Budget
    glamSection: { marginBottom: 32, paddingHorizontal: 16 },
    glamGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    glamCard: { width: '31%', aspectRatio: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12, position: 'relative', overflow: 'hidden' },
    glamLabel: { fontSize: 14, color: '#5D4037', marginBottom: 2, fontWeight: '500' },
    glamValue: { fontSize: 24, fontWeight: 'bold', color: '#3E2723' },
    glamSub: { fontSize: 16, color: '#5D4037', fontWeight: '500' },
});
