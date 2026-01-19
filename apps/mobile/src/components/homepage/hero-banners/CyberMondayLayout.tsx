import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../../lib/api';

const { width } = Dimensions.get('window');

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string; // URL
    parentCategory?: string | null;
    group?: string;
}

/**
 * Cyber Monday Layout (Banner ID: 8)
 * 
 * Implements the "Cyber Monday Flash Sale" design.
 * Features:
 * - Cyberpunk Theme: Vibrant Yellow (#FFD646), Cyber Blue (#3478C2), Pink (#FF528F).
 * - 3D Buttons: Border-bottom styles for depth.
 * - Sticker Effects: Rotated images with borders and shadows.
 * - Bold Typography: Simulated Orbitron/Bangers via system fonts/styles.
 */
export default function CyberMondayLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [subCategories, setSubCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/categories');
                const allCategories = response.data as Category[];
                // Filter: Electronics (ID: 695ff7de3f61939001a0637c) AND Group: Tech
                const filtered = allCategories.filter(c =>
                    c.parentCategory === '695ff7de3f61939001a0637c' && c.group === 'Tech'
                );
                setSubCategories(filtered);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

            {/* Hero Section */}
            <View style={[styles.heroSection, { paddingTop: insets.top + 10 }]}>
                {/* Custom Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { top: insets.top + 10 }]}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                {/* Simulated Halftone Background */}
                <View style={styles.halftoneBg}>
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.1)', 'transparent']}
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>

                {/* Floating Sticker 1 - Top Left */}
                <View style={[styles.sticker, styles.stickerLeft]}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMxshYMr8JAzwDltL6x0IOeuUXLyRX3D0iqnOQFwnumDpzQtrczPhI14tUq53TGrvy4349EfonUt3HbiuDu5ZtaFSP6AelBUm0dbnczgA8lV9EFkKNJLg-Kg8Fgxp4Iy9SsLWKUMT6CGCgiYFidbtlYYrWiNMQjhh-kXDzlrKX6fOJ4ernCkp8CNe89NRXW_UmOQSxhpEcV-ZHwxfHhNhYERGnQXuOKsf-46cQbpY1yE7dxnk4nmMIm0o26-LLq-ZFwPFHRpzRcicS' }}
                        style={styles.stickerImage}
                    />
                </View>

                {/* Floating Sticker 2 - Top Right */}
                <View style={[styles.sticker, styles.stickerRight]}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAakzBYMcihd0rTGWjFIqPVHdHiLxdYM0HvEqLqaau4i1m-02lQ3Jw8b_ihyVZ7sR4j8p1jjiPEqssEIaqmll7YTBIfH-78Y11vPYDmsSZjKWH4xs8sZog31hI5iTzZ2FQeP8-jokq6V3sTi77XRa83AlJ3zpduqnmMoaUtH8j2bPBVKGS-xbzRPONybwbrlqrfFOhPCagRD2oYVtK9fDAwNZhK1yO9m1E1RfEw-Q7OVAsU_Frh1D0PtMPz58JiLmj-fUbnWsdxznyF' }}
                        style={styles.stickerImage}
                    />
                </View>

                {/* Content */}
                <View style={styles.heroContent}>
                    <Text style={styles.specialOfferText}>SPECIAL OFFER</Text>
                    <Text style={styles.cyberText}>CYBER</Text>
                    <View style={styles.mondayBox}>
                        <Text style={styles.mondayText}>MONDAY</Text>
                    </View>

                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>UP TO 70% OFF</Text>
                    </View>

                    <TouchableOpacity style={styles.shopNowBtn} activeOpacity={0.8}>
                        <Text style={styles.shopNowText}>SHOP NOW</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content Area - Rounded Top overlap */}
            <View style={styles.mainWrapper}>

                {/* Categories */}
                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>CATEGORIES</Text>
                        <Text style={styles.swipeHint}>SWIPE FOR MORE</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                        {subCategories.length > 0 ? (
                            subCategories.map((cat, index) => (
                                <CategoryItem
                                    key={cat._id}
                                    label={cat.name}
                                    imageUrl={cat.image || cat.icon}
                                    color={['#3478C2', '#FF528F', '#22c55e', '#f97316', '#a855f7'][index % 5]}
                                />
                            ))
                        ) : (
                            // Fallback / Loading dummy
                            <>
                                <CategoryItem icon="devices" label="Tech" color="#3478C2" />
                            </>
                        )}
                    </ScrollView>
                </View>

                {/* Flash Deals Header */}
                <View style={styles.flashHeader}>
                    <View style={styles.flashTitleRow}>
                        <MaterialIcons name="bolt" size={24} color="#FF528F" />
                        <Text style={styles.flashTitle}>FLASH DEALS</Text>
                    </View>
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>02:45:12</Text>
                    </View>
                </View>

                {/* Product Grid */}
                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBynHwbBIbW9WLBg061p80sdh4VbpRXq63bVsPzAlI5S6ajFsZxBWjB2_EK9JZt8upJmTEvikcxo9UauMLnG99HKHXOqJCfrkYKr3XbMwxoHL1SR56r8b7e7riofe9e9u3vQfXFIAhfDSF94TL2f4Vl7d7QkJIbcX_0C8M3U-HyNP1qwvh2RkT6Yk7w2kTT4mdV_FX65MhowFzN6FFJc5nIGSXxN6NzQttnfniSDtDaxhm_6bVMQ0PQrgsALBuansKWBBZ9WMQ6U-cl"
                        title="Ultra Bass Headphones"
                        price="$89"
                        originalPrice="$149"
                        discount="-40%"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBKyo7oT2qUDEm03WU-n3BlKXSo9C7GFjtwPT1Nzwr4BxtYbRjFz87xQs0X8ZBJRb71qIMNpYkucLB0I10-PmCsQ0OIxh5Qp6Z_3FpVyyjbolxLCkrDxbiCy3zF2EGOkfBkbYiA11w-N9DElIyCPJcUk1FcToOo9X2QYdrOWJAALu8MuD4BzJ5AC-rF0rV1V08-cBeNh82raOpGHnUbm4rK1ee-OqXr5nEoN7HimcbuIkmG5HsIc0P22MMZSY8bDFhZtqgxhK4i4VDW"
                        title="Cyber Smart Watch"
                        price="$45"
                        originalPrice="$150"
                        discount="-70%"
                    />
                </View>

                <View style={[styles.gridRow, { marginTop: 16 }]}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAIyZ8lR0So1in-fb-UdKU9FWNB_HGZnD9pGnM4C8bVmePUJPw2hUfES0kQrBScFh9Ic8K0lGeF4e_AFFVY6JoWvVAZERWSsynejMCALgsXVJd4LhX_dAVYNEkAvqdGv7Vg_56rQdhee_AHFn0F5n91yZanqofaUvbY7pzdkxk1R2fVLZuK4V-wkVgiMzPYoAR7StFWz_W2yYIQQ4C9n5_ei_5l_CIafzUm912gsxbjAi8AUny-xVj2eITwpmIplzlVptvVyrtYqfS4"
                        title="Gamer Keyboard RGB"
                        price="$120"
                        originalPrice="$160"
                        discount="-25%"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIbQ61_Ko2patxpNMwXKf6Uk0I5cSqJbw6k-9amZg1q1VVDUiSDoZda_XHLGI__Rt-_Er43XC5SsojqExgHZjrOKiyYFfJXVe1_aNbCegKx8w0TGCplwIH4h6FpovT3jxO4emg5DMCTQW1YsTwff7F3gyWJP37EQbpBGj_wdzj-VeSCGS0jnXP0pjEeXFA0b8Cyhyf_PXlKNNdfAw7y7XCd98ZUOe5640NrUg4Yvksx6HEoBPNevlGLaf9lM45URQERCbs14bt3_Q"
                        title="Wireless Gamepad"
                        price="$29"
                        originalPrice="$59"
                        discount="-50%"
                    />
                </View>

                {/* Secret Deals Banner */}
                <View style={styles.secretBanner}>
                    <LinearGradient
                        colors={['#0F172A', '#1e293b']}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.secretContent}>
                        <Text style={styles.secretTitle}>UNLOCK{'\n'}SECRET DEALS</Text>
                        <Text style={styles.secretLimit}>Limited to first 500 customers</Text>
                        <View style={styles.codeButton}>
                            <Text style={styles.codeText}>Enter Code: CYBER500</Text>
                        </View>
                    </View>
                    <View style={styles.secretIcon}>
                        <MaterialIcons name="stars" size={60} color="#FFD646" />
                    </View>
                </View>

            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const CategoryItem = ({ icon, label, color, imageUrl }: any) => (
    <View style={styles.categoryItem}>
        <View style={styles.categoryIconBox}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
            ) : (
                <MaterialIcons name={icon} size={30} color={color} />
            )}
        </View>
        <Text style={styles.categoryLabel}>{label}</Text>
    </View>
);

