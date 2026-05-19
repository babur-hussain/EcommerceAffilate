import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BRAND_ORANGE = '#F97316';

export default function SportsShoesCollectionPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header / Nav Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Footwear Sale</Text>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navIcon}><Ionicons name="search" size={24} color="#000" /></TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}><Ionicons name="cart" size={24} color="#000" /></TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Banner Area */}
                <View style={styles.bannerContainer}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000' }} style={styles.bannerImg} />
                    <View style={styles.bannerOverlay}>
                        <View style={styles.limitedPill}>
                            <Text style={styles.limitedText}>LIMITED TIME</Text>
                        </View>
                        <Text style={styles.bannerTitle}>SNEAKER{'\n'}DROP</Text>
                        <Text style={styles.bannerSub}>Up to 50% off on premium kicks.</Text>
                    </View>
                </View>

                {/* Hot Drops (Featured) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>HOT DROPS</Text>
                </View>
                <View style={styles.featuredCard}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=500' }} style={styles.featuredImg} />
                    <View style={styles.featuredInfo}>
                        <Text style={styles.featuredTitle}>Pro Speed Runner X</Text>
                        <Text style={styles.featuredCat}>Running · Men</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>$129</Text>
                            <Text style={styles.oldPrice}>$199</Text>
                        </View>
                    </View>
                </View>

                {/* Flash Sale Grid */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>FLASH SALE</Text>
                </View>
                <View style={styles.grid}>
                    <ShoeCard title="Air Max 90" price="$89" oldPrice="$129" img="https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=500" />
                    <ShoeCard title="Jordan 1 High" price="$149" oldPrice="$200" img="https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&q=80&w=500" />
                    <ShoeCard title="Ultraboost 22" price="$110" oldPrice="$180" img="https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=500" />
                    <ShoeCard title="Classic Leather" price="$65" oldPrice="$90" img="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=500" />
                </View>
            </ScrollView>
        </View>
    );
}

const ShoeCard = ({ title, price, oldPrice, img }: any) => (
    <View style={styles.shoeCard}>
        <View style={styles.shoeImgBox}>
            <Image source={{ uri: img }} style={styles.shoeImg} />
            <View style={styles.discountBadge}><Text style={styles.discountBadgeText}>-30%</Text></View>
        </View>
        <View style={styles.shoeInfo}>
            <Text style={styles.shoeTitle}>{title}</Text>
            <View style={styles.priceRowSmall}>
                <Text style={styles.priceSmall}>{price}</Text>
                <Text style={styles.oldPriceSmall}>{oldPrice}</Text>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    backButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    navTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    navActions: { flexDirection: 'row', gap: 8 },
    navIcon: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    
    bannerContainer: { height: 280, margin: 16, borderRadius: 24, overflow: 'hidden', backgroundColor: '#000', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
    bannerImg: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 },
    bannerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, justifyContent: 'flex-end' },
    limitedPill: { backgroundColor: BRAND_ORANGE, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
    limitedText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    bannerTitle: { color: '#FFF', fontSize: 36, fontWeight: '900', lineHeight: 38, marginBottom: 8 },
    bannerSub: { color: '#D1D5DB', fontSize: 14 },

    sectionHeader: { paddingHorizontal: 16, marginTop: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: '#000' },

    featuredCard: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 20, padding: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
    featuredImg: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#F3F4F6' },
    featuredInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    featuredTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    featuredCat: { fontSize: 12, color: '#666', marginTop: 4, marginBottom: 8 },
    priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
    price: { fontSize: 20, fontWeight: '900', color: BRAND_ORANGE },
    oldPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', gap: 16 },
    shoeCard: { width: (width - 48) / 2, backgroundColor: '#FFF', borderRadius: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, marginBottom: 16 },
    shoeImgBox: { width: '100%', height: 140, backgroundColor: '#F3F4F6', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' },
    shoeImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    discountBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'red', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    discountBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    shoeInfo: { padding: 12 },
    shoeTitle: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 4 },
    priceRowSmall: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
    priceSmall: { fontSize: 16, fontWeight: '900', color: BRAND_ORANGE },
    oldPriceSmall: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' }
});
