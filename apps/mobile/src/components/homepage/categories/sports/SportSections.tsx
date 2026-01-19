import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { SectionProps } from '../../SectionRenderer';
import { FontAwesome } from '@expo/vector-icons';
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

// 1. Sport Subcategories (2 Rows, Rounded Squares)
export const SportSubcategories = ({ data }: SectionProps) => {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>(data?.items || []);

    useEffect(() => {
        if (data?.dataSource) {
            const fetchData = async () => {
                try {
                    const res = await api.get(data.dataSource.endpoint);
                    if (Array.isArray(res.data)) setCategories(res.data);
                } catch (e) { console.log('Sport subcats error', e); }
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
                                        <View style={[styles.subcategoryImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 20 }}>⚽</Text></View>
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

// 2. Cricket Season Kick Off
export const SportCricketSeason = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (items.length < 3) return null;

    const mainCard = items[0]; // Large Gradient Card
    const card2 = items[1];    // Blue Card 1
    const card3 = items[2];    // Blue Card 2

    return (
        <View style={styles.cricketSection}>
            <SectionHeader title={data.title || 'Cricket season kick off'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cricketScrollContent}>
                {/* Main Large Card */}
                <TouchableOpacity style={styles.cricketCardLarge} onPress={() => router.push(normalizeUrl(mainCard.actionUrl) as any)}>
                    <ImageBackground source={{ uri: mainCard.bgImage }} style={styles.cricketCardBackground} imageStyle={{ borderRadius: 16 }}>
                        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={styles.cricketGradientOverlay}>
                            <View style={styles.cricketCardContent}>
                                {mainCard.mainText?.split(' ').map((line: string, i: number) => (
                                    <Text key={i} style={styles.cricketMatchDayText}>{line}</Text>
                                ))}
                                <Text style={styles.cricketEssentialsText}>{mainCard.subText}</Text>
                                <View style={styles.cricketArrowButton}><FontAwesome name="arrow-right" size={16} color="#000" /></View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Secondary Cards */}
                {[card2, card3].map((card: any, idx) => (
                    <TouchableOpacity key={idx} style={styles.cricketCardNormal} onPress={() => router.push(normalizeUrl(card.actionUrl) as any)}>
                        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.cricketCardGradient}>
                            <View style={styles.cricketCardHeader}>
                                <Text style={styles.cricketCardTitle}>{card.title}</Text>
                                <Text style={styles.cricketCardOffer}>{card.offer}</Text>
                            </View>
                            <Image source={{ uri: card.image }} style={styles.cricketCardImage} resizeMode="contain" />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 3. Winner Brands
export const SportWinnerBrands = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.winnerBrandsSection}>
            <SectionHeader title={data.title || 'Winner brands'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.winnerBrandsScroll} snapToInterval={(width * 0.75) + 16} decelerationRate="fast">
                {items.map((item: any, index: number) => (
                    <View key={index} style={styles.winnerCardContainer}>
                        <TouchableOpacity style={styles.winnerCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                            <View style={styles.winnerLogoContainer}>
                                <Text style={[styles.winnerLogoText, { color: item.logoColor }]}>
                                    {item.brand}
                                </Text>
                            </View>
                            <View style={styles.winnerImageContainer}>
                                <Image source={{ uri: item.image }} style={styles.winnerImage} />
                            </View>
                            <Text style={styles.winnerOfferText}>{item.offer}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// 4. Support Your Goals
export const SportSupportGoals = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.supportGoalsSection}>
            <SectionHeader title={data.title || 'Support your goals'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.supportGoalsScroll} snapToInterval={width * 0.75 + 16} decelerationRate="fast">
                {items.map((item: any, idx: number) => (
                    <TouchableOpacity key={idx} style={styles.supportGoalCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <ImageBackground source={{ uri: item.bgImage }} style={styles.supportGoalImage} imageStyle={{ borderRadius: 24 }}>
                            <LinearGradient colors={item.gradient || ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']} style={styles.supportGoalGradient}>
                                <View style={styles.supportGoalContent}>
                                    <View>
                                        {item.titleLines?.map((line: string, i: number) => (
                                            <Text key={i} style={styles.supportGoalTitle}>{line}</Text>
                                        ))}
                                    </View>
                                    <Text style={styles.supportGoalSubtitle}>{item.subtitle}</Text>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 5. Gym Accessories (Grid 2x2)
export const SportGymAccessories = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.accessoriesSection}>
            <SectionHeader title={data.title || 'Gym-approved accessories'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.accessoriesGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.accessoryCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <LinearGradient colors={['#3B82F6', '#172554']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.accessoryGradient}>
                            <Text style={styles.accessoryTitle}>{item.title}</Text>
                            <View style={styles.accessoryLine} />
                            <Image source={{ uri: item.image }} style={styles.accessoryImage} />
                            <Text style={styles.accessoryDiscount}>{item.discount}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 6. Sports Combos (Grid 3 cols)
export const SportCombos = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.combosSection}>
            <SectionHeader title={data.title || 'Sports combos'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.combosGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.comboCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <View style={styles.comboImageContainer}>
                            <Image source={{ uri: item.image }} style={styles.comboImage} />
                        </View>
                        <View style={styles.comboTextContainer}>
                            <Text style={styles.comboTitle}>{item.title}</Text>
                            <Text style={styles.comboDiscount}>{item.discount}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// 7. Score Big Savings
export const SportSavings = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.savingsSection}>
            <SectionHeader title={data.title || 'Score big savings on sports'} actionUrl={data.headerActionUrl} router={router} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savingsScroll} snapToInterval={width * 0.75 + 16} decelerationRate="fast">
                {items.map((item: any, idx: number) => (
                    <TouchableOpacity key={idx} style={styles.savingsCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <ImageBackground source={{ uri: item.bgImage }} style={styles.savingsImage} imageStyle={{ borderRadius: 24 }}>
                            <LinearGradient colors={item.gradient || ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.savingsGradient}>
                                <View style={styles.savingsContent}>
                                    <Text style={styles.savingsTitle}>{item.title}</Text>
                                    <Text style={styles.savingsOffer}>{item.offer}</Text>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// 8. Product Grid
export const SportProductGrid = ({ data }: SectionProps) => {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const endpoint = data?.dataSource?.endpoint || '/api/products';
                const params = data?.dataSource?.params || { category: 'Sports', limit: 10 };
                const res = await api.get(endpoint, { params });
                const list = Array.isArray(res.data) ? res.data : (res.data.products || []);
                setProducts(list);
            } catch (e) {
                console.error("Sport grid fetch error", e);
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
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Latest in Sports</Text>
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
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

    // Subcats
    subcategoriesSection: { paddingVertical: 12 },
    horizontalScrollContent: { paddingHorizontal: 8 },
    columnWrapper: { marginRight: 12, justifyContent: 'flex-start' },
    subcategoryItem: { width: 85, alignItems: 'center', marginBottom: 16 },
    subcategoryIconContainer: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 6, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    subcategoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    subcategoryName: { fontSize: 12, lineHeight: 16, height: 32, color: '#374151', textAlign: 'center', fontWeight: '500' },

    // Cricket
    cricketSection: { marginBottom: 24, marginLeft: 16 },
    cricketScrollContent: { paddingRight: 16 },
    cricketCardLarge: { width: 160, height: 220, marginRight: 12, borderRadius: 16, overflow: 'hidden' },
    cricketCardBackground: { width: '100%', height: '100%' },
    cricketGradientOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 },
    cricketCardContent: { alignItems: 'center' },
    cricketMatchDayText: { color: '#fff', fontSize: 22, fontWeight: '900', fontStyle: 'italic', lineHeight: 24, textAlign: 'center' },
    cricketEssentialsText: { color: '#CCFF00', fontSize: 14, fontWeight: 'bold', fontStyle: 'italic', marginTop: 4, marginBottom: 16 },
    cricketArrowButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    cricketCardNormal: { width: 150, height: 220, marginRight: 12, borderRadius: 16, overflow: 'hidden' },
    cricketCardGradient: { flex: 1, padding: 12, justifyContent: 'space-between' },
    cricketCardHeader: { width: '100%' },
    cricketCardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cricketCardOffer: { color: '#CCFF00', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
    cricketCardImage: { width: '100%', height: 120, marginTop: 8 },

    // Winner
    winnerBrandsSection: { marginBottom: 32, paddingVertical: 8, marginLeft: 16 },
    winnerBrandsScroll: { paddingRight: 16, paddingBottom: 16 },
    winnerCardContainer: { width: width * 0.75, marginRight: 16 },
    winnerCard: { backgroundColor: '#E3F2FD', borderRadius: 24, padding: 24, alignItems: 'center', height: 420, justifyContent: 'space-between' },
    winnerLogoContainer: { height: 50, justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10 },
    winnerLogoText: { fontSize: 30, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 },
    winnerImageContainer: { width: '100%', aspectRatio: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#fff', padding: 10 },
    winnerImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    winnerOfferText: { fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: 0.5, marginBottom: 4 },

    // Support Goals
    supportGoalsSection: { marginBottom: 32, marginLeft: 16 },
    supportGoalsScroll: { paddingRight: 16 },
    supportGoalCard: { width: width * 0.75, height: 400, marginRight: 16, borderRadius: 24, overflow: 'hidden' },
    supportGoalImage: { width: '100%', height: '100%' },
    supportGoalGradient: { flex: 1, padding: 20, justifyContent: 'flex-end' },
    supportGoalContent: { height: '100%', justifyContent: 'space-between', paddingTop: 32 },
    supportGoalTitle: { color: '#fff', fontSize: 36, fontWeight: '900', fontStyle: 'italic', lineHeight: 36, letterSpacing: -1 },
    supportGoalSubtitle: { color: '#CCFF00', fontSize: 16, fontWeight: 'bold', lineHeight: 22 },

    // Accessories
    accessoriesSection: { marginBottom: 40, marginHorizontal: 16 },
    accessoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    accessoryCard: { width: (width - 32 - 12) / 2, height: 220, borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
    accessoryGradient: { flex: 1, padding: 16, position: 'relative' },
    accessoryTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', lineHeight: 22, zIndex: 2 },
    accessoryLine: { position: 'absolute', left: 16, top: 60, bottom: 30, width: 40, borderLeftWidth: 1, borderBottomWidth: 1, borderBottomLeftRadius: 16, borderColor: 'rgba(255,255,255,0.4)', zIndex: 1 },
    accessoryImage: { position: 'absolute', right: -10, top: 50, width: 110, height: 110, resizeMode: 'contain', zIndex: 3 },
    accessoryDiscount: { position: 'absolute', bottom: 12, right: 12, color: '#CCFF00', fontSize: 13, fontWeight: 'bold', zIndex: 4 },

    // Combos
    combosSection: { marginBottom: 32, marginHorizontal: 16 },
    combosGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    comboCard: { width: (width - 32 - 16) / 3, backgroundColor: '#4C7BD3', borderRadius: 12, padding: 5, marginBottom: 12, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
    comboImageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 6, overflow: 'hidden' },
    comboImage: { width: '85%', height: '85%', resizeMode: 'contain' },
    comboTextContainer: { alignItems: 'center', paddingBottom: 4 },
    comboTitle: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginBottom: 2, textAlign: 'center' },
    comboDiscount: { color: '#CCFF00', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },

    // Savings
    savingsSection: { marginBottom: 32, marginLeft: 16 },
    savingsScroll: { paddingRight: 16 },
    savingsCard: { width: width * 0.75, height: 400, marginRight: 16, borderRadius: 24, overflow: 'hidden', backgroundColor: '#0F172A' },
    savingsImage: { width: '100%', height: '100%' },
    savingsGradient: { flex: 1, padding: 24, justifyContent: 'space-between' },
    savingsContent: { flex: 1, justifyContent: 'space-between' },
    savingsTitle: { color: '#fff', fontSize: 32, fontWeight: '900', textTransform: 'uppercase', lineHeight: 36 },
    savingsOffer: { color: '#CCFF00', fontSize: 20, fontWeight: 'bold' },
});
