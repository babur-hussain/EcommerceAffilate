import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const BG_COLOR = '#F7F7F7';
const YELLOW_BG = '#FAC024';

export default function SpecialSalePage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('All Items');
    const categories = ['All Items', 'Sneakers', 'Jackets', 'Accessories'];

    // Bounce animation for FAB
    const translateY = useSharedValue(0);
    useEffect(() => {
        translateY.value = withRepeat(withTiming(-10, { duration: 800 }), -1, true);
    }, []);
    const fabAnimStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header / Nav Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Special Deal</Text>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="search" size={24} color="#000" /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="cart" size={24} color="#000" /></TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hero Banner */}
                <View style={styles.heroContainer}>
                    <View style={styles.heroImages}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1555274175-75f4056dfd05?auto=format&fit=crop&q=80&w=400' }} style={styles.heroImgLeft} />
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=400' }} style={styles.heroImgRight} />
                    </View>
                    <View style={styles.heroBox}>
                        <Text style={styles.heroSub}>SPECIAL DEAL</Text>
                        <Text style={styles.heroTitle}>NEW STYLE</Text>
                        <View style={styles.discountPill}>
                            <Text style={styles.discountText}>60% OFF</Text>
                        </View>
                    </View>
                </View>

                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
                    {categories.map((cat) => (
                        <TouchableOpacity 
                            key={cat} 
                            style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                                {cat.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Grid */}
                <View style={styles.grid}>
                    <ProductCard title="Urban Runner Sneakers" price="₹120" mrp="₹200" discount="40" img="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" />
                    <ProductCard title="Streetwear Jacket" price="₹85" mrp="₹150" discount="43" img="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400" />
                    <ProductCard title="Midnight Run Cap" price="₹25" mrp="₹45" discount="44" img="https://images.unsplash.com/photo-1521369909029-2afed882ba54?auto=format&fit=crop&q=80&w=400" />
                    <ProductCard title="Classic High Tops" price="₹90" mrp="₹180" discount="50" img="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=400" />
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <Animated.View style={[styles.fabContainer, fabAnimStyle]}>
                <TouchableOpacity style={styles.fab}>
                    <LinearGradient colors={['#FFD700', '#FDE047']} style={styles.fabGradient}>
                        <MaterialIcons name="percent" size={24} color="#D32F2F" style={{ fontWeight: 'bold' }} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const ProductCard = ({ title, price, mrp, discount, img }: any) => (
    <View style={styles.productCard}>
        <View style={styles.productImgBox}>
            <Image source={{ uri: img }} style={styles.productImg} />
            {discount > 0 && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{discount}% OFF</Text>
                </View>
            )}
        </View>
        <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.mrp}>{mrp}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>ADD TO CART</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_COLOR },
    navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: YELLOW_BG, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16 },
    iconBtn: { padding: 4 },
    navTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    navActions: { flexDirection: 'row', gap: 12 },
    
    heroContainer: { margin: 16, height: 280, backgroundColor: YELLOW_BG, borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    heroImages: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 },
    heroImgLeft: { width: 120, height: 200, resizeMode: 'contain', marginLeft: -30 },
    heroImgRight: { width: 120, height: 200, resizeMode: 'contain', marginRight: -30 },
    heroBox: { backgroundColor: '#FFF', paddingHorizontal: 40, paddingVertical: 30, borderRadius: 12, alignItems: 'center', transform: [{ rotate: '-2deg' }], elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    heroSub: { fontSize: 12, fontWeight: 'bold', letterSpacing: 4, color: '#333', marginBottom: 8 },
    heroTitle: { fontSize: 36, fontWeight: '900', letterSpacing: 2, color: '#000' },
    discountPill: { backgroundColor: '#FA7317', paddingHorizontal: 16, paddingVertical: 8, transform: [{ rotate: '-6deg' }], marginTop: 8 },
    discountText: { color: '#FFF', fontSize: 20, fontWeight: 'bold', fontStyle: 'italic' },

    categoriesRow: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
    categoryBtn: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: '#E6E6E6', marginRight: 12 },
    categoryBtnActive: { backgroundColor: '#000', borderColor: '#000' },
    categoryText: { color: '#000', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
    categoryTextActive: { color: '#FFF' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', gap: 16 },
    productCard: { width: (width - 48) / 2, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F2F2F2', marginBottom: 16 },
    productImgBox: { width: '100%', height: 200, backgroundColor: '#F3F4F6' },
    productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    discountBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'red', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    discountBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    productInfo: { padding: 16, paddingBottom: 8 },
    productTitle: { fontSize: 14, fontWeight: 'bold', color: '#000', marginTop: 4 },
    priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 4 },
    price: { fontSize: 18, fontWeight: '900', color: '#000' },
    mrp: { fontSize: 12, color: '#999', textDecorationLine: 'line-through', marginBottom: 2 },
    addBtn: { borderWidth: 1.5, borderColor: '#000', paddingVertical: 12, alignItems: 'center', marginTop: 16, marginBottom: 8 },
    addBtnText: { color: '#000', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

    fabContainer: { position: 'absolute', bottom: 100, right: 16, zIndex: 50 },
    fab: { width: 48, height: 48, borderRadius: 24, elevation: 10, shadowColor: 'black', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    fabGradient: { flex: 1, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }
});
