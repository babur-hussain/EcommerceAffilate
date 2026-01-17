import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
import { CachedImage } from '../../../common/CachedImage';
import { useRouter } from 'expo-router';
import api from '../../../../lib/api';
import ProductCard from '../../ProductCard';
import CategoryBannerSlider from '../../CategoryBannerSlider';

const { width } = Dimensions.get('window');

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
}

interface MobilesPageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function MobilesPage({ staticHeader, renderStickyHeader }: MobilesPageProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const categoryId = '69680eb93e452f159339f524';
    const categoryName = 'Mobiles';

    useEffect(() => {
        fetchCategoryData();
    }, []);

    const fetchCategoryData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Category Details (for posters/banners)
            try {
                const categoryResponse = await api.get(`/api/categories/${categoryId}`);
                if (categoryResponse.data && categoryResponse.data.posters && categoryResponse.data.posters.length > 0) {
                    setBanners(categoryResponse.data.posters);
                }
            } catch (e) {
                console.log(`Category details fetch failed for ${categoryName}`, e);
            }

            // 2. Fetch Subcategories
            try {
                const subcategoriesResponse = await api.get(`/api/categories/${categoryId}/subcategories`);
                if (Array.isArray(subcategoriesResponse.data) && subcategoriesResponse.data.length > 0) {
                    setSubcategories(subcategoriesResponse.data);
                } else {
                    // Fallback check if direct endpoint fails or returns empty
                    const fallbackResponse = await api.get(`/api/categories?parentCategory=${categoryId}`);
                    if (Array.isArray(fallbackResponse.data)) {
                        setSubcategories(fallbackResponse.data);
                    }
                }
            } catch (e) {
                console.log(`Subcategories fetch failed for ${categoryName}`, e);
            }

            // 3. Fetch Products
            const productsResponse = await api.get(`/api/products?category=${categoryId}&limit=10`);
            const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : (productsResponse.data.products || []);
            setProducts(productsData);

        } catch (error) {
            console.error(`Error fetching data for ${categoryName}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        if (headerHeight > 0) {
            setIsSticky(scrollY > headerHeight - 10);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
                {staticHeader}
            </View>
            <View>{renderStickyHeader ? renderStickyHeader(isSticky) : null}</View>

            <View style={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF6F00" />
                    </View>
                ) : (
                    <>
                        {/* 1. Custom Banner Layout */}
                        <View style={styles.bannersContainer}>
                            {/* Top Row - 2 images side by side */}
                            <View style={styles.topBannersRow}>
                                <TouchableOpacity style={styles.halfBanner}>
                                    <CachedImage
                                        uri="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
                                        style={styles.halfBannerImage}
                                    />
                                    <View style={styles.halfBannerOverlay}>
                                        <Text style={styles.halfBannerTitle}>Republic{'\n'}Day Sale</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.halfBanner}>
                                    <CachedImage
                                        uri="https://images.unsplash.com/photo-1592286927505-c0d0eb5e8a8c?auto=format&fit=crop&w=600&q=80"
                                        style={styles.halfBannerImage}
                                    />
                                    <View style={styles.halfBannerOverlay}>
                                        <Text style={styles.halfBannerTitle}>Early Bird{'\n'}Deals</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Second Row - Full width Epic Republic Deals */}
                            <TouchableOpacity style={styles.fullBanner}>
                                <CachedImage
                                    uri="https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80"
                                    style={styles.fullBannerImage}
                                />
                                <View style={styles.epicDealsOverlay}>
                                    <Text style={styles.epicDealsTitle}>Epic Republic Deals{'\n'}on Smartphones</Text>
                                    <Text style={styles.epicDealsSubtitle}>Title sponsor: intel CORE ULTRA</Text>
                                    <View style={styles.sponsorsRow}>
                                        <Text style={styles.sponsorText}>Associate sponsors</Text>
                                        <View style={styles.sponsorLogos}>
                                            <Text style={styles.sponsorLogo}>OPPO</Text>
                                            <Text style={styles.sponsorLogo}>NOISE</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Third Row - Full width iPhone 17 */}
                            <TouchableOpacity style={styles.fullBanner}>
                                <CachedImage
                                    uri="https://images.unsplash.com/photo-1592286927505-c0d0eb5a8a8c?auto=format&fit=crop&w=1200&q=80"
                                    style={styles.fullBannerImage}
                                />
                                <View style={styles.iphoneOverlay}>
                                    <Text style={styles.iphoneTitle}>iPhone 17</Text>
                                    <Text style={styles.iphonePrice}>From ₹74,900*</Text>
                                    <Text style={styles.iphoneSubtext}>All 5 Colors{'\n'}Unbeatable Prices</Text>
                                    <TouchableOpacity style={styles.wishlistButton}>
                                        <Text style={styles.wishlistButtonText}>Wishlist Now</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.iphoneOffer}>*₹5,000 Off On Exch.</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* 2. Buy before the sale Section */}
                        <View style={styles.buyBeforeSaleSection}>
                            <TouchableOpacity onPress={() => router.push('/mobiles/collection/buy-before-sale')}>
                                <Text style={styles.buyBeforeSaleTitle}>Buy before the sale ›</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.buyBeforeSaleScroll}
                            >
                                {/* Festive Prices Card */}
                                <TouchableOpacity style={styles.festivePriceCard}>
                                    <View style={styles.festivePriceHeader}>
                                        <Text style={styles.festivePriceHeaderText}>
                                            Festive Prices are Back!{'\n'}Last chance to grab!
                                        </Text>
                                    </View>
                                    <View style={styles.festivePriceContent}>
                                        <CachedImage
                                            uri="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80"
                                            style={styles.festivePriceImage}
                                        />
                                        <View style={styles.festivePriceInfo}>
                                            <Text style={styles.festivePriceProductName}>edge 60 Pro</Text>
                                            <Text style={styles.festivePriceAmount}>Just ₹25,999*</Text>
                                            <Text style={styles.festivePriceSubtext}>Buy Before{'\n'}the sale</Text>
                                        </View>
                                    </View>
                                    <View style={styles.festivePriceBrand}>
                                        <Text style={styles.festivePriceBrandText}>motorola</Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Lowest Price Card */}
                                <TouchableOpacity style={styles.lowestPriceCard}>
                                    <View style={styles.lowestPriceHeader}>
                                        <Text style={styles.lowestPriceHeaderText}>Lowest Price since Launch</Text>
                                        <Text style={styles.lowestPriceWishlist}>Wishlist Now</Text>
                                    </View>
                                    <View style={styles.lowestPriceProducts}>
                                        <View style={styles.lowestPriceProduct}>
                                            <Text style={styles.lowestPriceProductTitle}>Ai+ Pulse (8|128GB)</Text>
                                            <Text style={styles.lowestPriceProductPrice}>From ₹5,999*</Text>
                                            <CachedImage
                                                uri="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80"
                                                style={styles.lowestPriceProductImage}
                                            />
                                            <View style={styles.lowestPriceProductBadge}>
                                                <Text style={styles.lowestPriceProductBadgeText}>PULSE</Text>
                                                <Text style={styles.lowestPriceProductSpec}>50MP</Text>
                                                <Text style={styles.lowestPriceProductSpec}>5000mAh</Text>
                                            </View>
                                        </View>
                                        <View style={styles.lowestPriceProduct}>
                                            <Text style={styles.lowestPriceProductTitle}>Ai+ Nova</Text>
                                            <Text style={styles.lowestPriceProductPrice}>From ₹6,999*</Text>
                                            <CachedImage
                                                uri="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80"
                                                style={styles.lowestPriceProductImage}
                                            />
                                            <View style={styles.lowestPriceProductBadge}>
                                                <Text style={styles.lowestPriceProductBadgeText}>NOVA</Text>
                                                <Text style={styles.lowestPriceProductSpec}>610K AnTuTu Score</Text>
                                                <Text style={styles.lowestPriceProductSpec}>120Hz</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                        {/* 3. Subcategories Grid */}
                        {subcategories.length > 0 && (
                            <View style={styles.subcategoriesSection}>
                                <View style={styles.subcategoriesGrid}>
                                    {subcategories.map((sub) => (
                                        <TouchableOpacity
                                            key={sub._id}
                                            style={styles.subcategoryItem}
                                            onPress={() => router.push(`/common-category/${sub.slug}`)}
                                        >
                                            <View style={styles.subcategoryIconContainer}>
                                                {sub.image || sub.icon ? (
                                                    <CachedImage
                                                        uri={sub.image || sub.icon || ''}
                                                        style={styles.subcategoryImage}
                                                    />
                                                ) : (
                                                    <View style={[styles.subcategoryImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                                                        <Text style={{ fontSize: 20 }}>📱</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.subcategoryName} numberOfLines={2}>
                                                {sub.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* 3. Latest Products */}
                        <View style={styles.productsSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Latest in {categoryName}</Text>
                            </View>

                            <View style={styles.productsGrid}>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onPress={() => router.push(`/product/${product._id}`)}
                                        />
                                    ))
                                ) : (
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyText}>No products found</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </>
                )}
                <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: '#F9FAFB' }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6F00',
    },
    contentContainer: {
        backgroundColor: '#F9FAFB',
        flex: 1,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    subcategoriesSection: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    subcategoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    subcategoryItem: {
        width: (width - 32) / 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    subcategoryIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    subcategoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    subcategoryName: {
        fontSize: 12,
        color: '#374151',
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: 2,
    },
    productsSection: {
        marginTop: 8,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    emptyState: {
        width: '100%',
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },

    // Custom Banner Styles
    bannersContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    topBannersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    halfBanner: {
        width: (width - 44) / 2,
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    halfBannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    halfBannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    halfBannerTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    fullBanner: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 12,
    },
    fullBannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    epicDealsOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    epicDealsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    epicDealsSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 12,
    },
    sponsorsRow: {
        alignItems: 'center',
    },
    sponsorText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 6,
    },
    sponsorLogos: {
        flexDirection: 'row',
        gap: 12,
    },
    sponsorLogo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
    },
    iphoneOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iphoneTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    iphonePrice: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    iphoneSubtext: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
    },
    wishlistButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    wishlistButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    iphoneOffer: {
        fontSize: 12,
        color: '#FFFFFF',
    },

    // Buy Before Sale Section Styles
    buyBeforeSaleSection: {
        marginBottom: 16,
        paddingLeft: 16,
    },
    buyBeforeSaleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    buyBeforeSaleScroll: {
        paddingRight: 16,
    },
    festivePriceCard: {
        width: 320,
        height: 380,
        borderRadius: 16,
        marginRight: 12,
        overflow: 'hidden',
        backgroundColor: '#C8E6C9',
        position: 'relative',
    },
    festivePriceHeader: {
        padding: 16,
        paddingBottom: 12,
    },
    festivePriceHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        textAlign: 'center',
    },
    festivePriceContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    festivePriceImage: {
        width: 140,
        height: 200,
        resizeMode: 'contain',
    },
    festivePriceInfo: {
        flex: 1,
        paddingLeft: 12,
    },
    festivePriceProductName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1B5E20',
        marginBottom: 8,
    },
    festivePriceAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginBottom: 8,
    },
    festivePriceSubtext: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
    },
    festivePriceBrand: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    festivePriceBrandText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B5E20',
    },
    lowestPriceCard: {
        width: 380,
        borderRadius: 16,
        marginRight: 12,
        overflow: 'hidden',
        backgroundColor: '#FFF3E0',
    },
    lowestPriceHeader: {
        padding: 16,
        paddingBottom: 12,
        alignItems: 'center',
    },
    lowestPriceHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    lowestPriceWishlist: {
        fontSize: 14,
        color: '#111827',
    },
    lowestPriceProducts: {
        flexDirection: 'row',
        padding: 12,
        gap: 12,
    },
    lowestPriceProduct: {
        flex: 1,
        backgroundColor: '#FFEAA7',
        borderRadius: 12,
        padding: 12,
        position: 'relative',
    },
    lowestPriceProductTitle: {
        fontSize: 12,
        color: '#111827',
        marginBottom: 4,
    },
    lowestPriceProductPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    lowestPriceProductImage: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    lowestPriceProductBadge: {
        backgroundColor: '#000000',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
    },
    lowestPriceProductBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    lowestPriceProductSpec: {
        color: '#FFFFFF',
        fontSize: 10,
        marginTop: 2,
    },
});