const ProductCard = ({ image, title, price, originalPrice, discount }: any) => (
    <View style={styles.card}>
        {/* Discount Badge */}
        <View style={styles.cardDiscountBadge}>
            <Text style={styles.cardDiscountText}>{discount}</Text>
        </View>

        <View style={styles.cardImageContainer}>
            <Image source={{ uri: image }} style={styles.cardImage} resizeMode="contain" />
        </View>

        <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.cardPriceRow}>
                <Text style={styles.cardPrice}>{price}</Text>
                <Text style={styles.cardOriginalPrice}>{originalPrice}</Text>
            </View>
            <TouchableOpacity style={styles.buyNowBtn}>
                <Text style={styles.buyNowText}>BUY NOW</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3478C2', // Cyber Blue background for top oversizing
    },
    contentContainer: {
        paddingBottom: 40,
        backgroundColor: '#F3F4F6', // background-light for main content
    },
    // Hero
    heroSection: {
        backgroundColor: '#3478C2',
        paddingBottom: 60,
        alignItems: 'center',
        position: 'relative',
        borderBottomWidth: 4,
        borderBottomColor: '#000',
        zIndex: 1,
    },
    backButton: {
        position: 'absolute',
        left: 24,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    halftoneBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
    },
    sticker: {
        position: 'absolute',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 0, // Hard shadow
    },
    stickerLeft: {
        top: 120,
        left: -10,
        transform: [{ rotate: '-15deg' }],
    },
    stickerRight: {
        top: 80,
        right: -10,
        transform: [{ rotate: '20deg' }],
    },
    stickerImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#fff',
    },
    heroContent: {
        alignItems: 'center',
        zIndex: 3,
        marginTop: 20,
    },
    specialOfferText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    cyberText: {
        color: '#fff',
        fontSize: 48,
        fontWeight: '900',
        fontStyle: 'italic',
        lineHeight: 48,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 0,
    },
    mondayBox: {
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 16,
    },
    mondayText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        fontStyle: 'italic',
        letterSpacing: -1,
    },
    discountBadge: {
        backgroundColor: '#FF528F',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#fff',
        transform: [{ rotate: '-2deg' }],
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    discountText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    shopNowBtn: {
        backgroundColor: '#FFD646', // Primary Yellow
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 999,
        borderBottomWidth: 4,
        borderBottomColor: '#d97706', // Darker yellow for 3D effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    shopNowText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    // Main Wrapper
    mainWrapper: {
        marginTop: -24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingTop: 24,
        zIndex: 4,
    },
    // Categories
    categoriesSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#3478C2',
        textTransform: 'uppercase',
        fontStyle: 'italic',
    },
    swipeHint: {
        fontSize: 10,
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    categoryScroll: {
        paddingBottom: 8,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 16,
    },
    categoryIconBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0, // Hard shadow
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1f2937',
    },
    // Flash Header
    flashHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    flashTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    flashTitle: {
        fontSize: 20,
        fontWeight: '900',
        fontStyle: 'italic',
        color: '#000',
        textTransform: 'uppercase',
    },
    timerBadge: {
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    timerText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontWeight: 'bold',
    },
    // Grid
    gridRow: {
        flexDirection: 'row',
        gap: 16,
    },
    // Card
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardDiscountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 10,
        backgroundColor: '#FF528F',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#fff',
        transform: [{ rotate: '-3deg' }],
    },
    cardDiscountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardImageContainer: {
        aspectRatio: 1,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    cardPriceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 12,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
    },
    cardOriginalPrice: {
        fontSize: 10,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    buyNowBtn: {
        backgroundColor: '#FFD646',
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: '#d97706',
    },
    buyNowText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        textTransform: 'uppercase',
    },
    // Secret Banner
    secretBanner: {
        marginTop: 32,
        backgroundColor: '#0F172A',
        borderRadius: 24,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
    },
    secretContent: {
        flex: 1,
        zIndex: 2,
    },
    secretTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        fontStyle: 'italic',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    secretLimit: {
        color: '#94a3b8',
        fontSize: 10,
        marginBottom: 16,
    },
    codeButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    codeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    secretIcon: {
        zIndex: 2,
    },
});

import { Platform } from 'react-native';
