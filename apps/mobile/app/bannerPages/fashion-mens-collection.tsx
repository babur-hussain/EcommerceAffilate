import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BG_COLOR = '#FFFFFF';
const DARK_COLOR = '#1A1F24';

export default function MenFashionCollectionPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Minimal Header */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color={DARK_COLOR} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>ELEGANCE</Text>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="search" size={24} color={DARK_COLOR} /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="cart" size={24} color={DARK_COLOR} /></TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Watermark */}
                <View style={styles.watermarkContainer}>
                    <Text style={styles.watermarkText}>MEN</Text>
                    <Text style={styles.watermarkText}>MEN</Text>
                </View>

                {/* Hero Banner */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1000' }} style={styles.heroImg} />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroSub}>NEW ARRIVALS</Text>
                        <Text style={styles.heroTitle}>URBAN{'\n'}ESSENTIALS</Text>
                        <TouchableOpacity style={styles.heroBtn}>
                            <Text style={styles.heroBtnText}>SHOP NOW</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Trending Now */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>TRENDING NOW</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
                    <TrendingItem title="Classic Shirts" img="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&q=80&w=300" />
                    <TrendingItem title="Denim Jackets" img="https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=300" />
                    <TrendingItem title="Accessories" img="https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=300" />
                </ScrollView>

                {/* Collection Grid */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>THE COLLECTION</Text>
                </View>
                <View style={styles.grid}>
                    <ProductCard title="Slim Fit Chinos" price="$49" img="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=400" />
                    <ProductCard title="Oxford Shoes" price="$120" img="https://images.unsplash.com/photo-1614252235316-f316279fcc43?auto=format&fit=crop&q=80&w=400" />
                    <ProductCard title="Wool Blend Coat" price="$199" img="https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=400" />
                    <ProductCard title="Linen Shirt" price="$35" img="https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=400" />
                </View>
            </ScrollView>
        </View>
    );
}

const TrendingItem = ({ title, img }: any) => (
    <View style={styles.trendingItem}>
        <Image source={{ uri: img }} style={styles.trendingImg} />
        <View style={styles.trendingOverlay}>
            <Text style={styles.trendingTitle}>{title}</Text>
        </View>
    </View>
);

const ProductCard = ({ title, price, img }: any) => (
    <View style={styles.productCard}>
        <View style={styles.productImgBox}>
            <Image source={{ uri: img }} style={styles.productImg} />
        </View>
        <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{title}</Text>
            <Text style={styles.productPrice}>{price}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_COLOR },
    navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 24, paddingTop: 50, paddingBottom: 16, zIndex: 10 },
    iconBtn: { padding: 4 },
    navTitle: { fontSize: 20, fontWeight: '900', color: DARK_COLOR, letterSpacing: -1 },
    navActions: { flexDirection: 'row', gap: 12 },
    
    watermarkContainer: { position: 'absolute', top: 50, left: 40, zIndex: 0 },
    watermarkText: { fontSize: 120, fontWeight: '900', color: '#F3F4F6', letterSpacing: -5, lineHeight: 100 },

    heroContainer: { marginHorizontal: 24, marginTop: 40, height: 400, borderRadius: 24, overflow: 'hidden', zIndex: 1 },
    heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: 'rgba(0,0,0,0.3)' },
    heroSub: { color: '#FFF', fontSize: 14, letterSpacing: 4, marginBottom: 8 },
    heroTitle: { color: '#FFF', fontSize: 40, fontWeight: '900', lineHeight: 42, marginBottom: 16 },
    heroBtn: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 },
    heroBtnText: { color: DARK_COLOR, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },

    sectionHeader: { paddingHorizontal: 24, marginTop: 40, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: DARK_COLOR, letterSpacing: 2 },

    trendingRow: { paddingHorizontal: 24, gap: 16 },
    trendingItem: { width: 120, height: 160, borderRadius: 16, overflow: 'hidden', marginRight: 16 },
    trendingImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    trendingOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.4)' },
    trendingTitle: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, justifyContent: 'space-between', gap: 16 },
    productCard: { width: (width - 64) / 2, marginBottom: 24 },
    productImgBox: { width: '100%', height: 220, backgroundColor: '#F3F4F6', borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
    productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    productInfo: { alignItems: 'flex-start' },
    productTitle: { fontSize: 14, color: '#666', marginBottom: 4 },
    productPrice: { fontSize: 16, fontWeight: 'bold', color: DARK_COLOR }
});
