import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/**
 * Aesthetic Fashion Layout (Banner ID: 6)
 * 
 * Implements the "Aesthetic Fashion Gallery" design.
 * Features:
 * - Beige/Primary-Brown (#8d6e63/#f5ece5) theme.
 * - Skewed image effects in the hero section.
 * - Subtle leaf SVG background pattern (simulated/simplified).
 * - Modern 2-column grid.
 */
export default function AestheticFashionLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

            {/* Header / Hero Section */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>

                {/* Simulated Leaf SVG Background - Using absolute positioning for decoration */}
                <View style={styles.leafDecoration}>
                    {/* We can use an icon as a simple representation of the leaf if SVG isn't directly supported inline easily without extra libs, 
                       or just simulate the vibe with shapes. For now, let's keep it clean or use a subtle icon. */}
                    <MaterialIcons name="eco" size={120} color="rgba(141, 110, 99, 0.1)" />
                </View>

                {/* Skewed Images Row */}
                <View style={styles.skewedImagesContainer}>
                    <View style={styles.skewedImageWrapper}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLMAWGLtrNBanYqG1Ru3ZXZrfu1NHIDEDYwxVcz5nXGN86rP61qjMOCp-rQkBmo77kVr2yD873jTeIB9qJ_mFi4-fJ2yTzBJ1wKP219xnkTMWCbqy-8ORFu8zvL99nHmpJWZxgFkWHzfsiqlLoqeDPaEowZpc2LwvuJSanwAFmA15YLDWTi8F_ix5yHrmPdsCNPT63REXrwVdzivmEEjiKbTfiR6ENjK2Vpd8r_2Zin6Xwykr8s7rWQfGnQvng-7vXz53-YoDkJ6-b' }}
                            style={styles.skewedImage}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.skewedImageWrapper}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-dcdpW6LbyQQpH-wqRBjf8Ck3zHctC4eoYXQiWHG13tf9bA9lSJzfBaXxQOt1k11iXhy1uxY1Ar6PY-4JYO-e-yXoaP_ZOpJqplpTi_PUVhTjDm_E8gfRe7xtaaQWhBxoe5vIkng53kXaP7SDZfg4zC-2LBFdFsjxWEYKZDu24kk9gCJf2pCFSLYQACliIt9NfJaQ0iI6v46Lp8jdXv3_7wDqOGtSAM6Hhq2hnD9H8dy_taMaNBnEcAUfGwByFzZ-NIxYrloyikBb' }}
                            style={styles.skewedImage}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.skewedImageWrapper}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD70BSj8uZ3nze__s2AO3L9Qc4apz2ez4Jiz7-bnFJC0ezMAJ-a5EJ5-98uURtpAzOjowigg3ofUc_EhN8S6P4VlRkzOZ1KVBNSKNksKojc5LwvGBZ-Gb0gbLYD7AMv2oXIRzwI0VppsxZhJeesN33fZKLe__p_axbZuPmCH8rQkx5WkHe82J482QvleijcgM3jkEPJ3RBhH-amyDvy4y3ZCd_c_BWiqLuEB8FIsqEABrjNmwWMCppOaTKXrfM2h7yaf6DHVNPtoB_L' }}
                            style={styles.skewedImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.headerContent}>
                    <Text style={styles.subTitle}>AESTHETIC FASHION</Text>
                    <Text style={styles.mainTitle}>COLLECTION</Text>
                    <View style={styles.divider} />
                </View>
            </View>

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <Text style={styles.itemCount}>32 Items</Text>
                <View style={styles.filterActions}>
                    <TouchableOpacity style={styles.filterAction}>
                        <Text style={styles.filterText}>FILTER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterAction}>
                        <Text style={styles.filterText}>SORT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Grid */}
            <View style={styles.gridContainer}>
                {/* Row 1 */}
                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBG13gs8zm0jMeXtEXTHfr0hS0CjN8ZQhdGRv7rwHpG5ksADYiV2Ar54X8dyVxYOoYHb0vPEGHFNA1vDPxpTc6Hk1R5wWJW_tw0ZXphEmmrWfjTCMwQKjVjn07cv6hQouFclLq0rG1B4WRgdm6B4v3vqpQzHFBZpcGA0R8y_IYqbcoVxQ80oxm9wyQVMnm4ZtjScQ1t1YyQXf_pe0n5hCGEoJ7zs3UwHMuyg5g_kuesmfZvuuYo5BG80NQ7WuFM6lpeJCXF-ZBXqoje"
                        name="Minimalist Overcoat"
                        price="$189.00"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCa9p6UMCEJh9rVj9G4Rg2lx48eXO4D1jIATm7dXESXodGmfAHIp7PzBohi1Jj3NdKp9IVYMwow6-iPy-3AN46rvPtPBpMeV5V7yaueOFAupcMnxJ8afg3OfibJZf4M_9tsMeYA-CbP15KbyyN_H5EofCDOUThB4ZRAJMA9MiC9MeXssqIcXrzRCD_6iyrDD91CvT-pry44uSDYb5uzb7cjt0CZucb_rdirr-65XmMuwAPOfDUqnO4lRET91yoXNt6ZL2Jrp0m6yLpC"
                        name="Wide Leg Trousers"
                        price="$95.00"
                    />
                </View>

                {/* Row 2 */}
                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBZFMRz9TAItu4WXv2pj0nSw1pKgdziQPEz-RVmMDkfjCRIvKN_i85aNTp5s-SdyMP_8S8EfrPpo9QEjOuQjTEIcnJ3w2WdEmOQuJAgVOdltytHK66I9tVY89ELUZ26IC6KIJ9bFTb_AoBotiBA0xYlB4sDBWBAjOxxQiH0wrEj11P76Ajudz_k3cHAKHrYwUHM0JSB2AQz4kV9XD6vmZwKBnUV6z9mlQemQQ3cSac-ZyhO5Llq-hQ_ouvTwNgKA0oAFOT7SZ73GF4z"
                        name="Classic Wool Blazer"
                        price="$220.00"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAF8hw-LJJ8qX35tn07QFDeH7komT0Vstj8zCUtzSuA5LTVvxXI1Pyk1akJX2VR-vNdtK3hxqsGSyISS5qKlBXDzKhV1nQPOUlC9Q5xktBatB_CkmQmsrc80OPVJNmlDSOj8ijkVGQyDvo5Vji2w0E9Filb2zQkihGyqzTs3Ay7BFgCzo9To3N-Pz2R3kYZcQysgNDoWsY_zPsaj9dqNH6iHLg2MgIzCiWWaEGcLNdfcO6cs3ff3UN_dsHIgFqiTgrHXGPMx6FtlwFl"
                        name="Silk Blend Camisole"
                        price="$65.00"
                    />
                </View>

                {/* Row 3 */}
                <View style={styles.gridRow}>
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCq0TsY6aU6rht-ACAp8ehGVbi4BDcZoHzCH_iutfXapEYOMMEV4QA4bcL7tiiNJMnJAnjcX-JjuOdpFnYu21X70ydGpI0CuHXb0qiMGswephPOG7aNVxqF8iMBP_On7B37BAsycsRjcIyUcLrwBS0E6SS6i0LW6-bzSSI2Ngb2qdYqt9rWcFPDpeMbDq1IBpxgs4vw9FakrKthcQQJPdmR7iYfR_x8QGS30hQXLTvSZ0BRD5R9dHI9diiL0eYJRDzz2te60jX39FqM"
                        name="Camel Chinos"
                        price="$110.00"
                    />
                    <ProductCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuA-hOwVADeIZ-eTtaReG8Prl0g22XK38yT6qI4jGW7X5LkxMuGRFW4dMYFgC8MeISDsdxFM7bQ_fBnFDJBvy6EyUETAXYt0L_xfox_T731XM24qiCvWusIqQTL3Jmv6LTTHCB8syIBBldYq6yp8r4PEdAs17KMaynKXMEfDld7pISQvKTEeiJv2DQfSX73xAKQ2OalsU9GCtBbRIl0Ijd5Q2ey6ykcrUvgJ0yhTkUuqQRjqM9demnD4TPE2VTUJp6d-AhmXWN6hGV9X"
                        name="Soft Cashmere Knit"
                        price="$155.00"
                    />
                </View>
            </View>

            {/* Sale Banner */}
            <View style={styles.saleBannerContainer}>
                <LinearGradient
                    colors={['#1a1a1a', '#e1bc5d', '#c69b3a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0.3, 0.31, 1]}
                    style={styles.saleBanner}
                >
                    <Text style={styles.saleTextLeft}>SUMMER CLEARANCE</Text>
                    <View style={styles.saleBadge}>
                        <MaterialIcons name="local-offer" size={14} color="#e1bc5d" />
                        <Text style={styles.saleTextRight}>SHOP SALE</Text>
                    </View>
                </LinearGradient>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const ProductCard = ({ image, name, price }: any) => (
    <View style={styles.card}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.productImage} resizeMode="cover" />
            <TouchableOpacity style={styles.cartBtn}>
                <MaterialIcons name="shopping-cart" size={16} color="#e1bc5d" />
            </TouchableOpacity>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
        <Text style={styles.cardPrice}>{price}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdfaf6', // background-light
    },
    contentContainer: {
        paddingBottom: 40,
    },
    // Header
    header: {
        paddingVertical: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    backButton: {
        position: 'absolute',
        top: 60, // Fallback, but padding handles safe area mostly. 
        // Actually relying on padding from header might be better, lets check previous change.
        // The previous change added paddingTop: insets.top. 
        // If we use position absolute, we need to be careful.
        // Let's place it relatively or absolute within header.
        left: 24,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    leafDecoration: {
        position: 'absolute',
        top: 0,
        right: -20,
        opacity: 0.15,
        zIndex: 0,
    },
    skewedImagesContainer: {
        flexDirection: 'row',
        gap: 4,
        height: 256,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    skewedImageWrapper: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f5ece5',
        transform: [{ skewX: '-6deg' }],
    },
    skewedImage: {
        width: '100%',
        height: '100%',
        transform: [{ skewX: '6deg' }, { scale: 1.1 }], // Counter skew inner image
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    subTitle: {
        fontSize: 10,
        color: '#6b7280', // gray-500
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 4,
        fontWeight: '500',
    },
    mainTitle: {
        fontSize: 32,
        color: '#8d6e63', // primary
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: '300', // Light font weight for aesthetic feel
        marginBottom: 8,
    },
    divider: {
        width: 48,
        height: 1,
        backgroundColor: 'rgba(141, 110, 99, 0.3)', // primary/30
    },
    // Filter Bar
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    itemCount: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
    },
    filterActions: {
        flexDirection: 'row',
        gap: 16,
    },
    filterAction: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 2,
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
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
        marginBottom: 12,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    cartBtn: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#1f2937',
        marginBottom: 2,
    },
    cardPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8d6e63', // primary
    },
    // Sale Banner
    saleBannerContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
    },
    saleBanner: {
        flexDirection: 'row',
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 4,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saleTextLeft: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    saleBadge: {
        backgroundColor: '#1a1a1a',
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    saleTextRight: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
