import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import CachedImage from '../../../shared/CachedImage';
import { useRouter } from 'expo-router';
import { SectionProps } from '../../SectionRenderer';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import api from '../../../../lib/api';
import ProductCard from '../../ProductCard';
import CategoryPulseLoader from '../../../shared/CategoryPulseLoader';

const { width } = Dimensions.get('window');

// Helper to normalize URLs
const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/category/')) {
        return url.replace('/category/', '/common-category/');
    }
    return url;
};


const getOptimizedUrl = (url: string, w = 400) => {
    if (!url) return '';
    if (url.includes('images.unsplash.com') && !url.includes('w=')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}auto=format&fit=crop&w=${w}&q=80`;
    }
    return url;
};

// Shared Header
const SectionHeader = ({ title, actionUrl, router, color = '#000' }: { title: string, actionUrl?: string, router: any, color?: string }) => (
    <TouchableOpacity onPress={() => actionUrl && router.push(normalizeUrl(actionUrl) as any)}>
        <Text style={[styles.sectionTitleBlack, { color }]}>{title} ›</Text>
    </TouchableOpacity>
);

// 2. Subcategories
export const FurnitureSubcategories = ({ data }: SectionProps) => {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>(data?.items || []);

    useEffect(() => {
        if (data?.dataSource) {
            const fetchData = async () => {
                try {
                    const res = await api.get(data.dataSource.endpoint);
                    if (Array.isArray(res.data)) setCategories(res.data);
                } catch (e) { console.log('Furniture subcats error', e); }
            };
            fetchData();
        }
    }, [data]);

    if (!categories.length) return null;

    // Chunk into pairs for 2 rows
    const chunked = [];
    for (let i = 0; i < categories.length; i += 2) chunked.push(categories.slice(i, i + 2));

    return (
        <View style={styles.subcategoriesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {chunked.map((pair, colIndex) => (
                    <View key={colIndex} style={styles.columnWrapper}>
                        {pair.map((sub: any) => (
                            <TouchableOpacity key={sub._id || sub.slug} style={styles.subcategoryItem} onPress={() => router.push((sub.actionUrl ? normalizeUrl(sub.actionUrl) : `/common-category/${sub.slug}`) as any)}>
                                <View style={styles.subcategoryIconContainer}>
                                    {sub.image || sub.icon ? (
                                        <CachedImage source={{ uri: getOptimizedUrl(sub.image || sub.icon, 200) }} style={styles.subcategoryImage} />
                                    ) : (
                                        <View style={[styles.subcategoryImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 20 }}>🛋️</Text></View>
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

// 3. Deal of the Day
export const FurnitureDealOfDay = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.dealOfDaySection}>
            <SectionHeader title={data.title || 'Deal of the day'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.dealCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <CachedImage source={{ uri: getOptimizedUrl(item.image, 400) }} style={styles.dealImage} />
                        <View style={styles.dealOverlay}>
                            <Text style={styles.dealTitle}>{item.title}</Text>
                        </View>
                        <View style={styles.dealFooter}>
                            <Text style={styles.dealPrice}>{item.price}</Text>
                            <FontAwesome name="arrow-right" size={14} color="#fff" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 4. Top Brands Offer
export const FurnitureTopBrands = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.topBrandsSection}>
            <LinearGradient colors={['#FFF176', '#FFD54F']} style={styles.topBrandsContainer}>
                <TouchableOpacity style={styles.topBrandsHeader} onPress={() => data.headerActionUrl && router.push(normalizeUrl(data.headerActionUrl) as any)}>
                    <Text style={styles.topBrandsTitle}>{data.title || 'Top brands, top offers'} ›</Text>
                    <Text style={styles.rocketIcon}>🚀</Text>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topBrandsScrollContent}>
                    {items.map((item: any, index: number) => (
                        <View key={index} style={styles.brandCardWrapper}>
                            <TouchableOpacity style={styles.brandCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                                <CachedImage source={{ uri: getOptimizedUrl(item.image, 300) }} style={styles.brandImage} />
                                <View style={styles.brandLogoPill}>
                                    {item.logo ? (<CachedImage source={{ uri: getOptimizedUrl(item.logo, 100) }} style={styles.brandLogoImage} contentFit="contain" />) :
                                        (<Text style={{ fontSize: 10, fontWeight: 'bold' }}>{item.brandName}</Text>)}
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.brandPrice}>{item.price}</Text>
                        </View>
                    ))}
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

// 5. Sponsorship Banner
export const FurnitureSponsorshipBanner = ({ data }: SectionProps) => {
    const router = useRouter();
    const banner = data?.items?.[0] || {}; // Usually single banner
    if (!banner.image) return null;

    return (
        <TouchableOpacity style={styles.sponsorshipSection} onPress={() => router.push(normalizeUrl(banner.actionUrl) as any)}>
            <CachedImage source={{ uri: getOptimizedUrl(banner.image, 600) }} style={styles.sponsorshipImage} />
        </TouchableOpacity>
    );
};


// 6. Grab or Gone
export const FurnitureGrabOrGone = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.grabOrGoneSection}>
            <View style={styles.grabOrGoneContainer}>
                <Text style={styles.grabOrGoneTitle}>{data.title || 'Grab or gone'}</Text>
                <View style={styles.grabGrid}>
                    {items.map((item: any, index: number) => (
                        <TouchableOpacity key={index} style={styles.grabCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                            <CachedImage source={{ uri: getOptimizedUrl(item.image, 300) }} style={styles.grabImage} />
                            <View style={styles.grabContent}>
                                <Text style={styles.grabTag}>{item.title}</Text>
                                <Text style={styles.grabPrice}>{item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

// 7. Shop By Room
export const FurnitureShopByRoom = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.shopByRoomSection}>
            <SectionHeader title={data.title || 'Shop by room'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.roomGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.roomCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <CachedImage source={{ uri: getOptimizedUrl(item.image, 400) }} style={styles.roomImage} />
                        <View style={[styles.roomOverlay, { backgroundColor: item.color || '#FFD54F' }]}>
                            <Text style={styles.roomTitle}>{item.title}</Text>
                            <FontAwesome name="arrow-right" size={14} color="#000" style={styles.roomArrow} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 8. Samarth Store
export const FurnitureSamarthStore = ({ data }: SectionProps) => {
    const router = useRouter();
    const banner = data?.items?.[0] || {};
    if (!banner.image) return null;

    return (
        <View style={styles.samarthStoreSection}>
            <SectionHeader title={data.title || 'Samarth store'} actionUrl={data.headerActionUrl} router={router} />
            <TouchableOpacity style={styles.samarthBannerContainer} onPress={() => router.push(normalizeUrl(banner.actionUrl) as any)}>
                <CachedImage source={{ uri: getOptimizedUrl(banner.image, 600) }} style={styles.samarthBannerImage} />
            </TouchableOpacity>
        </View>
    );
};

// 9. EMI Offers
export const FurnitureEmiOffers = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.emiLinksSection}>
            <SectionHeader title={data.title || 'Special offers on no cost EMI'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.emiCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <CachedImage source={{ uri: getOptimizedUrl(item.image, 300) }} style={styles.emiImage} />
                        <View style={styles.emiFooter}>
                            <Text style={styles.emiTitle}>{item.title}</Text>
                            <Text style={styles.emiPrice}>{item.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 10. Top Furniture Brands (Grid)
export const FurnitureTopFurnitureBrands = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.topFurnitureBrandsSection}>
            <SectionHeader title={data.title || 'Top furniture brands'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.topBrandsGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.topBrandCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        {item.isViewAll ? (
                            <>
                                <Text style={styles.viewAllText}>View all</Text>
                                <View style={styles.viewAllIcon}>
                                    <FontAwesome name="arrow-right" size={12} color="#fff" />
                                </View>
                            </>
                        ) : (
                            <CachedImage source={{ uri: getOptimizedUrl(item.logo, 150) }} style={styles.topBrandLogo} contentFit="contain" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View >
    );
};


// 11. Shop By Material
export const FurnitureShopByMaterial = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.shopByMaterialSection}>
            <SectionHeader title={data.title || 'Shop by material'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.materialGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.materialCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <CachedImage source={{ uri: getOptimizedUrl(item.image, 300) }} style={styles.materialImage} />
                        <View style={styles.materialFooter}>
                            <Text style={styles.materialText}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 12. Trending Now
export const FurnitureTrendingNow = ({ data }: SectionProps) => {
    const router = useRouter();

    return (
        <View style={styles.trendingSection}>
            <SectionHeader title={data.title || 'Trending now'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.trendingGrid}>
                {/* Static implementation for now as per design pattern, but could be dynamic */}
                <TouchableOpacity style={[styles.trendingCard, styles.trendingCardYellow]} onPress={() => router.push(normalizeUrl('/category/furniture-new-launches') as any)}>
                    <View style={styles.trendingIconContainer}>
                        <FontAwesome name="star" size={40} color="#2962FF" />
                    </View>
                    <Text style={styles.trendingText}>New</Text>
                    <Text style={styles.trendingText}>launches</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.trendingCard, styles.trendingCardGreen]} onPress={() => router.push(normalizeUrl('/category/furniture-betul-exclusive') as any)}>
                    <View style={styles.trendingIconContainer}>
                        <View style={styles.exclusiveIconBg}>
                            <FontAwesome name="star" size={30} color="#2962FF" />
                        </View>
                    </View>
                    <Text style={styles.trendingText}>Betul's</Text>
                    <Text style={styles.trendingText}>Exclusive</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// 13. Wishlist
export const FurnitureWishlist = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.wishlistSection}>
            <View style={styles.wishlistContainer}>
                <Text style={styles.wishlistTitle}>{data.title || 'Add to your wishlist'}</Text>
                <View style={styles.wishlistGrid}>
                    {items.map((item: any, index: number) => (
                        <TouchableOpacity key={index} style={styles.wishlistCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                            <CachedImage source={{ uri: getOptimizedUrl(item.image, 300) }} style={styles.wishlistImage} />
                            <View style={styles.wishlistCardContent}>
                                <Text style={styles.wishlistSubtitle}>{item.title}</Text>
                                <Text style={styles.wishlistPrice}>{item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

// 14. Customer Reviews
export const FurnitureCustomerReviews = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.reviewsSection}>
            <SectionHeader title={data.title || 'Reviews by customers'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <View key={index} style={styles.reviewCard}>
                        <View>
                            <Text style={styles.reviewProductTitle}>{item.product}</Text>
                            <View style={styles.ratingContainer}>
                                {[...Array(5)].map((_, i) => (
                                    <FontAwesome key={i} name="star" size={14} color={i < item.rating ? "#FFEB3B" : "#ccc"} style={{ marginRight: 2 }} />
                                ))}
                            </View>
                        </View>

                        <CachedImage source={{ uri: getOptimizedUrl(item.image, 200) }} style={styles.reviewImage} contentFit="contain" />
                        <View style={styles.reviewOverlay}>
                            <Text style={styles.reviewText}>{item.review}</Text>
                            <Text style={styles.reviewUser}>{item.user}</Text>
                        </View>
                    </View >
                ))}
            </ScrollView >
        </View >
    );
};

// 15. On Everybody's List
export const FurnitureEverybodyList = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.everybodyListSection}>
            <View style={styles.everybodyListContainer}>
                <Text style={styles.everybodyListTitle}>{data.title || "On everybody's list"}</Text>
                <View style={styles.everybodyListGrid}>
                    {items.map((item: any, index: number) => (
                        <TouchableOpacity key={index} style={styles.everybodyListCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                            <CachedImage source={{ uri: getOptimizedUrl(item.image, 300) }} style={styles.everybodyListImage} />
                            <View style={styles.everybodyListCardContent}>
                                <Text style={styles.everybodyListSubtitle}>{item.title}</Text>
                                <Text style={styles.everybodyListPrice}>{item.subtitle}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};


// 16. Rare Finds
export const FurnitureRareFinds = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.rareFindsSection}>
            <SectionHeader title={data.title || "Betul's rare finds"} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.rareFindCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <CachedImage source={{ uri: getOptimizedUrl(item.image, 400) }} style={styles.rareFindImage} />
                        <View style={styles.rareFindLabelContainer}>
                            <View style={styles.rareFindLabel}>
                                <Text style={styles.rareFindText}>{item.title}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 17. Statement Pieces
export const FurnitureStatementPieces = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.statementPiecesSection}>
            <SectionHeader title={data.title || "Shop statement pieces"} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.statementPieceCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <CachedImage source={{ uri: getOptimizedUrl(item.image, 400) }} style={styles.statementPieceImage} />
                        <View style={styles.statementLabelContainer}>
                            <View style={styles.statementLabel}>
                                <Text style={styles.statementText}>{item.title}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 18. Product Grid
export const FurnitureProductGrid = ({ data }: SectionProps) => {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const endpoint = data?.dataSource?.endpoint || '/api/products';
                const params = data?.dataSource?.params || { category: 'Furniture', limit: 10 };
                const res = await api.get(endpoint, { params });
                const list = Array.isArray(res.data) ? res.data : (res.data.products || []);
                setProducts(list);
            } catch (e) {
                console.error("Furniture grid fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [data]);

    if (loading) return <View style={{ marginTop: 20 }}><CategoryPulseLoader /></View>;
    if (products.length === 0) return null;

    return (
        <View style={{ marginTop: 24 }}>
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Latest Furniture</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 20 }}>
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} onPress={() => router.push(`/product/${product._id}`)} />
                ))}
            </View>
        </View>
    );
};


// 19. Gym Accessories
export const SportGymAccessories = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.gymAccessoriesSection}>
            <SectionHeader title={data.title || 'Gym-approved accessories'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.gymAccessoriesGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.gymAccessoryCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <LinearGradient
                            colors={['#3B82F6', '#172554']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gymAccessoryBackground}
                        >
                            <View style={styles.gymAccessoryContent}>
                                <Text style={styles.gymAccessoryTitle} numberOfLines={2}>{item.title}</Text>
                                <View style={{ flex: 1 }} />
                                <Text style={styles.gymAccessoryDiscount}>{item.discount}</Text>
                            </View>

                            {/* Decorative Line approximation */}
                            <View style={styles.gymAccessoryLine} />

                            <CachedImage source={{ uri: getOptimizedUrl(item.image, 300) }} style={styles.gymAccessoryImage} contentFit="contain" />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitleBlack: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12 },
    horizontalScrollContent: { paddingHorizontal: 8 },

    // Subcats
    subcategoriesSection: { paddingVertical: 12 },
    columnWrapper: { marginRight: 12, justifyContent: 'flex-start' },
    subcategoryItem: { width: (width - 60) / 4, maxWidth: 85, alignItems: 'center', marginBottom: 16 },
    subcategoryIconContainer: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 6, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    subcategoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    subcategoryName: { fontSize: 12, lineHeight: 16, height: 32, color: '#374151', textAlign: 'center', fontWeight: '500' },

    // Deal of Day
    dealOfDaySection: { marginBottom: 24, paddingLeft: 16 },
    dealCard: { width: 250, height: 160, marginRight: 16, borderRadius: 12, overflow: 'hidden', position: 'relative' },
    dealImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    dealOverlay: { position: 'absolute', bottom: 30, left: 0, right: 0, padding: 8 },
    dealTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    dealFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
    dealPrice: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    // Top Brands
    topBrandsSection: { marginBottom: 24, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' },
    topBrandsContainer: { paddingVertical: 16, paddingLeft: 16, borderRadius: 16 },
    topBrandsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    topBrandsTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginRight: 8 },
    rocketIcon: { fontSize: 20 },
    topBrandsScrollContent: { paddingRight: 16 },
    brandCardWrapper: { marginRight: 16, width: 140 },
    brandCard: { width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', position: 'relative', marginBottom: 8 },
    brandImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    brandLogoPill: { position: 'absolute', bottom: 12, left: '15%', right: '15%', height: 32, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2, paddingHorizontal: 8 },
    brandLogoImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    brandPrice: { fontSize: 14, fontWeight: 'bold', color: '#000', textAlign: 'center' },

    // Sponsorship
    sponsorshipSection: { marginHorizontal: 16, marginBottom: 24, height: 110, borderRadius: 16, overflow: 'hidden' },
    sponsorshipImage: { width: '100%', height: '100%', resizeMode: 'cover' },

    // Grab or Gone
    grabOrGoneSection: { marginHorizontal: 16, marginBottom: 24 },
    grabOrGoneContainer: { backgroundColor: '#FFCCBC', borderRadius: 16, padding: 16 },
    grabOrGoneTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 16 },
    grabGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    grabCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', paddingBottom: 8 },
    grabImage: { width: '100%', height: 120, resizeMode: 'cover', marginBottom: 8 },
    grabContent: { paddingHorizontal: 8 },
    grabTag: { fontSize: 12, color: '#666', marginBottom: 4 },
    grabPrice: { fontSize: 16, fontWeight: 'bold', color: '#000' },

    // Shop By Room
    shopByRoomSection: { marginHorizontal: 16, marginBottom: 24 },
    roomGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    roomCard: { width: '48%', height: 200, marginBottom: 16, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#eee' },
    roomImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    roomOverlay: { position: 'absolute', bottom: 12, right: 12, left: 30, backgroundColor: '#FFD54F', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
    roomTitle: { fontSize: 14, fontWeight: 'bold', color: '#000', flex: 1, marginRight: 8 },
    roomArrow: { backgroundColor: '#000', color: '#fff', borderRadius: 10, width: 20, height: 20, textAlign: 'center', textAlignVertical: 'center', lineHeight: 20, fontSize: 10, overflow: 'hidden' },

    // Samarth
    samarthStoreSection: { marginHorizontal: 16, marginBottom: 24 },
    samarthBannerContainer: { height: 100, borderRadius: 12, overflow: 'hidden' },
    samarthBannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },

    // EMI
    emiLinksSection: { marginBottom: 24, paddingLeft: 16 },
    emiCard: { width: 140, height: 180, marginRight: 16, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: '#fff' },
    emiImage: { width: '100%', height: '75%', resizeMode: 'cover' },
    emiFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', height: '25%' },
    emiTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
    emiPrice: { fontSize: 12, color: '#ccc' },

    // Top Furn Brands
    topFurnitureBrandsSection: { marginHorizontal: 16, marginBottom: 24 },
    topBrandsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    topBrandCard: { width: '31%', aspectRatio: 1, backgroundColor: '#FFF9C4', borderRadius: 12, marginBottom: 12, justifyContent: 'center', alignItems: 'center', padding: 8 },
    topBrandLogo: { width: '80%', height: '80%', resizeMode: 'contain' },
    viewAllText: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 8 },
    viewAllIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },

    // Shop by Material
    shopByMaterialSection: { marginHorizontal: 16, marginBottom: 24 },
    materialGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    materialCard: { width: '48%', height: 180, marginBottom: 16, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: '#fff' },
    materialImage: { width: '100%', height: '80%', resizeMode: 'cover' },
    materialFooter: { width: '100%', height: '20%', backgroundColor: '#000', justifyContent: 'center', paddingHorizontal: 8 },
    materialText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    // Trending
    trendingSection: { marginHorizontal: 16, marginBottom: 24 },
    trendingGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    trendingCard: { width: '48%', height: 160, borderRadius: 16, justifyContent: 'center', alignItems: 'center', padding: 16 },
    trendingCardYellow: { backgroundColor: '#FFF59D' },
    trendingCardGreen: { backgroundColor: '#C5E1A5' },
    trendingIconContainer: { marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
    exclusiveIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFEB3B', justifyContent: 'center', alignItems: 'center' },
    trendingText: { fontSize: 18, fontWeight: 'bold', color: '#000', textAlign: 'center', lineHeight: 22 },

    // Wishlist
    wishlistSection: { marginBottom: 24, marginHorizontal: 16 },
    wishlistContainer: { backgroundColor: '#FFCCBC', borderRadius: 16, padding: 16 },
    wishlistTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 16 },
    wishlistGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    wishlistCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', paddingBottom: 8 },
    wishlistImage: { width: '100%', height: 140, resizeMode: 'cover', marginBottom: 8 },
    wishlistCardContent: { paddingHorizontal: 8 },
    wishlistSubtitle: { fontSize: 12, color: '#666', marginBottom: 2 },
    wishlistPrice: { fontSize: 14, fontWeight: 'bold', color: '#000' },

    // Reviews
    reviewsSection: { marginBottom: 24, paddingLeft: 16 },
    reviewCard: { width: 250, height: 280, backgroundColor: '#9575CD', borderRadius: 16, marginRight: 16, padding: 16, position: 'relative', justifyContent: 'space-between' },
    reviewProductTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
    ratingContainer: { flexDirection: 'row', marginBottom: 12 },
    reviewImage: { width: '100%', height: 120, resizeMode: 'contain', position: 'absolute', top: 60, left: 16, zIndex: 1 },
    reviewOverlay: { backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 12, padding: 12, marginTop: 100 },
    reviewText: { fontSize: 12, color: '#000', fontWeight: '600', marginBottom: 4, lineHeight: 16 },
    reviewUser: { fontSize: 10, color: '#000', fontWeight: 'bold', textAlign: 'right' },

    // Everybody List
    everybodyListSection: { marginBottom: 24, marginHorizontal: 16 },
    everybodyListContainer: { backgroundColor: '#FFCCBC', borderRadius: 16, padding: 16, position: 'relative' },
    everybodyListTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 16 },
    everybodyListGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    everybodyListCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', paddingBottom: 8 },
    everybodyListImage: { width: '100%', height: 140, resizeMode: 'cover', marginBottom: 8 },
    everybodyListCardContent: { paddingHorizontal: 8 },
    everybodyListSubtitle: { fontSize: 12, color: '#666', marginBottom: 2 },
    everybodyListPrice: { fontSize: 14, fontWeight: 'bold', color: '#000' },

    // Rare Finds
    rareFindsSection: { marginBottom: 24, paddingLeft: 16 },
    rareFindCard: { width: 280, height: 280, marginRight: 16, borderRadius: 24, overflow: 'hidden', position: 'relative' },
    rareFindImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    rareFindLabelContainer: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
    rareFindLabel: { backgroundColor: 'rgba(255, 255, 255, 0.85)', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
    rareFindText: { fontSize: 18, fontWeight: 'bold', color: '#000' },

    // Statement
    statementPiecesSection: { marginBottom: 24, paddingLeft: 16 },
    statementPieceCard: { width: 280, height: 350, marginRight: 16, borderRadius: 24, overflow: 'hidden', position: 'relative' },
    statementPieceImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    statementLabelContainer: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
    statementLabel: { backgroundColor: 'rgba(255, 255, 255, 0.85)', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
    statementText: { fontSize: 18, fontWeight: 'bold', color: '#000', fontFamily: 'serif' },

    // Gym Accessories
    gymAccessoriesSection: { marginBottom: 24, paddingLeft: 16 },
    gymAccessoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingRight: 16 },
    gymAccessoryCard: { width: '48%', height: 220, marginBottom: 12, borderRadius: 16, overflow: 'hidden' },
    gymAccessoryBackground: { flex: 1, padding: 12, position: 'relative' },
    gymAccessoryContent: { zIndex: 10, height: '100%', paddingBottom: 30 },
    gymAccessoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4, lineHeight: 22, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
    gymAccessoryDiscount: { fontSize: 13, fontWeight: 'bold', color: '#CCFF00' },
    gymAccessoryLine: { position: 'absolute', top: 60, left: 16, width: 40, height: 90, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
    gymAccessoryImage: { position: 'absolute', bottom: -10, right: -10, width: 130, height: 130 },

});
