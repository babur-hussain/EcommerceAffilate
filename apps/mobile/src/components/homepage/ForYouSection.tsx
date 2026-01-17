import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../lib/api';
import HeroBanner from './HeroBanner';
import ProductCard from './ProductCard';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

interface ForYouSectionProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

import { useAuth } from '../../context/AuthContext';
import RecentHistorySection from './RecentHistorySection';
import GrocerySection from './GrocerySection';
import TrendingNearYou from './foryou/TrendingNearYou';
import CuratedCollections from './foryou/CuratedCollections';
import LightningDeals from './foryou/LightningDeals';
import GrandKitchenSale from './foryou/GrandKitchenSale';
import FiftyPercentOffZone from './foryou/FiftyPercentOffZone';

// TODO: Replace this with the actual Grocery Category ID from your database
const GROCERY_CATEGORY_ID = '696686d02c5aacc146652e03';

export default function ForYouSection({ staticHeader, renderStickyHeader }: ForYouSectionProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Scroll tracking
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await api.get('/api/products?limit=6');
            const products = Array.isArray(response.data) ? response.data : (response.data.products || []);
            setFeaturedProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchFeaturedProducts();
    };

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        if (headerHeight > 0) {
            // Check if we passed the static header
            // Adding a small buffer (e.g., 10px) to prevent flickering near the edge
            setIsSticky(scrollY > headerHeight - 10);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
            }
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
                <HeroBanner />

                {/* User's Recent History Section */}
                <RecentHistorySection userName={user?.name ? user.name.split(' ')[0] : 'User'} />

                {/* Popular Grocery Section */}
                <GrocerySection categoryId={GROCERY_CATEGORY_ID} />

                {/* Trending Near You Section */}
                <TrendingNearYou />

                {/* Curated Collections (Style, Intimacy, Travel) */}
                <CuratedCollections />

                {/* Lightning Deals Section */}
                <LightningDeals />

                {/* Grand Kitchen Sale */}
                <GrandKitchenSale />

                {/* 50% Off Zone */}
                <FiftyPercentOffZone />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Products</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading products...</Text>
                    </View>
                ) : (
                    <View style={styles.productsGrid}>
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onPress={() => router.push(`/product/${product._id}`)}
                            />
                        ))}
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    seeAll: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
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
});
