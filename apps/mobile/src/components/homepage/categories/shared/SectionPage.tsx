// Main shared SectionPage component - handles all section types and layouts
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList, Dimensions, Image, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../../lib/api';
import { Product, SectionConfig, CardProps } from './types';
import {
    StandardCard,
    DealBadgeCard,
    FestiveCard,
    BudgetOverlayCard,
    WinterCard,
    ForecastCard,
    WinterClearanceCard,
    ShoeFestCard,
} from './cards';

const { width } = Dimensions.get('window');

interface SectionPageProps {
    config: SectionConfig;
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SectionPage({ config }: SectionPageProps) {
    const router = useRouter();
    const { filters: filterParam } = useLocalSearchParams(); // Get dynamic filters
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [navItems, setNavItems] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();

        // Dynamic fetch for Kids subcategories
        if (config.id === 'kids') {
            fetchSubcategories();
        }
    }, [config.id, filterParam]); // Re-fetch when filters change

    const fetchSubcategories = async () => {
        try {
            // Using query param ?parentCategory=ID to fetch children
            const response = await api.get('/api/categories', {
                params: { parentCategory: '6968f0e29424899fc3d9cc54' }
            });

            if (response.data && Array.isArray(response.data)) {
                // Sort by order field if available, or name
                const sorted = response.data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

                const items = sorted.map((sub: any) => ({
                    id: sub._id,
                    label: sub.name,
                    image: sub.image || 'https://loremflickr.com/200/200/fashion', // Fallback
                }));
                setNavItems(items);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const endpoint = config.apiEndpoint || '/api/products';

            // Merge static config filters with dynamic URL filters
            let queryParams: any = {
                category: 'Fashion',
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

            // Enhance data with mock fields for display
            const enhancedData = data.map((p: any) => ({
                ...p,
                originalPrice: p.originalPrice || Math.floor(p.price * 1.4),
                discount: p.discount || Math.floor(Math.random() * 30) + 40,
                brand: p.brand || 'Premium Brand',
                rating: p.rating || 4.2,
                reviewCount: p.reviewCount || 120 + Math.floor(Math.random() * 200),
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
            case 'deal-badge': return <DealBadgeCard {...cardProps} />;
            case 'festive': return <FestiveCard {...cardProps} />;
            case 'budget-overlay': return <BudgetOverlayCard {...cardProps} />;
            case 'winter': return <WinterCard {...cardProps} />;
            case 'forecast': return <ForecastCard {...cardProps} />;
            case 'winter-clearance': return <WinterClearanceCard {...cardProps} />;
            case 'shoe-fest': return <ShoeFestCard {...cardProps} />;
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
                <ActivityIndicator size="large" color={config.theme.accentColor || "#FF6B00"} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: config.theme.backgroundColor }]}>
            <StatusBar
                barStyle={
                    config.layout === 'kids-hub' ||
                        config.theme.backgroundColor === '#000' ||
                        config.theme.backgroundColor === '#1C1917'
                        ? 'light-content'
                        : 'dark-content'
                }
                backgroundColor={config.layout === 'kids-hub' ? '#2874F0' : config.theme.backgroundColor}
            />

            {/* ============================================================
               LAYOUT 1: LIST VIEW
               Used for: Early Bird Deals, Deals of the Day
               Description: Single column vertical list with large cards
               ============================================================ */}
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

            {/* ============================================================
               LAYOUT 2: GRID VIEW (Standard)
               Used for: Women, Men, Kids, Sankranti, Winter Collection
               Description: 2-column grid, classic e-commerce look
               ============================================================ */}
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

            {/* ============================================================
               LAYOUT 3: SHOWCASE VIEW
               Used for: Luxe, Fashion Forecast
               Description: Full-width, cinematic cards for premium feel
               ============================================================ */}
            {config.layout === 'showcase' && (
                <FlatList
                    data={products}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => (
                        <View style={styles.showcaseItemContainer}>
                            {renderCard(item, index)}
                        </View>
                    )}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.showcaseContent}
                />
            )}

            {/* ============================================================
               LAYOUT 4: MASONRY VIEW
               Used for: Gen Z Drips
               Description: Staggered "Pinterest-style" grid for trendy look
               ============================================================ */}
            {config.layout === 'masonry' && (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.masonryContent}
                >
                    {renderHeader()}
                    <View style={styles.masonryGrid}>
                        {/* Left Column (Even Indexes) */}
                        <View style={styles.masonryColumn}>
                            {products.filter((_, i) => i % 2 === 0).map((item, index) => (
                                <View key={item._id} style={styles.masonryItem}>
                                    {renderCard(item, index * 2)}
                                </View>
                            ))}
                        </View>
                        {/* Right Column (Odd Indexes) */}
                        <View style={styles.masonryColumn}>
                            {products.filter((_, i) => i % 2 !== 0).map((item, index) => (
                                <View key={item._id} style={styles.masonryItem}>
                                    {renderCard(item, index * 2 + 1)}
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}

            {/* ============================================================
               LAYOUT 5: KIDS HUB / CATEGORY LANDING
               Used for: Kids
               Description: Structured page with circular nav, banners, and subsections
               ============================================================ */}
            {config.layout === 'kids-hub' && config.hubData && (
                <>
                    {/* Custom Header matching screenshot - Sticky */}
                    <View style={[
                        styles.simpleHeader,
                        {
                            backgroundColor: '#2874F0',
                            paddingBottom: 16,
                            paddingTop: insets.top + 12, // Add safe area
                            flexDirection: 'row',
                            alignItems: 'center',
                            zIndex: 10
                        }
                    ]}>
                        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>{config.title}</Text>
                        <View style={{ flex: 1 }} />
                        <Ionicons name="search" size={24} color="#fff" style={{ marginRight: 16 }} />
                        <Ionicons name="cart-outline" size={24} color="#fff" />
                    </View>

                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                        {config.hubData.map((section, sIndex) => {
                            // 1. Circle Nav
                            if (section.type === 'circle-nav' && section.items) {
                                return (
                                    <ScrollView
                                        key={sIndex}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16, backgroundColor: '#fff' }}
                                    >
                                        {(navItems.length > 0 ? navItems : section.items).map((item, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                style={{ alignItems: 'center', marginRight: 16, width: 70 }}
                                                onPress={() => router.push(`/common-category/${item.id}`)}
                                            >
                                                <View style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden', marginBottom: 6, backgroundColor: '#f0f0f0' }}>
                                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                                </View>
                                                <Text style={{ fontSize: 11, textAlign: 'center', color: '#333', fontWeight: '500' }} numberOfLines={2}>
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                );
                            }

                            // 2. Split Banner
                            if (section.type === 'banner' && section.bannerData) {
                                return (
                                    <View key={sIndex} style={{ marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', flexDirection: 'row', height: 180, backgroundColor: '#FCE7F3', marginBottom: 24 }}>
                                        {/* Left Text Side */}
                                        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 4 }}>
                                                {section.bannerData.title}
                                            </Text>
                                            <Text style={{ fontSize: 14, color: '#333', marginBottom: 12 }}>
                                                {section.bannerData.subtitle}
                                            </Text>
                                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#000' }}>
                                                {section.bannerData.priceTag}
                                            </Text>
                                        </View>
                                        {/* Right Image Side */}
                                        <View style={{ width: '50%', height: '100%' }}>
                                            <Image source={{ uri: section.bannerData.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                        </View>
                                    </View>
                                );
                            }

                            // 3. Horizontal Scroll Rows (Shop by Age/Type)
                            if (section.type === 'scroll-row' && section.items) {
                                return (
                                    <View key={sIndex} style={{ marginBottom: 24 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 16, marginBottom: 16 }}>
                                            {section.title}
                                        </Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
                                            {section.items.map((item, i) => (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={{ marginRight: 16, width: 100 }}
                                                    onPress={() => {
                                                        // Handle "Shop by Age" filters
                                                        if (item.id.startsWith('age-group:')) {
                                                            const ageGroup = item.id.replace('age-group:', '');
                                                            // Navigate to our common category page with filters
                                                            router.push({
                                                                pathname: '/common-category/[id]',
                                                                params: {
                                                                    id: 'kids-clothing', // You might want to map this key to a real category ID or handle 'kids-clothing' in category page
                                                                    isFilter: 'true',
                                                                    filters: JSON.stringify({ age: ageGroup })
                                                                }
                                                            });
                                                        } else if (item.id.length === 24) {
                                                            // Handle Live Category IDs (e.g. Shop by Type)
                                                            router.push(`/common-category/${item.id}`);
                                                        }
                                                    }}
                                                >
                                                    <View style={{ width: 100, height: 100, borderRadius: 16, overflow: 'hidden', marginBottom: 8, backgroundColor: '#f0f0f0' }}>
                                                        <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                                    </View>
                                                    <Text style={{ fontSize: 13, color: '#333', textAlign: 'center', fontWeight: '500' }}>
                                                        {item.label}
                                                    </Text>
                                                    {item.price && (
                                                        <Text style={{ fontSize: 13, color: '#000', textAlign: 'center', fontWeight: 'bold' }}>
                                                            {item.price}
                                                        </Text>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                );
                            }

                            // 4. Brand Scroll (Featured Brands)
                            if (section.type === 'brand-scroll' && section.items) {
                                return (
                                    <View key={sIndex} style={{ marginBottom: 24 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 16, marginBottom: 16 }}>
                                            {section.title}
                                        </Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
                                            {section.items.map((item, i) => (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={{ marginRight: 12, width: 130, height: 200, borderRadius: 8, overflow: 'hidden', backgroundColor: '#F3F4F6' }}
                                                    onPress={() => router.push(`/common-category/${item.id}`)}
                                                >
                                                    {/* Brand Logo Header */}
                                                    <View style={{ height: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                                                        {item.logo ? (
                                                            <Image source={{ uri: item.logo }} style={{ width: 80, height: 24, resizeMode: 'contain' }} />
                                                        ) : (
                                                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.label}</Text>
                                                        )}
                                                    </View>
                                                    {/* Lifestyle Image */}
                                                    <Image source={{ uri: item.image }} style={{ flex: 1, width: '100%', resizeMode: 'cover' }} />

                                                    {/* Offer Pill */}
                                                    {item.offer && (
                                                        <View style={{
                                                            position: 'absolute',
                                                            bottom: 12,
                                                            alignSelf: 'center',
                                                            backgroundColor: '#fff',
                                                            paddingHorizontal: 12,
                                                            paddingVertical: 4,
                                                            borderRadius: 12,
                                                            shadowColor: "#000",
                                                            shadowOffset: { width: 0, height: 1 },
                                                            shadowOpacity: 0.1,
                                                            shadowRadius: 2,
                                                            elevation: 2
                                                        }}>
                                                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#111' }}>{item.offer}</Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                );
                            }

                            // 5. Winter Scroll (Winter is coming, Festive, Value packs, Viral)
                            if (section.type === 'winter-scroll' && section.items) {
                                return (
                                    <View key={sIndex} style={{ marginBottom: 24 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 16, marginBottom: 16 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 16 }}>
                                                {section.title}
                                            </Text>


                                        </View>

                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
                                            {section.items.map((item, i) => (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={{ marginRight: 12, width: 150 }}
                                                    onPress={() => router.push(`/common-category/${item.id}`)}
                                                >
                                                    <View style={{
                                                        width: 150,
                                                        height: 200,
                                                        borderRadius: 16,
                                                        overflow: 'hidden',
                                                        marginBottom: 8,
                                                        backgroundColor: '#f0f0f0',
                                                        position: 'relative'
                                                    }}>
                                                        <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />

                                                        {/* Bottom Overlay with curved top */}
                                                        {item.offer && (
                                                            <View style={{
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                left: 0,
                                                                right: 0,
                                                                backgroundColor: item.color || '#B57EDC',
                                                                paddingVertical: 8,
                                                                alignItems: 'center',
                                                                borderTopLeftRadius: 12,
                                                                borderTopRightRadius: 12,
                                                                flexDirection: 'row',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#fff' }}>{item.offer}</Text>
                                                                {/* Decorative dot/sparkle */}
                                                                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)', marginLeft: 6, marginTop: 2 }} />
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Text style={{ fontSize: 14, color: '#111', textAlign: 'center', fontWeight: '500' }}>
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                );
                            }

                            // 6. Curated Scroll (Curated collection for you)
                            if (section.type === 'curated-scroll' && section.items) {
                                return (
                                    <View key={sIndex} style={{ marginBottom: 24 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 16, marginBottom: 16 }}>
                                            {section.title}
                                        </Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
                                            {section.items.map((item, i) => (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={{ marginRight: 16, width: 160 }}
                                                    onPress={() => router.push(`/common-category/${item.id}`)}
                                                >
                                                    <View style={{
                                                        width: 160,
                                                        height: 220,
                                                        borderRadius: 24,
                                                        overflow: 'hidden',
                                                        marginBottom: 8,
                                                        backgroundColor: '#E6F7FF', // Sky blueish tint
                                                        borderWidth: 1,
                                                        borderColor: '#BAE6FD',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 8
                                                    }}>
                                                        <Image source={{ uri: item.image }} style={{ width: '90%', height: '80%', resizeMode: 'contain' }} />

                                                        {/* Bottom Info Overlay */}
                                                        <View style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            backgroundColor: 'rgba(255,255,255,0.7)',
                                                            paddingVertical: 8,
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{ fontSize: 13, color: '#333', textAlign: 'center', fontWeight: '500' }}>{item.label}</Text>
                                                            {item.price && (
                                                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#000' }}>{item.price}</Text>
                                                            )}
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                );
                            }

                            // 7. Bestseller Grid
                            if (section.type === 'bestseller-grid' && section.items) {
                                return (
                                    <View key={sIndex} style={{ marginBottom: 24 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 16, marginBottom: 16 }}>
                                            {section.title}
                                        </Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 }}>
                                            {section.items.map((item, i) => (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={{ width: '33.33%', alignItems: 'center', marginBottom: 20 }}
                                                    onPress={() => router.push(`/common-category/${item.id}`)}
                                                >
                                                    {/* Arch Shape Container */}
                                                    <View style={{
                                                        width: 100,
                                                        height: 120,
                                                        backgroundColor: '#FFF8E1', // Slight yellow tint
                                                        marginBottom: 8,
                                                        overflow: 'hidden',
                                                        // Creating Arch/Cloud shape approximation
                                                        borderTopLeftRadius: 50,
                                                        borderTopRightRadius: 50,
                                                        borderBottomLeftRadius: 0,
                                                        borderBottomRightRadius: 0,
                                                    }}>
                                                        <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                                    </View>

                                                    <Text style={{ fontSize: 12, color: '#333', textAlign: 'center', fontWeight: '500', marginBottom: 2 }}>
                                                        {item.label}
                                                    </Text>
                                                    {item.offer && (
                                                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
                                                            {item.offer}
                                                        </Text>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                );
                            }

                            // 8. Trend List (Trends section)
                            if (section.type === 'trend-list' && section.items) {
                                return (
                                    <View key={sIndex} style={{ marginBottom: 24 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 16, marginBottom: 16 }}>
                                            {section.title}
                                        </Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
                                            {section.items.map((item, i) => (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={{ marginRight: 16, width: 160 }}
                                                    onPress={() => router.push(`/common-category/${item.id}`)}
                                                >
                                                    <View style={{
                                                        width: 160,
                                                        height: 240,
                                                        borderRadius: 16,
                                                        overflow: 'hidden',
                                                        backgroundColor: '#222', // Dark background for gaps
                                                        marginBottom: 8,
                                                        borderWidth: 1,
                                                        borderColor: '#333'
                                                    }}>
                                                        <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />

                                                        {/* Dark Gradient Overlay at Bottom */}
                                                        <View style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: 90,
                                                            backgroundColor: 'rgba(0,0,0,0.85)', // Strong dark overlay
                                                            justifyContent: 'flex-end',
                                                            alignItems: 'center',
                                                            paddingBottom: 12
                                                        }}>
                                                            {/* White Pill Label */}
                                                            <View style={{
                                                                backgroundColor: '#fff',
                                                                paddingHorizontal: 16,
                                                                paddingVertical: 6,
                                                                borderRadius: 20,
                                                                marginBottom: 8,
                                                                minWidth: 100,
                                                                alignItems: 'center'
                                                            }}>
                                                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#000' }}>
                                                                    {item.label}
                                                                </Text>
                                                            </View>

                                                            {/* White Offer Text */}
                                                            {item.offer && (
                                                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>
                                                                    {item.offer}
                                                                </Text>
                                                            )}
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                );
                            }

                            return null;
                        })}
                    </ScrollView>
                </>
            )}
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
    // Showcase Styles
    showcaseContent: {
        paddingBottom: 20,
    },
    showcaseItemContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    // Masonry Styles
    masonryContent: {
        paddingBottom: 20,
    },
    masonryGrid: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    masonryColumn: {
        flex: 1,
    },
    masonryItem: {
        marginBottom: 16,
        alignItems: 'center', // Ensure cards center in their column
    },
});
