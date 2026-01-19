import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SectionProps } from '../../SectionRenderer';
import { Ionicons } from '@expo/vector-icons';
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


// Shared Header
const SectionHeader = ({ title, actionUrl, router }: { title: string, actionUrl?: string, router: any }) => (
    <TouchableOpacity onPress={() => actionUrl && router.push(normalizeUrl(actionUrl) as any)}>
        <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {actionUrl && <Text style={styles.seeAllText}>See All ›</Text>}
        </View>
    </TouchableOpacity>
);

// 1. Home Subcategories (2 Rows, Circular Icons)
export const HomeSubcategories = ({ data }: SectionProps) => {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>(data?.items || []);

    useEffect(() => {
        if (data?.dataSource) {
            const fetchData = async () => {
                try {
                    const res = await api.get(data.dataSource.endpoint);
                    if (Array.isArray(res.data)) setCategories(res.data);
                } catch (e) {
                    console.log('Home subcats fetch error', e);
                }
            };
            fetchData();
        }
    }, [data]);

    if (!categories.length) return null;

    const chunked = [];
    for (let i = 0; i < categories.length; i += 2) {
        chunked.push(categories.slice(i, i + 2));
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
                                            <Text style={{ fontSize: 20 }}>🏠</Text>
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

// 2. Kitchen Bestsellers (Generic Horizontal Card List)
export const HomeKitchenBestsellers = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.customSection}>
            <SectionHeader title={data.title || 'Kitchen Bestsellers'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalSectionList}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.horizontalCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <Image source={{ uri: item.image }} style={styles.horizontalCardImage} />
                        <Text style={styles.horizontalCardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.horizontalCardPrice}>{item.price}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 3. Home Decor Trends (Same layout as Kitchen, can reuse or separate if logic differs later)
export const HomeDecorTrends = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.customSection}>
            <SectionHeader title={data.title || 'Home Decor Trends'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalSectionList}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.horizontalCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <Image source={{ uri: item.image }} style={styles.horizontalCardImage} />
                        <Text style={styles.horizontalCardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.horizontalCardPrice}>{item.price}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 4. Furnishing Deals (Same layout)
export const HomeFurnishingDeals = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.customSection}>
            <SectionHeader title={data.title || 'Furnishing Deals'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalSectionList}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.horizontalCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <Image source={{ uri: item.image }} style={styles.horizontalCardImage} />
                        <Text style={styles.horizontalCardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.horizontalCardPrice}>{item.price}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 5. Product Grid (Home Specific if needed, or reuse generic)
export const HomeProductGrid = ({ data }: SectionProps) => {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const endpoint = data?.dataSource?.endpoint || '/api/products';
                const params = data?.dataSource?.params || { category: 'Home & Kitchen', limit: 10 };
                const res = await api.get(endpoint, { params });
                const list = Array.isArray(res.data) ? res.data : (res.data.products || []);
                setProducts(list);
            } catch (e) {
                console.error("Home grid fetch error", e);
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
                    <Text style={styles.sectionTitle2}>{data.title || 'Latest in Home & Kitchen'}</Text>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No products found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.productsSection}>
            <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
                <Text style={styles.sectionTitle2}>{data.title || 'Latest in Home & Kitchen'}</Text>
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
    subcategoriesSection: { paddingVertical: 12, backgroundColor: '#FFFFFF' },
    horizontalScrollContent: { paddingHorizontal: 12 },
    columnWrapper: { flexDirection: 'column', marginRight: 8 },
    subcategoryItem: { width: 90, alignItems: 'center', marginBottom: 12 },
    subcategoryIconContainer: { width: 70, height: 70, borderRadius: 35, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 6, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    subcategoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    subcategoryName: { fontSize: 11, color: '#374151', textAlign: 'center', fontWeight: '500', paddingHorizontal: 2 },

    customSection: { marginTop: 16, backgroundColor: '#fff', paddingVertical: 16 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    seeAllText: { color: '#3B82F6', fontSize: 14, fontWeight: '600' },
    horizontalSectionList: { paddingHorizontal: 16 },
    horizontalCard: { width: 140, marginRight: 12 },
    horizontalCardImage: { width: 140, height: 140, borderRadius: 8, backgroundColor: '#f3f4f6', marginBottom: 8 },
    horizontalCardTitle: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
    horizontalCardPrice: { fontSize: 12, fontWeight: 'bold', color: '#16a34a' },

    productsSection: { marginTop: 8 },
    sectionHeader: { paddingHorizontal: 16, marginBottom: 16 },
    sectionTitle2: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 20 },
    emptyState: { width: '100%', padding: 40, alignItems: 'center' },
    emptyText: { color: '#666', fontSize: 16 },
});
