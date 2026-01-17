// Main shared SectionPage component for Beauty - handles all section types and layouts
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList, Dimensions, Image, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../../../lib/api';
import { Product, SectionConfig, CardProps } from './types';
import {
    StandardCard,
    // Add other cards here as they are created
} from './cards';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface SectionPageProps {
    config: SectionConfig;
}

export default function SectionPage({ config }: SectionPageProps) {
    const router = useRouter();
    const { filters: filterParam } = useLocalSearchParams(); // Get dynamic filters
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [navItems, setNavItems] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();
        // Add dynamic fetch for subcategories if needed (e.g. for K-Beauty Hub)
    }, [config.id, filterParam]); // Re-fetch when filters change

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const endpoint = config.apiEndpoint || '/api/products';

            // Merge static config filters with dynamic URL filters
            let queryParams: any = {
                category: 'Beauty', // Default to Beauty
                limit: 20,
                ...config.filters
            };

            if (filterParam && typeof filterParam === 'string') {
                try {
                    const parsedFilters = JSON.parse(filterParam);
                    queryParams = { ...queryParams, ...parsedFilters };
                } catch (e) {
                    console.log('Error parsing filters:', e);
                }
            }

            const response = await api.get(endpoint, { params: queryParams });
            const data = Array.isArray(response.data) ? response.data : (response.data.products || []);

            // Enhance data with mock fields for display if missing
            const enhancedData = data.map((p: any) => ({
                ...p,
                originalPrice: p.originalPrice || Math.floor(p.price * 1.2),
                discount: p.discount || Math.floor(Math.random() * 20) + 10,
                brand: p.brand || 'Premium Beauty',
                rating: p.rating || 4.5,
                reviewCount: p.reviewCount || 50 + Math.floor(Math.random() * 100),
            }));

            setProducts(enhancedData);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductPress = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    const renderCard = (item: Product, index: number) => {
        const cardProps: CardProps = {
            product: item,
            theme: config.theme,
            onPress: () => handleProductPress(item._id),
            index,
        };

        switch (config.variant) {
            // Add cases for specific beauty cards here
            default: return <StandardCard {...cardProps} />;
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {config.bannerImage && (
                <View style={styles.bannerContainer}>
                    <Image source={{ uri: config.bannerImage }} style={styles.bannerImage} />
                    <View style={styles.bannerOverlay} />
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>{config.title}</Text>
                        <Text style={styles.bannerSubtitle}>{config.subtitle}</Text>
                    </View>
                </View>
            )}

            {!config.bannerImage && (
                <View style={[styles.simpleHeader, { backgroundColor: config.theme.backgroundColor }]}>
                    <Text style={[styles.pageTitle, { color: config.theme.headerTextColor }]}>
                        {config.title}
                    </Text>
                    <Text style={[styles.subtitle, { color: config.theme.subtitleColor }]}>
                        {config.subtitle}
                    </Text>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: config.theme.backgroundColor }]}>
                <ActivityIndicator size="large" color={config.theme.accentColor || "#FF6F00"} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: config.theme.backgroundColor }]}>
            <StatusBar
                barStyle={
                    config.theme.backgroundColor === '#000' ||
                        config.theme.backgroundColor === '#1C1917'
                        ? 'light-content'
                        : 'dark-content'
                }
                backgroundColor={config.theme.backgroundColor}
            />

            {/* List Layout */}
            {config.layout === 'list' && (
                <FlatList
                    data={products}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => (
                        <View style={styles.listItemContainer}>
                            {renderCard(item, index)}
                        </View>
                    )}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Grid Layout (Standard) */}
            {config.layout === 'grid' && (
                <FlatList
                    data={products}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => renderCard(item, index)}
                    keyExtractor={item => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Custom Hub Layout (e.g. for K-Beauty landing) */}
            {/* Can be added similarly to 'kids-hub' in fashion if needed */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        marginBottom: 16,
    },
    simpleHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    // Banner Styles
    bannerContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
        justifyContent: 'flex-end',
        padding: 16,
    },
    bannerImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bannerTextContainer: {
        zIndex: 1,
    },
    bannerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    bannerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    // Grid Styles
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    // List Styles
    listItemContainer: {
        marginBottom: 16,
        alignItems: 'center', // Center cards in list view
    },
});
