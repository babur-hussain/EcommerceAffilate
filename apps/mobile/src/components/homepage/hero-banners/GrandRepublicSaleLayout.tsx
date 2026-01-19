import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Grand Republic Sale Layout (Banner ID: 1)
 * 
 * Implements the "Republic Sale" design.
 * Features:
 * - Saffron (#d66b00) and Forest Green (#286022) theme.
 * - Heritage/Artisanal feel.
 * - Featured Full-Width Product Card.
 * - Grid Layout for other items.
 */
export default function GrandRepublicSaleLayout() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

            {/* Hero Section */}
            <View style={styles.heroWrapper}>
                <View style={styles.heroContainer}>
                    {/* Background gradient/color is handled by container style, here we add overlay gradient */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={StyleSheet.absoluteFillObject}
                    />

                    {/* Decorative Circle */}
                    <View style={styles.decorativeCircle} />

                    <View style={styles.heroContent}>
                        <View style={styles.heroTag}>
                            <Text style={styles.heroTagText}>CELEBRATING HERITAGE</Text>
                        </View>
                        <Text style={styles.heroTitle}>Grand Republic{'\n'}Sale</Text>
                        <Text style={styles.heroSubtitle}>Artisanal Excellence & Modern{'\n'}Innovation. Up to 60% Off.</Text>
                    </View>
                </View>
            </View>

            {/* Category Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContainer}>
                <TouchableOpacity style={[styles.chip, styles.activeChip]}>
                    <Text style={styles.activeChipText}>All Curator Picks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.chipText}>Smartphones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.chipText}>Heritage Fashion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.chipText}>Beauty</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Limited Time Offers</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>SEE ALL</Text>
                </TouchableOpacity>
            </View>

            {/* Dynamic Product Grid */}
            <View style={styles.gridContainer}>

                {/* Full Width Card */}
                <View style={styles.fullWidthCard}>
                    <View style={styles.fullWidthImageContainer}>
                        <View style={styles.limitedOfferBadge}>
                            <Text style={styles.limitedOfferText}>LIMITED OFFER</Text>
                        </View>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV_olyw2SlT_Ob26HPflczPQ44UC_HBr3F7UpfgvpymAILFp7CY2d4-TiAzOOeF6qr536n9fyUj99KU5Fzwy7vujb45ET90Iebfxth0vxUZzgEwVbXo47xb0okz3l_Z8UG0RdWzd8Yn_GA4_FJ5RBYrxaBxhzHYboUHDNMV_xjNyPgYUY65vrnxAbFBoJen-2WXpSfzY4RvuRO5cAoEpye-D6bC7koDHG96XTevhwxLd-l8tNMcZw5jca2EAJcCkIxi-yQwqlCkY37' }}
                            style={styles.fullWidthImage}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.fullWidthContent}>
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={styles.cardTag}>FLAGSHIP SERIES</Text>
                                <Text style={styles.cardTitleLarge}>Elite 5G Pro Max</Text>
                            </View>
                            <View style={styles.alignRight}>
                                <Text style={styles.priceLarge}>₹74,999</Text>
                                <Text style={styles.originalPrice}>₹89,999</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.buyNowBtn}>
                            <MaterialIcons name="shopping-cart" size={16} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.buyNowText}>BUY NOW</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Grid Row */}
                <View style={styles.gridRow}>
                    <ProductCardSmall
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBYgFaU2Pd0tpJa3sx48Nc2Jr3lZAvEweMfeuUgDZlSWD0RvYk7cxGetuH6aiUChRO-bcN0izETCN-g3s7yqzAPAvG0FlG_DKY0I1GhRM_doCZsjMcOYU-RgQfa69oBN3uxIi2wriZagvBhiLxjb1MdcnCltbtDetjhbO6Z8sMpUuC6uWp0_xMg_XJdl5N-DQ0cmvmZ-cxWDjMbBOlwTYG3mjGpuhT8MD4VKRnMSbIjEiD7pe_vCwl0AHtOeCpXXdAfhyUg9U2jnsak"
                        name="Varanasi Silk..."
                        price="₹4,200"
                        isFavorite
                    />
                    <ProductCardSmall
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAFn-FuwVwLyfdTkR5dF8HM3G5gPYjLtOLjRSUCIm5vfCRBeA21YErGPwR8nRIFnPh8P_Mk3yxob2R0L8czOLMFoDJ9nWm-OfJJcbnoJNskoErdU6a35DDwx_1Fs2OM5kobYRovC6_Uf2H4aMJrKC-W27FGh6Qg8rmbFfnLr60RV1CrJSXmDYXArNVhmOsfdGfEToRg7Jf0BBJBjIZ6EorJ-4_q2-e-GhY1L2a1Pvn4CgJEA-Hd0sFsF8kiEmfA0nw8BLPMXilnc3nU"
                        name="Auric Glow Serum"
                        price="₹2,850"
                    />
                </View>

            </View>

            {/* Mid-Page Promotional Banner */}
            <View style={styles.midBannerWrapper}>
                <View style={styles.midBannerContainer}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOltVDXsQVh8Weu2gFg7wlPoQzy4ceTRUFaJ4FJpQs3coztttupvpnoEetZHdRonuyvh-N2vmHYFfZixf8JpZeNSURjgq1pvGM2KMjiWpq7GxFOLpB7lvPKrzpXG-jlvhT3VULneK2FRizjn5qaZOrGQbGRiQw6vKZDBFy1540mYbPxwZJzF1v-GmSsuah6plaiO3uLnwtAh0alPCmk-BmROZWy-kFQKg04dBHp6myOrHjyUjUzTPwj2i8hgCyHvL-Z4IyMsTrZJop' }}
                        style={styles.midBannerImage}
                    />
                    <View style={styles.midBannerOverlay}>
                        <Text style={styles.midBannerTitle}>SPIRIT OF UNITY</Text>
                        <Text style={styles.midBannerSubtitle}>SPECIAL CURATED COLLECTION</Text>
                        <TouchableOpacity style={styles.exploreBtn}>
                            <Text style={styles.exploreBtnText}>EXPLORE STORY</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Fresh Drops Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Fresh Drops</Text>
            </View>

            {/* Fresh Drops Grid */}
            <View style={styles.gridContainer}>
                <View style={styles.gridRow}>
                    <ProductCardSmall
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCgUzEiY6vPs_l2tyNW3fjtalMhezeEPiLIpuQKy7LYXbWhGcQVAuoGY9F9T3JesGzASkFdQv48mCpJ7pfQkS4Q3_QXCdeuk6zlj2nlDNhHaDcCt2ml_B5W9VNHlRPgkZoJiJnQ6ZX-qbTjXD9kjCOLsRRBSScPLvDrwDnMVgyOtuDRzOpklKEpnDMqO1UnVIsslT_xyehuO3kdyCBXDEOEuFHD70zv0mqPXLKyZWe58IURNimTC_pqxwl3cTvFv9g_qP0KphCuXoR_"
                        name="Cotton Fusion Tunic"
                        price="₹1,899"
                        aspectRatio={3 / 4}
                    />
                    <ProductCardSmall
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCQFjYJrJhuPxNecoKjlUzAED81OdI2yEStc2G__Qkg6EKk1AQDedZyXEdnrCcgzCWJaod1G3cTPhWwmPM21-R71TN1KTz2afdqMJ3Iai058RVoYcnqMgqZUQREdRqIDUl44OdNdPPbfjTGfBJxiYlVj1xzeNRVh9DkeExowMMpOd7Xlve6zHUS7if2tR-UHxV6wMj2GJk_deXtnVFGRzzjxOTWN56mjMoxX9X7cY4CGzP6nLTlI5VOYgWgGMmZ5FE-TJ7tQ__3VPB-"
                        name="Sonic Pro Buds"
                        price="₹5,499"
                        aspectRatio={3 / 4}
                    />
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const ProductCardSmall = ({ image, name, price, isFavorite, aspectRatio = 1 }: any) => (
    <View style={styles.smallCard}>
        <View style={[styles.smallCardImageContainer, { aspectRatio }]}>
            <Image source={{ uri: image }} style={styles.smallCardImage} resizeMode="cover" />
            {isFavorite && (
                <View style={styles.favIcon}>
                    <MaterialIcons name="favorite" size={16} color="#d66b00" />
                </View>
            )}
        </View>
        <View style={styles.smallCardContent}>
            <Text style={styles.smallCardTitle} numberOfLines={1}>{name}</Text>
            <Text style={styles.smallCardPrice}>{price}</Text>
            <TouchableOpacity style={styles.addToBagBtn}>
                <Text style={styles.addToBagText}>ADD TO BAG</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafaf9', // background-light
    },
    contentContainer: {
        paddingBottom: 40,
    },
    // Hero
    heroWrapper: {
        padding: 16,
    },
    heroContainer: {
        backgroundColor: '#286022', // Forest
        borderRadius: 16,
        minHeight: 240,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    decorativeCircle: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 20,
        borderColor: 'rgba(214, 107, 0, 0.2)', // primary/20
    },
    heroContent: {
        padding: 24,
    },
    heroTag: {
        backgroundColor: '#d66b00',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    heroTagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 36,
        marginBottom: 4,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '300',
    },
    // Chips
    chipsScroll: {
        flexGrow: 0,
    },
    chipsContainer: {
        paddingHorizontal: 16,
        gap: 12,
        paddingBottom: 4,
    },
    chip: {
        height: 40,
        paddingHorizontal: 24,
        borderRadius: 99,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 1,
    },
    activeChip: {
        backgroundColor: '#286022', // forest
        borderColor: '#286022',
        borderWidth: 0,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#181410',
    },
    activeChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#181410',
    },
    seeAllText: {
        color: '#d66b00',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // Grid
    gridContainer: {
        paddingHorizontal: 16,
    },
    gridRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 16,
    },
    // Full Width Card
    fullWidthCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(214, 107, 0, 0.1)',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 2,
    },
    fullWidthImageContainer: {
        aspectRatio: 16 / 9,
        backgroundColor: '#f3f4f6',
        position: 'relative',
    },
    fullWidthImage: {
        width: '100%',
        height: '100%',
    },
    limitedOfferBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: '#d66b00',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
    },
    limitedOfferText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    fullWidthContent: {
        padding: 20,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    alignRight: {
        alignItems: 'flex-end',
    },
    cardTag: {
        color: '#d66b00',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    cardTitleLarge: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#181410',
    },
    priceLarge: {
        fontSize: 18,
        fontWeight: '900',
        color: '#286022',
    },
    originalPrice: {
        fontSize: 10,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    buyNowBtn: {
        backgroundColor: '#286022',
        borderRadius: 8,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buyNowText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Small Card
    smallCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(214, 107, 0, 0.1)',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 1,
    },
    smallCardImageContainer: {
        backgroundColor: '#f3f4f6',
        position: 'relative',
    },
    smallCardImage: {
        width: '100%',
        height: '100%',
    },
    favIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
    },
    smallCardContent: {
        padding: 16,
    },
    smallCardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#181410',
        marginBottom: 4,
    },
    smallCardPrice: {
        fontSize: 14,
        fontWeight: '900',
        color: '#286022',
    },
    addToBagBtn: {
        borderWidth: 1,
        borderColor: '#286022',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    addToBagText: {
        color: '#286022',
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Mid Banner
    midBannerWrapper: {
        padding: 16,
    },
    midBannerContainer: {
        height: 192,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    midBannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    midBannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(214, 107, 0, 0.4)', // primary/40
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    midBannerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 4,
    },
    midBannerSubtitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 2,
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 16,
    },
    exploreBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 99,
    },
    exploreBtnText: {
        color: '#d66b00',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
});
