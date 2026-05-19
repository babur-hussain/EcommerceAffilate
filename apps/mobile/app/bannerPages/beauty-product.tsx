import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BG_COLOR = '#F9FAFB';

export default function BeautyProductPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header / Nav Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Beauty & Perfume</Text>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navIcon}><Ionicons name="search" size={24} color="#000" /></TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}><Ionicons name="cart" size={24} color="#000" /></TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Luminous Header Area */}
                <View style={styles.bannerContainer}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=1000' }} style={styles.bannerImg} />
                    <View style={styles.bannerOverlay}>
                        <View style={styles.glassPanel}>
                            <Text style={styles.luminousText}>LUMINOUS</Text>
                            <Text style={styles.beautyText}>BEAUTY & PERFUME</Text>
                            <Text style={styles.discoverText}>Discover your signature scent and flawless look.</Text>
                            <TouchableOpacity style={styles.shopNowBtn}>
                                <Text style={styles.shopNowText}>EXPLORE COLLECTION</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Top Picks / Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Curated For You</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
                    <CategoryItem title="Premium Pick" img="https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=200" />
                    <CategoryItem title="Luxe Lane" img="https://images.unsplash.com/photo-1571781537222-47330b51a00c?auto=format&fit=crop&q=80&w=200" />
                    <CategoryItem title="Editor's Pick" img="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200" />
                </ScrollView>

                {/* Promo Banner */}
                <View style={styles.promoBanner}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1580870059955-fc549ee1cd01?auto=format&fit=crop&q=80&w=800' }} style={styles.promoImg} />
                    <View style={styles.promoOverlay}>
                        <Text style={styles.promoTitle}>GLAMOUR{'\n'}WEEK</Text>
                        <Text style={styles.promoSub}>Up to 40% Off on Top Brands</Text>
                    </View>
                </View>

                {/* Grid */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Trending Beauty</Text>
                </View>
                <View style={styles.grid}>
                    <ProductCard title="Chanel No. 5" price="$145" img="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=500" />
                    <ProductCard title="Dior Lipstick" price="$42" img="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=500" />
                    <ProductCard title="Estee Lauder Serum" price="$105" img="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=500" />
                    <ProductCard title="Fenty Foundation" price="$39" img="https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=500" />
                </View>
            </ScrollView>
        </View>
    );
}

const CategoryItem = ({ title, img }: any) => (
    <View style={styles.categoryItem}>
        <Image source={{ uri: img }} style={styles.categoryImg} />
        <View style={styles.categoryOverlay}>
            <Text style={styles.categoryTitle}>{title}</Text>
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
    navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    backButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    navTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
    navActions: { flexDirection: 'row', gap: 8 },
    navIcon: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    
    bannerContainer: { height: 400, position: 'relative' },
    bannerImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    bannerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, alignItems: 'center' },
    glassPanel: { backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: 24, borderRadius: 24, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    luminousText: { fontSize: 32, fontWeight: '900', letterSpacing: 8, color: '#1A1A1A', marginBottom: 4 },
    beautyText: { fontSize: 14, fontWeight: 'bold', letterSpacing: 4, color: '#666', marginBottom: 12 },
    discoverText: { fontSize: 14, color: '#444', textAlign: 'center', marginBottom: 20, paddingHorizontal: 16 },
    shopNowBtn: { backgroundColor: '#1A1A1A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 },
    shopNowText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },

    sectionHeader: { paddingHorizontal: 16, marginTop: 24, marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', letterSpacing: 0.5 },

    categoriesRow: { paddingHorizontal: 16, gap: 16 },
    categoryItem: { width: 140, height: 180, borderRadius: 16, overflow: 'hidden', marginRight: 16 },
    categoryImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    categoryOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
    categoryTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

    promoBanner: { margin: 16, height: 150, borderRadius: 16, overflow: 'hidden' },
    promoImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    promoOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, padding: 24, justifyContent: 'center' },
    promoTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
    promoSub: { color: '#FFF', fontSize: 12, marginTop: 8, fontWeight: 'bold' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', gap: 16 },
    productCard: { width: (width - 48) / 2, backgroundColor: '#FFF', borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, marginBottom: 16 },
    productImgBox: { width: '100%', height: 160, backgroundColor: '#F3F4F6', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' },
    productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    productInfo: { padding: 12, alignItems: 'center' },
    productTitle: { fontSize: 14, color: '#333', marginBottom: 4, textAlign: 'center' },
    productPrice: { fontSize: 16, fontWeight: 'bold', color: '#000' }
});
