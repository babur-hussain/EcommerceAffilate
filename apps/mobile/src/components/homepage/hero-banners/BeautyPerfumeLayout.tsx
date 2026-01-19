import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Beauty & Perfume Layout (Banner ID: 3)
 * 
 * Implements the "Betul's Exclusive - Beauty & Perfume" design.
 * Features:
 * - Rose/Pink theme (#E8A3A8)
 * - Custom Banner with Gradient Overlay
 * - Category Pills
 * - 2-Column Product Grid
 * - Member Exclusive Dark Card
 */
export default function BeautyPerfumeLayout() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Header is handled by parent, but we might want to hide it if we want full custom header 
                For now, sticking to "use our header and footer only" request which usually means keep generic header 
                BUT the design shows a specific header style. 
                Given the instruction "use our header and footer only", I will render the content directly.
            */}

            {/* Hero Section */}
            <View style={styles.heroWrapper}>
                <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyaW6NI6Ot5df0T21LirI73BazDMzKJT7oPmi56FTPy5QvHZVS1TWLgiAXQwlNmC588Pr_Z0gmw-KzbzkDj4swYAS3ll87d_WwZcmIQ-D3IUVt4hlRCA-LSUfoli2KJOV8d4S6EudA77m6zAZ8QBj6jd37GyH3TrVWmeBHbT1B0ji-yfp3S8PZD-EznkUTrtIMr83VUj8FAAMtYgJp905eAD0kjIo67foN7fvt9Hu8aDxYR0devl7RsDbl9fTuqw_sDVyZq9ZBoLhw' }}
                    style={styles.heroImage}
                />
                <LinearGradient
                    colors={['rgba(243, 197, 200, 0.9)', 'rgba(243, 197, 200, 0.4)', 'transparent']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.heroOverlay}
                >
                    <View style={styles.heroContent}>
                        <View style={styles.heroHeaderRow}>
                            <Text style={styles.heroBrandText}>BETUL'S EXCLUSIVE</Text>
                            <View style={styles.heroLine} />
                        </View>
                        <Text style={styles.heroTitle}>BEAUTY{'\n'}PERFUME</Text>
                        <Text style={styles.heroSubtitle}>with new organic formula for your daily use</Text>
                        <TouchableOpacity style={styles.shopNowBtn}>
                            <Text style={styles.shopNowText}>SHOP NOW</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            {/* Category Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll} contentContainerStyle={styles.pillsContainer}>
                <TouchableOpacity style={[styles.pill, styles.activePill]}>
                    <Text style={styles.activePillText}>All Products</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pill}>
                    <Text style={styles.pillText}>Fragrances</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pill}>
                    <Text style={styles.pillText}>Skincare</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pill}>
                    <Text style={styles.pillText}>Makeup</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Product Grid */}
            <View style={styles.gridContainer}>
                <ProductCard
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuDjLYRk1L0cdYGe-pNFarvk-_Pdh_oPIVXy11R4ZhtzjQFf7VY5t2Abgy80acdYeo6oiLZByFhxLXjM8GfalKYdgZC7_EWl_La-unVwHojB5bhk0wEomUBXxN9hhIxqdtbg4tRRqPzZzgw1gUPS6dUgwx4tDe_WOMoStAEXtUOM8rjAMd14Z8nqvFkY9ne-M-XvvWPHsSJbrPa_t2LQjwsmxJTAwiAM1plKaxm0BhUdZ5zJi7pK1WWObMOkJ6nmFCL37RvsQ0LRJC9r"
                    category="FRAGRANCE"
                    name="Midnight Rose Elixir"
                    desc="50ml • Organic formula"
                    price="$89.00"
                />
                <ProductCard
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuCNqF9MojdN9_XjHWWixZHgUonFWTHLJiNR8zBviaQ5WKCbgJMEtq-4rLbVU6I879XP3-fBd0OIiE2l3uZkLC68FlfBggGa9xyLUBtqetdl6mTUrmFyJvp-b8pNFyH_V9YGtGO4L11OI30ZsgUv3UVvG_SCOz0XKceg6HEltgoBtKgPHV6euzIaT2IwXtSMCkUzpraylRTxpWe3vgbbTGBaAbzwWuTqHudckrScB-xXvn_d1nVSUeR4E4eWnFAob09eHNE2Rja1rA6s"
                    category="SKINCARE"
                    name="Silk Glow Face Cream"
                    desc="30g • Pure Extracts"
                    price="$45.00"
                    isFavorite
                />
                <ProductCard
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuAsdQufFHvD164iVtzEvv-8xTnU3APaDf78SrPL9UnKZmYhfORa5uRX4nbXHP_ym2Ybx214LF-p_2z6zHEQuoYrfO08nrm9mvr2iamdyCP8UStFVOtZ-ZcPAonsvB36nw9-CZw3ZantQQeh2gC4t_cVp8FkZDgY9XtolvCfD7bkt11c_4-oqcpxwf3mipxEPIGfsQLxU4g9j4ecvtpTFOUaniV2lTju9PxIfyQX_52vmf67awv5fGZwRxfOHfRMq6trG2t-bw03UMbZ"
                    category="MAKEUP"
                    name="Velvet Matte Stain"
                    desc="Shade: Dusty Rose"
                    price="$24.50"
                />
                <ProductCard
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuBu3_T8BMqZTMnjoxZjCljdEiqytLvt9z23BvKofZgtT1HLGXiY9-BOvUEoHcS4gcF01c_LLQoLL2Ujv5C9QC_chqaS3JxBCOXJcXblspK5i5nAmnduvhX7z64lXqNyjDoRgRU9gSQVaoPTw3KHfzEvaBDfB1g2UR6IQX1jqgR-gfUYxBhR_vU62P5KHxMlvrWnF-Gxo2M8tHeom0oY2d74mC7PYbAnEDqfBzNjVYze1sDgMelj437_R4eQxKRiEBzTmiEoLDE4ZJXN"
                    category="ANTI-AGING"
                    name="24K Gold Lift Serum"
                    desc="20ml • Intense Hydration"
                    price="$120.00"
                />
            </View>

            {/* Member Exclusive Card */}
            <View style={styles.memberCardContainer}>
                <View style={styles.memberCard}>
                    <View style={styles.memberContent}>
                        <Text style={styles.memberTitle}>Member Exclusive</Text>
                        <Text style={styles.memberDesc}>Get 20% off on all{'\n'}Betul's Organic line</Text>
                        <TouchableOpacity style={styles.unlockBtn}>
                            <Text style={styles.unlockBtnText}>Unlock Deal</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.memberIconContainer}>
                        <MaterialIcons name="redeem" size={100} color="rgba(255,255,255,0.1)" style={{ transform: [{ rotate: '12deg' }] }} />
                    </View>
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const ProductCard = ({ image, category, name, desc, price, isFavorite }: any) => (
    <View style={styles.card}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.productImage} />
            <TouchableOpacity style={styles.favBtn}>
                <MaterialIcons name={isFavorite ? "favorite" : "favorite-border"} size={20} color="#E11D48" />
            </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardCategory}>{category}</Text>
            <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
            <Text style={styles.cardDesc}>{desc}</Text>
        </View>
        <View style={styles.cardFooter}>
            <Text style={styles.price}>{price}</Text>
            <TouchableOpacity style={styles.cartBtn}>
                <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6F6', // background-light
    },
    contentContainer: {
        paddingBottom: 40,
    },
    // Hero
    heroWrapper: {
        margin: 16,
        height: 220,
        borderRadius: 32,
        overflow: 'hidden',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        padding: 24,
    },
    heroContent: {
        width: '70%',
    },
    heroHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    heroBrandText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#1E293B',
    },
    heroLine: {
        width: 40,
        height: 1,
        backgroundColor: '#1E293B',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        lineHeight: 34,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#334155',
        marginBottom: 16,
        maxWidth: 180,
    },
    shopNowBtn: {
        borderWidth: 2,
        borderColor: '#0F172A',
        paddingHorizontal: 20,
        paddingVertical: 8,
        alignSelf: 'flex-start',
    },
    shopNowText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0F172A',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // Meatballs/Pills
    pillsScroll: {
        marginTop: 16,
        flexGrow: 0,
    },
    pillsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: '#F3C5C8',
        backgroundColor: '#fff',
    },
    activePill: {
        backgroundColor: '#E8A3A8', // primary
        borderColor: '#E8A3A8',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    activePillText: {
        color: '#fff',
    },
    // Grid
    gridContainer: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    card: {
        width: (width - 48) / 2, // 2 column with gap
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#FDF6F6',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 6,
        borderRadius: 20,
    },
    cardContent: {
        marginBottom: 12,
    },
    cardCategory: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#E8A3A8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 12,
        color: '#64748B',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    cartBtn: {
        backgroundColor: '#E8A3A8',
        padding: 8,
        borderRadius: 12,
        shadowColor: '#E8A3A8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    // Member Card
    memberCardContainer: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    memberCard: {
        backgroundColor: '#1A1616', // Slate 900 equivalent
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
    },
    memberContent: {
        zIndex: 10,
    },
    memberTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    memberDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 16,
        lineHeight: 20,
    },
    unlockBtn: {
        backgroundColor: '#E8A3A8',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        alignSelf: 'flex-start',
    },
    unlockBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    memberIconContainer: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        opacity: 0.5,
    },
});
