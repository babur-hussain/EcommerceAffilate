import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../lib/api';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

interface CategoryDynamicSectionProps {
    categoryName: string;
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function CategoryDynamicSection({ categoryName, staticHeader, renderStickyHeader }: CategoryDynamicSectionProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [posters, setPosters] = useState<string[]>([]);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        fetchCategoryData();
    }, [categoryName]);

    const fetchCategoryData = async () => {
        setLoading(true);
        try {
            // Fetch products
            const productsResponse = await api.get(`/api/products?category=${categoryName}`);
            const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : (productsResponse.data.products || []);
            setProducts(productsData);

            // Fetch info for posters
            const categoriesResponse = await api.get('/api/categories');
            const matchedCategory = categoriesResponse.data.find((c: any) => c.name === categoryName);

            if (matchedCategory && matchedCategory.posters && matchedCategory.posters.length > 0) {
                setPosters(matchedCategory.posters);
            } else {
                setPosters([]);
            }

        } catch (error) {
            console.error('Error fetching category data:', error);
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
            <View style={{ backgroundColor: '#F9FAFB', flex: 1 }}>
                <View>{/* Category Posters/Banners */}
                    {posters.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.posterContainer}>
                            {posters.map((poster, index) => (
                                <Image key={index} source={{ uri: poster }} style={styles.poster} />
                            ))}
                        </ScrollView>
                    ) : (
                        // Fallback banner if no posters
                        <View style={styles.fallbackBanner}>
                            <Text style={styles.fallbackBannerText}>{categoryName}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Latest in {categoryName}</Text>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF6F00" />
                    </View>
                ) : (
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
                                <Text style={styles.emptyText}>No products found in {categoryName}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Bottom overscroll cover */}
                <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: '#F9FAFB' }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6B00',
    },
    posterContainer: {
        marginTop: 12,
        marginBottom: 12,
        paddingLeft: 16,
    },
    poster: {
        width: width - 32,
        height: 150,
        borderRadius: 12,
        marginRight: 12,
        resizeMode: 'cover',
        backgroundColor: '#eee',
    },
    fallbackBanner: {
        height: 100,
        margin: 16,
        borderRadius: 12,
        backgroundColor: '#FFE0B2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackBannerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E65100',
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
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
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
