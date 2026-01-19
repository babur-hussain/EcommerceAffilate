import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SectionProps } from '../../SectionRenderer';
import { LinearGradient } from 'expo-linear-gradient';
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
const SectionHeader = ({ title, actionUrl, router, color = '#000' }: { title: string, actionUrl?: string, router: any, color?: string }) => (
    <TouchableOpacity onPress={() => actionUrl && router.push(normalizeUrl(actionUrl) as any)}>
        <Text style={[styles.sectionTitle, { color }]}>{title} ›</Text>
    </TouchableOpacity>
);

// 1. Book Subcategories
export const BookSubcategories = ({ data }: SectionProps) => {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>(data?.items || []);

    useEffect(() => {
        if (data?.dataSource) {
            const fetchData = async () => {
                try {
                    const res = await api.get(data.dataSource.endpoint);
                    if (Array.isArray(res.data)) setCategories(res.data);
                } catch (e) { console.log('Book subcats error', e); }
            };
            fetchData();
        }
    }, [data]);

    if (!categories.length) return null;
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
                                        <Image source={{ uri: sub.image || sub.icon }} style={styles.subcategoryImage} />
                                    ) : (
                                        <View style={[styles.subcategoryImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 20 }}>📚</Text></View>
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

// 2. Music Genres
export const BookMusicGenres = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.musicGenresSection}>
            <SectionHeader title={data.title || 'Music genres'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.genreCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <LinearGradient colors={item.gradientColors || ['#FF6BB5', '#FF8FC7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBackground}>
                            <View style={[styles.decorativeCircle, { backgroundColor: item.accentColor, width: 120, height: 120, bottom: 80, right: -30 }]} />
                            <View style={[styles.decorativeCircle, { backgroundColor: item.accentColor, width: 90, height: 90, top: 120, left: -20, opacity: 0.7 }]} />

                            <View style={styles.genreTextContainer}>
                                <Text style={styles.genreName}>{item.name}</Text>
                                <Text style={styles.genreSubtitle}>{item.subtitle}</Text>
                            </View>
                            <Image source={{ uri: item.image }} style={styles.genreImage} />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

// 3. Book Genres
export const BookGenres = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.booksGenresSection}>
            <SectionHeader title={data.title || 'Books genres'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.genreCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <LinearGradient colors={item.gradientColors || ['#FF9940', '#FFB366']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBackground}>
                            <View style={[styles.decorativeCircle, { backgroundColor: item.accentColor, width: 110, height: 110, bottom: 140, right: -25, opacity: 0.8 }]} />
                            <View style={[styles.decorativeCircle, { backgroundColor: item.accentColor, width: 70, height: 70, top: 100, left: -15, opacity: 0.6 }]} />

                            <View style={styles.genreTextContainer}>
                                <Text style={styles.genreName}>{item.name}</Text>
                                <Text style={styles.genreSubtitle}>{item.subtitle}</Text>
                            </View>
                            <Image source={{ uri: item.image }} style={styles.bookGenreImage} />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 4. Superstar Brands
export const BookSuperstarBrands = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.superstarBrandsSection}>
            <SectionHeader title={data.title || 'Superstar brands'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.brandsGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.brandCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <Image source={{ uri: item.logo || item.image }} style={styles.brandLogo} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 5. Authors Best Work
export const BookAuthorsBest = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.authorsBestWorkSection}>
            <SectionHeader title={data.title || 'Authors best work'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.authorsScrollContent}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={[styles.authorCard, { backgroundColor: item.bgColor }]} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <Image source={{ uri: item.image }} style={styles.authorImage} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 6. Budget Carnival
export const BookBudgetCarnival = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.budgetCarnivalSection}>
            <SectionHeader title={data.title || 'Budget carnival'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.budgetGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.budgetCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <Image source={{ uri: item.image }} style={styles.budgetCardImage} />
                        <View style={styles.priceTagContainer}>
                            <View style={[styles.priceTag, { backgroundColor: item.tagColor }]}>
                                <Text style={styles.priceTagText}>{item.priceTag}</Text>
                            </View>
                        </View>
                        <View style={styles.budgetCardFooter}>
                            <Text style={styles.budgetCardName}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 7. Product Grid
export const BookProductGrid = ({ data }: SectionProps) => {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const endpoint = data?.dataSource?.endpoint || '/api/products';
                const params = data?.dataSource?.params || { category: 'Books', limit: 10 };
                const res = await api.get(endpoint, { params });
                const list = Array.isArray(res.data) ? res.data : (res.data.products || []);
                setProducts(list);
            } catch (e) {
                console.error("Book grid fetch error", e);
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
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Latest Books</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 20 }}>
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} onPress={() => router.push(`/product/${product._id}`)} />
                ))}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12 },

    // Subcats
    subcategoriesSection: { paddingVertical: 12 },
    horizontalScrollContent: { paddingHorizontal: 8 },
    columnWrapper: { marginRight: 12, justifyContent: 'flex-start' },
    subcategoryItem: { width: (width - 60) / 4, maxWidth: 85, alignItems: 'center', marginBottom: 16 },
    subcategoryIconContainer: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 6, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    subcategoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    subcategoryName: { fontSize: 12, lineHeight: 16, height: 32, color: '#374151', textAlign: 'center', fontWeight: '500' },

    // Genres
    musicGenresSection: { marginBottom: 24, paddingLeft: 16 },
    booksGenresSection: { marginBottom: 24, paddingLeft: 16 },
    genreScrollContent: { paddingRight: 16 },
    genreCard: { width: 180, height: 260, borderRadius: 16, marginRight: 12, overflow: 'hidden' },
    gradientBackground: { width: '100%', height: '100%', position: 'relative', padding: 16 },
    genreTextContainer: { zIndex: 2 },
    genreName: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    genreSubtitle: { fontSize: 16, fontWeight: '600', color: '#fff', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    genreImage: { position: 'absolute', bottom: 0, right: 0, zIndex: 3, width: 140, height: 180, resizeMode: 'contain' },
    bookGenreImage: { position: 'absolute', bottom: 16, right: 16, zIndex: 3, width: 100, height: 150, resizeMode: 'cover', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
    decorativeCircle: { position: 'absolute', borderRadius: 1000, zIndex: 1 },

    // Brands
    superstarBrandsSection: { marginBottom: 24, paddingHorizontal: 16 },
    brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    brandCard: { width: (width - 48) / 3, aspectRatio: 1, backgroundColor: '#E8EEF7', borderRadius: 16, marginBottom: 12, justifyContent: 'center', alignItems: 'center', padding: 16 },
    brandLogo: { width: '80%', height: '80%', resizeMode: 'contain' },

    // Authors
    authorsBestWorkSection: { marginBottom: 24, paddingLeft: 16 },
    authorsScrollContent: { paddingRight: 16 },
    authorCard: { width: 300, height: 380, borderRadius: 16, marginRight: 12, overflow: 'hidden' },
    authorImage: { width: '100%', height: '100%', resizeMode: 'cover' },

    // Budget
    budgetCarnivalSection: { marginBottom: 24, paddingHorizontal: 16 },
    budgetGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    budgetCard: { width: (width - 44) / 2, height: 200, borderRadius: 16, marginBottom: 12, overflow: 'hidden', position: 'relative', backgroundColor: '#2A2A2A' },
    budgetCardImage: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 },
    priceTagContainer: { position: 'absolute', top: 12, left: 12, zIndex: 2 },
    priceTag: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 16, minWidth: 90, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
    priceTagText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: 'center', lineHeight: 20 },
    budgetCardFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingVertical: 8, paddingHorizontal: 12 },
    budgetCardName: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
