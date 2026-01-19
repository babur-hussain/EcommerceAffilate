import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/**
 * Footwear Sale Layout (Banner ID: 9)
 */
export default function FootwearSaleLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

            {/* Header / Hero Section Area */}
            <View style={[styles.heroHeader, { paddingTop: insets.top + 0 }]}>
                {/* Custom Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* Background Decoration */}
                <View style={styles.heroDecorationRight}>
                    {/* Simulated SVG polygon */}
                    <View style={styles.triangle} />
                </View>

                {/* Main Hero Text */}
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>
                        50% OFF{'\n'}FOOTWEAR SALE
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        SPECIAL PRICE UP TO 50% OFF
                    </Text>
                </View>
            </View>

            {/* Main Content Rounded Top Overlap */}
            <View style={styles.mainWrapper}>

                {/* Featured Product Card */}
                <View style={styles.featuredCard}>
                    {/* Curved Background */}
                    <View style={styles.curvedBg} />

                    <View style={styles.featuredContent}>
                        <View style={styles.featuredHeader}>
                            <View style={styles.newArrivalBadge}>
                                <Text style={styles.newArrivalText}>NEW ARRIVAL</Text>
                            </View>
                            <MaterialIcons name="favorite-border" size={24} color="#cbd5e1" />
                        </View>

                        <View style={styles.featuredImageContainer}>
                            <Image
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEbKXkrU9m09ROnV_bRa8vS2jxQCkQ2NWtdK0COAkjh9OVdWXb7lJXOY5wnv7gi2S9CUMEv444RXL8hwxR-bp_xaNnpGcMuqPx6o1OT_RwJK1N5GMngjxgNlH3vvb4f7mgQORdqUIdpDHMQ8jBQ6y2S1pOrx9cjXnJ5KeOdp4MqnpRQwQlfhiwUY2NBuJL1xMZWxnK26NhJEx7t8v8Ln8BovH0a83rXIDArBd_lk9ZV2DTeRz-QLZ2NpNjfaCgoJ5JKDBnfJaMi2gY' }}
                                style={styles.featuredImage}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.featuredInfo}>
                            <Text style={styles.featuredTitle}>Pro Speed Runner X</Text>
                            <View style={styles.featuredPriceRow}>
                                <Text style={styles.featuredPrice}>$89.00</Text>
                                <Text style={styles.featuredOldPrice}>$178.00</Text>
                            </View>

                            <TouchableOpacity style={styles.shopNowBtn}>
                                <Text style={styles.shopNowText}>SHOP NOW</Text>
                                <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Dots Decoration */}
                    <View style={styles.dotsDecor}>
                        <View style={[styles.dot, { backgroundColor: '#7d12ff' }]} />
                        <View style={[styles.dot, { backgroundColor: '#cbd5e1' }]} />
                        <View style={[styles.dot, { backgroundColor: '#cbd5e1' }]} />
                    </View>
                </View>

                {/* Flash Sale Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>FLASH SALE ITEMS</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Grid */}
                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCy9Ld8b69_VgsmF-wBS4toZC0Esunhuw81VfLYOsnbY3D0Ei7b27NGEFpAMRlY2vveBRoF2R77XU6sFjwxmAZZJiNBhJcuW_oPboFp_1XiTnIC-Fd99Vx-cIk7TE4BP3EekgjFT49g0veysXMnQfgefF8ckUNJA9Dafy--OJs0a-8uIyfK3IWz_B5bTRSvSZc_c0aWXlW5jxJAwzarSRzzW9Ki3LBA5l9sKduB5YYZ42cQyFIwEB4mSD5s7zdLyvrxhEeUx1W9WuuV"
                        title="Air Max Strike"
                        category="Running Footwear"
                        price="$45.00"
                        discount="-50%"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuDsSvmhLEDhGzFHTlpInfJSd9MAs3Qx9UAzpBByLZz3_NeRvcfa9KE_KxgUp2ztAEV5qnY7lsCH0zUAtJzqVzo9XQeWn_jabK86ZYUZsZKwF9zFpu7d2nA4iv_fbiF9hRP8i93ALXYLJ-u7SQO_YEDSJMZeviyv2Vl9gToXuKCOBFhBrHLTuakPzGtI2MAcC3JzO-alpn5VpMPgK19Y--HtSaAdSjzo27LMXQn8Yep0vGEyB0bdCDSO2ohl6_LV3_SaDGGH2s8VjG9Q"
                        title="Court Classic"
                        category="Casual Wear"
                        price="$32.50"
                        discount="-50%"
                    />
                </View>

                <View style={[styles.gridRow, { marginTop: 16 }]}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuDMmEhsdieguv3wky1MAlt86pzbGlCf-FQPoUxFZrQaLSIt2n3AfMPeSxy2yowR61IsUp_9_Vk0QHN22JBm1gNPkTLoxTwpWw1SzAX00ojyXyIbe8YCuDHaDDeJUdBrifnG-Q5l-q3ZeIlkuOCbXoxv4eOCUsJM-YBaoJid3uqAAZiy_N99V4GPEQSQiFo-h9SDXXd-sP0IzYfl1Dt7zEX9Jxd8M4xB6PlukjQdYTeFc6fMTw4rKozYowRg8xEAUkuW-y3uHKIuHHZl"
                        title="Flash Elite V2"
                        category="Training Shoes"
                        price="$55.00"
                        discount="-50%"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAmiedhMKuYgKKv3PkzHItcTYnhslINz6797OKaEnOpGMm2lq26sp7wvOZOUMxdWQTWRXvzpdWeaDJW5h-PxKxCc-FthQJRJ4NThKVNRSmKxscrziTnb6TmZm7wc9_qac9Lk9XPSdrTUg9tMkZc-gXjWZZ4NnpzeUAdz_MdH-OTDyHBV3OujN_Dk2yIUu7lIAhZhIdlR5QIU8MKRPc7bdG50tBFBfOYFKYhoj-8EQRHbzBt1CJuBevjMSI3NpGe_rCWclWSWSxOY6IR"
                        title="Striker FG"
                        category="Football Cleats"
                        price="$62.00"
                        discount="-50%"
                    />
                </View>

            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const ProductCard = ({ image, title, category, price, discount }: any) => (
    <View style={styles.card}>
        <View style={styles.imageSection}>
            {/* Circular Background */}
            <View style={styles.circleBg} />
            <Image source={{ uri: image }} style={styles.cardImage} resizeMode="contain" />
            <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discount}</Text>
            </View>
        </View>

        <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.cardCategory}>{category}</Text>

            <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>{price}</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <MaterialIcons name="add-shopping-cart" size={16} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcc228', // Primary yellow for top
    },
    contentContainer: {
        paddingBottom: 40,
        backgroundColor: '#F8F9FA', // background-light
    },
    // Hero
    heroHeader: {
        backgroundColor: '#fcc228',
        paddingHorizontal: 24,
        paddingBottom: 40,
        position: 'relative',
        overflow: 'hidden',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        zIndex: 20,
    },
    heroDecorationRight: {
        position: 'absolute',
        top: 20,
        right: 20,
        opacity: 0.2,
        transform: [{ rotate: '12deg' }],
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 30,
        borderRightWidth: 30,
        borderBottomWidth: 60,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
    },
    heroContent: {
        zIndex: 10,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '900', // heavy
        fontStyle: 'italic',
        color: '#fff',
        lineHeight: 36,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '600',
        fontStyle: 'italic',
        marginTop: 8,
        letterSpacing: 1,
    },
    // Main Wrapper
    mainWrapper: {
        marginTop: -24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    // Featured Card
    featuredCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        marginBottom: 32,
        position: 'relative',
    },
    curvedBg: {
        backgroundColor: 'rgba(252, 194, 40, 0.1)', // primary/10
        height: 180,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderBottomLeftRadius: 100, // Approximate curved bg
        borderBottomRightRadius: 40,
    },
    featuredContent: {
        padding: 24,
    },
    featuredHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    newArrivalBadge: {
        backgroundColor: '#7d12ff', // Accent
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    newArrivalText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    featuredImageContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    featuredImage: {
        width: 220,
        height: 220,
        transform: [{ rotate: '-12deg' }],
    },
    featuredInfo: {
        marginTop: 10,
    },
    featuredTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    featuredPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    featuredPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7d12ff',
    },
    featuredOldPrice: {
        fontSize: 14,
        color: '#94a3b8',
        textDecorationLine: 'line-through',
    },
    shopNowBtn: {
        backgroundColor: '#7d12ff',
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    shopNowText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    dotsDecor: {
        position: 'absolute',
        right: 16,
        top: '50%',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    // Flash Sale Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800', // extra bold
        fontStyle: 'italic',
        color: '#000',
    },
    viewAllText: {
        color: '#7d12ff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Grid
    gridRow: {
        flexDirection: 'row',
        gap: 16,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    imageSection: {
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    circleBg: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(252, 194, 40, 0.1)', // primary/10 (simulated scale-75)
    },
    cardImage: {
        width: 110,
        height: 110,
        zIndex: 1,
    },
    discountBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#fcc228',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        zIndex: 2,
    },
    discountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    cardContent: {

    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    cardCategory: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#7d12ff',
    },
    addBtn: {
        backgroundColor: '#f4f4f5', // zinc-100
        padding: 8,
        borderRadius: 10,
    },
});
