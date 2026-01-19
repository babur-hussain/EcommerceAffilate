import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Trending Fashion Layout (Banner ID: 2)
 * 
 * Implements the "Trending Fashion Selection" design.
 * Features:
 * - Vibrant Amber/Yellow (#fbbf24) primary color.
 * - Sharp edges (0px border radius).
 * - Rotated card hero design.
 * - 2-column grid with sharp cards.
 */
export default function TrendingFashionLayout() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

            {/* Hero Section */}
            <View style={styles.heroWrapper}>
                <View style={styles.heroBackground}>
                    {/* Rotated White Card */}
                    <View style={styles.rotatedCardContainer}>
                        <View style={styles.rotatedCard}>
                            <Text style={styles.specialDealText}>SPECIAL DEAL</Text>
                            <Text style={styles.newStyleText}>NEW STYLE</Text>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>60% OFF</Text>
                            </View>
                        </View>
                    </View>

                    {/* Model Images (Absolute) */}
                    {/* Using slightly different placeholder logic to mimic the overlay effect */}
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYbSFDGkRQ39hB1urhej9EeN6fynAc1PnGTp0f7f-mqinpAq9p4TIL2DVUx7KlsuMy5qCAkYpYk4uqAC5QCcfJZursg1wr80ShbqNtSOqWCt3UfcvLhKydIv_6VB40uJoaBuQ9x7cN7sS-qIr9r2iBtbUlwp7vPwnRyS4-fbP0k7Ad_a5JOp4NvDBM6Etf6nOsRzMlg_VNa9wnYMy9QQCL3c3-rmvP_da9PJs7pKgcSWtv9KXQCCMLWG8A1ZMNaQGMn4fHtm8aAA2q' }}
                        style={styles.modelImageRight}
                        resizeMode="contain"
                    />
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiudnkGGS8iv8yHHsfCe0T_jPjoBJB-BKtT-G1-O_2qL8l_riR9fE0gVO_g4grD4H9KihNXY3FzuTU4Pzj0Fk7_UVTxCS50ORa8MqJf9Z39zq0rB3vdLyxiVWXfJrGLsx_9JkGVltu2EtEQAj0OeDDf2o5uqIQc2dz4sblUiW5F_GOtlQtTr_uBzTG22UYIJsSVqDfwt-vyHHxPTW76FOKS5Gh0yvkNENaeUnoaKklygpcRkXNZwqpGL8Ltkzwn9POSgL0k-Jle7CL' }}
                        style={styles.modelImageLeft}
                        resizeMode="contain"
                    />
                </View>
            </View>

            {/* Category Chips - Rectangular */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContainer}>
                <TouchableOpacity style={[styles.chip, styles.activeChip]}>
                    <Text style={styles.activeChipText}>ALL ITEMS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.chipText}>FLORAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.chipText}>DENIM</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip}>
                    <Text style={styles.chipText}>DRESSES</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Product Grid */}
            <View style={styles.gridContainer}>
                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBlQD9lZXYQQXLs8TvAXTIHlUI9-9ZKWSxfRiYS8EFD5ECwVo1xblM8-lXgYjxWJWqVvo8xoJm_7xVekIkkJYTyS3vhusEmhSey0-dbk3b6lqI2TI_-QjZDpPvPKkqx4opqtfFF0LdhpKW2Dny8T7uoVniiovqnRqG1MrcFUYkspWO_1zvG36kD56D4TyDmwQSsVbvNNu7w5xCGtAMI45McEJgW982EzwYUbHyb0osB7M42DMzvm3yGra_nqqAwAoLGWEyTZnVAVpsQ"
                        category="MEN'S SUMMER"
                        title="Tropical Floral Shirt"
                        price="$24.00"
                        originalPrice="$60.00"
                        badge="60% OFF"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuA99JRQY8uejhzJpX0c98eaWozoX7eEhLAxy00pyv6KjYNKfmFMlG2rMBErNITBo3x0fAL5n80l6k3B45prkz7bqfJqRWay7PMDsqHHDQ7GbVVO9fq1Mb1-LcyCmYhV8P9Yax8T_qrNsbzaAwfQ6QF-zesR0G3gbGtDmohxNDXabiCpDmDvHiEeAUa01H_oUahtMiuvDdlo7elXksC_peEYUHZbxgl8-rh941c7n6p-HKYlWFmWvLvJrcJRexG4Kgyrj-VJDBH23C8r"
                        category="WOMEN'S STYLE"
                        title="Boho Mini Dress"
                        price="$45.00"
                    />
                </View>

                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAXSeRlVvlQebnbrWnusc3SxRYNfhtUTv364cKQGVDBJ5_vp9jYWx5E0qvSHdEEwz2ra42ZjvD3TviyewTRuoaNdqFNlZcpNzq5W2_bI02iZrSfpbB6CSoj2orhyHnHwLmigu4JL0Vu-ch0VtnhmlRn_xzURJyBh7L7Owcl4KkzQbaNfl4rdQoyNCk8GlseqtXFdYg9BwhIhrXJ7M1WVEeb0HaMpiS6KB6IS4TkgmhtGgX7OLQhD_RSYZf8UBDx6KF7qk61ijBstYJY"
                        category="DENIM ESSENTIAL"
                        title="Classic Raw Denim"
                        price="$32.00"
                        originalPrice="$80.00"
                        badge="60% OFF"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuDKt7HCwiWoAm6DEo4I_cmJcvcQs2pCHcIoDf7Rvkv8ZATzeQcvrVuEbolWxPxXLnuITLwJQ9CuGlAsCSYkz6ySImnzMoSZceFQPNznZ8kbL9Loi5wKEMyrkVicLr_A4VSQqpVBbljsyUQMXOwbdqSQ9pYTEp_dGvhpx3ZsX1y4e-m9qge0blA7Dkq3MSeBuxp-eXryFt6BDaRqmUrckoFFgJYuWd2LyVCfMH1omnvR_5c9iYOrADtjWYWIu823Y4LzEuQ-NJ1YEvNf"
                        category="ACCESSORIES"
                        title="Retro Wayfarer"
                        price="$18.00"
                    />
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const ProductCard = ({ image, category, title, price, originalPrice, badge }: any) => (
    <View style={styles.card}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.productImage} resizeMode="cover" />
            {badge && (
                <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{badge}</Text>
                </View>
            )}
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardCategory}>{category}</Text>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.price}>{price}</Text>
                {originalPrice && <Text style={styles.originalPrice}>{originalPrice}</Text>}
            </View>
            <TouchableOpacity style={styles.shopNowBtn}>
                <Text style={styles.shopNowText}>SHOP NOW</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingBottom: 40,
    },
    // Hero
    heroWrapper: {
        height: 280,
        backgroundColor: '#fbbf24', // Yellow 400
        overflow: 'hidden',
        position: 'relative',
    },
    heroBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    rotatedCardContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    rotatedCard: {
        backgroundColor: '#fff',
        width: '90%',
        paddingVertical: 30,
        paddingHorizontal: 16,
        alignItems: 'center',
        transform: [{ rotate: '-2deg' }],
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    specialDealText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1f2937', // Gray 800
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    newStyleText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 8,
    },
    discountBadge: {
        backgroundColor: '#f97316', // Orange 500
        paddingHorizontal: 20,
        paddingVertical: 6,
        transform: [{ skewX: '-12deg' }]
    },
    discountText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic',
        transform: [{ skewX: '12deg' }]
    },
    // Models
    modelImageRight: {
        position: 'absolute',
        right: -40,
        top: '15%',
        height: 240,
        width: 140,
        opacity: 0.9,
        zIndex: 6,
    },
    modelImageLeft: {
        position: 'absolute',
        left: -40,
        top: '15%',
        height: 240,
        width: 140,
        opacity: 0.9,
        zIndex: 6,
    },
    // Chips
    chipsScroll: {
        flexGrow: 0,
    },
    chipsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 12,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb', // Gray 200
        borderRadius: 0, // Sharp aesthetic
    },
    activeChip: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    chipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    activeChipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
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
        marginBottom: 16,
    },
    // Card
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 0, // Sharp
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        position: 'relative',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    cardBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#f97316', // Accent
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    cardBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    cardContent: {
        padding: 16,
    },
    cardCategory: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9ca3af', // Gray 400
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 16,
    },
    price: {
        fontSize: 18,
        fontWeight: '900',
        color: '#f97316', // Accent color for price
    },
    originalPrice: {
        fontSize: 12,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
        fontWeight: '500',
    },
    shopNowBtn: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#000',
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shopNowText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
