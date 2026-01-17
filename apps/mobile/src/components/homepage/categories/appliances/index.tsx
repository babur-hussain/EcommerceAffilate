import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
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

interface AppliancesPageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function AppliancesPage({ staticHeader, renderStickyHeader }: AppliancesPageProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const categoryId = '7';
    const categoryName = 'Appliances';

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
                        {/* 1. Banners Slider */}
                        <CategoryBannerSlider banners={banners} />

                        {/* 2. Subcategories Grid */}
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
                                                    <Image
                                                        source={{ uri: sub.image || sub.icon }}
                                                        style={styles.subcategoryImage}
                                                    />
                                                ) : (
                                                    <View style={[styles.subcategoryImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                                                        <Text style={{ fontSize: 20 }}>🧺</Text>
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
});
