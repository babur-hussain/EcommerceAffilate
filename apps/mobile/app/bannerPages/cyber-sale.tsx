import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CYBER_BLUE = '#3478C2';
const CYBER_PINK = '#FF528F';
const PRIMARY_YELLOW = '#FFD646';

export default function CyberSalePage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header / Nav Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Cyber Sale</Text>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navIcon}><Ionicons name="search" size={24} color="#FFF" /></TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}><Ionicons name="cart" size={24} color="#FFF" /></TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Banner Area */}
                <View style={styles.bannerArea}>
                    <Text style={styles.specialOffer}>SPECIAL OFFER</Text>
                    <Text style={styles.cyberText}>CYBER</Text>
                    <View style={styles.mondayBox}>
                        <Text style={styles.mondayText}>MONDAY</Text>
                    </View>
                    <View style={styles.discountPill}>
                        <Text style={styles.discountText}>UP TO 70% OFF</Text>
                    </View>
                    <TouchableOpacity style={styles.shopNowBtn}>
                        <Text style={styles.shopNowText}>SHOP NOW</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Container (overlaps banner) */}
                <View style={styles.contentContainer}>
                    {/* Categories */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>CATEGORIES</Text>
                        <Text style={styles.swipeText}>SWIPE FOR MORE</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
                        <CategoryItem icon="desktop-outline" name="Tech" color={CYBER_BLUE} />
                        <CategoryItem icon="shirt-outline" name="Style" color={CYBER_PINK} />
                        <CategoryItem icon="game-controller-outline" name="Gaming" color="#4CAF50" />
                        <CategoryItem icon="walk-outline" name="Active" color="#9C27B0" />
                        <CategoryItem icon="home-outline" name="Home" color="#00BCD4" />
                    </ScrollView>

                    {/* Flash Deals */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: '#000' }]}><Ionicons name="flash" size={20} color={CYBER_PINK}/> FLASH DEALS</Text>
                        <View style={styles.timerBadge}>
                            <Text style={styles.timerText}>02:45:12</Text>
                        </View>
                    </View>
                    
                    <View style={styles.dealsGrid}>
                        <FlashDealCard title="Ultra Bass Headphones" price="$89" oldPrice="$149" discount="-40%" img="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" />
                        <FlashDealCard title="Cyber Smart Watch" price="$45" oldPrice="$150" discount="-70%" img="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80" />
                        <FlashDealCard title="Gamer Keyboard RGB" price="$120" oldPrice="$160" discount="-25%" img="https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" />
                        <FlashDealCard title="Wireless Gamepad" price="$29" oldPrice="$59" discount="-50%" img="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&q=80" />
                    </View>

                    {/* Secret Deals Banner */}
                    <View style={styles.secretBanner}>
                        <View>
                            <Text style={styles.secretTitle}>UNLOCK{'\n'}SECRET DEALS</Text>
                            <Text style={styles.secretSub}>Limited to first 500 customers</Text>
                            <View style={styles.codePill}><Text style={styles.codeText}>ENTER CODE: CYBER500</Text></View>
                        </View>
                        <Ionicons name="star" size={48} color={PRIMARY_YELLOW} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const CategoryItem = ({ icon, name, color }: { icon: any, name: string, color: string }) => (
    <View style={styles.categoryItem}>
        <View style={styles.categoryIconBox}>
            <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={styles.categoryName}>{name}</Text>
    </View>
);

const FlashDealCard = ({ title, price, oldPrice, discount, img }: any) => (
    <View style={styles.dealCard}>
        <View style={styles.dealImgBox}>
            <Image source={{ uri: img }} style={styles.dealImg} />
            <View style={styles.discountBadge}><Text style={styles.discountBadgeText}>{discount}</Text></View>
        </View>
        <View style={styles.dealInfo}>
            <Text style={styles.dealTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.oldPrice}>{oldPrice}</Text>
            </View>
            <TouchableOpacity style={styles.buyBtn}><Text style={styles.buyBtnText}>BUY NOW</Text></TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: CYBER_BLUE, paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
    backButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
    navTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    navActions: { flexDirection: 'row', gap: 8 },
    navIcon: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
    
    bannerArea: { backgroundColor: CYBER_BLUE, height: 420, alignItems: 'center', paddingTop: 40 },
    specialOffer: { color: '#FFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
    cyberText: { color: '#FFF', fontSize: 64, fontWeight: '900', fontStyle: 'italic' },
    mondayBox: { borderWidth: 2, borderColor: '#FFF', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
    mondayText: { color: '#FFF', fontSize: 48, fontWeight: '900', fontStyle: 'italic' },
    discountPill: { backgroundColor: CYBER_PINK, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, transform: [{ rotate: '-2deg' }], marginBottom: 24, borderWidth: 2, borderColor: '#FFF' },
    discountText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
    shopNowBtn: { backgroundColor: PRIMARY_YELLOW, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30, elevation: 4 },
    shopNowText: { color: '#000', fontSize: 16, fontWeight: '900' },

    contentContainer: { backgroundColor: '#F3F4F6', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, padding: 16, paddingTop: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: CYBER_BLUE },
    swipeText: { fontSize: 10, fontWeight: 'bold', color: '#666' },
    
    categoriesRow: { paddingHorizontal: 8, gap: 20 },
    categoryItem: { alignItems: 'center', gap: 8, marginRight: 20 },
    categoryIconBox: { width: 64, height: 64, backgroundColor: '#FFF', borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1, borderColor: '#EEE' },
    categoryName: { fontSize: 12, fontWeight: 'bold', marginTop: 8 },

    timerBadge: { backgroundColor: '#000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    timerText: { color: '#FFF', fontSize: 12, fontFamily: 'monospace' },

    dealsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
    dealCard: { width: (width - 48) / 2, backgroundColor: '#FFF', borderRadius: 24, padding: 8, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, marginBottom: 16 },
    dealImgBox: { width: '100%', height: 120, backgroundColor: '#F3F4F6', borderRadius: 16, overflow: 'hidden' },
    dealImg: { width: '100%', height: '100%', resizeMode: 'contain' },
    discountBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: CYBER_PINK, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, transform: [{ rotate: '-5deg' }] },
    discountBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    dealInfo: { padding: 8, gap: 8 },
    dealTitle: { fontSize: 14, fontWeight: 'bold', color: '#000' },
    priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
    price: { fontSize: 18, fontWeight: '900', color: '#000' },
    oldPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' },
    buyBtn: { backgroundColor: PRIMARY_YELLOW, paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginTop: 4 },
    buyBtnText: { fontSize: 14, fontWeight: 'bold', color: '#000' },

    secretBanner: { backgroundColor: '#000', borderRadius: 24, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    secretTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
    secretSub: { color: '#999', fontSize: 12, marginTop: 4 },
    codePill: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
    codeText: { color: '#000', fontSize: 10, fontWeight: 'bold' }
});
