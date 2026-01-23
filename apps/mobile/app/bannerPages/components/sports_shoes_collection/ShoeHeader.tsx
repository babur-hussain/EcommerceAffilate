
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ShoeHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#BE3A3B", // Red
        bgLight: "#F3F4F6",
        bgDark: "#111827",
    };

    return (
        <View style={styles.container}>
            {/* Top Navbar Area */}
            <View style={[styles.navbar, { backgroundColor: isDarkMode ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.9)' }]}>
                <View style={styles.navLeft}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="menu" size={24} color={isDarkMode ? '#D1D5DB' : '#4B5563'} />
                    </TouchableOpacity>
                    <Text style={[styles.brandText, { color: isDarkMode ? 'white' : '#111827' }]}>
                        SHOE<Text style={{ color: colors.primary }}>HUB</Text>
                    </Text>
                </View>
                <View style={styles.navRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="shopping-bag" size={24} color={isDarkMode ? '#D1D5DB' : '#4B5563'} />
                        <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: isDarkMode ? '#111827' : 'white' }]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="search" size={24} color={isDarkMode ? '#D1D5DB' : '#4B5563'} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Banner Content */}
            <View style={styles.bannerWrapper}>
                <LinearGradient
                    colors={['#758296', '#758296', '#AAB5DB', '#AAB5DB', '#4097AA', '#4097AA']}
                    locations={[0, 0.4, 0.4, 0.65, 0.65, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBg}
                />
                <View style={styles.overlay} />

                <View style={styles.content}>
                    <View style={styles.textContent}>
                        <Text style={styles.subHeader}>New Collection</Text>
                        <Text style={styles.mainHeader}>
                            SPORT{'\n'}SHOES
                        </Text>
                        <Text style={styles.tagline}>Buy now to get the discount</Text>
                        <TouchableOpacity style={[styles.shopBtn, { backgroundColor: colors.primary }]}>
                            <Text style={styles.shopBtnText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Discount Circle */}
                    <View style={[styles.discountCircle, { backgroundColor: colors.primary }]}>
                        <Text style={styles.discountUpTo}>Up To</Text>
                        <Text style={styles.discountValue}>40%</Text>
                        <Text style={styles.discountOff}>Off</Text>
                    </View>

                    {/* Shoe Image */}
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaFHqwqggV59dIitdqIw0XP5Lv35PIIa5Z5r3UUUPQYG_60_cnjyvghcdWW_0Ee0NjwRS_UI3xOhly-pZ3N5rweP15pu4stPkrJHj26shBTOQD_ecDsxrBbyQDigHQkELkXKRBSCj2EkMIX5PCrq2l-dkl_TiuEr7c8-GKXQ5Oqva0XxbfqGhM7yNMj3cXgu8WG4dh9a_S21ikXXIi2tIRrIY2g6RpgtB-taPxr_RkeWVhlhMY413eiCft-uRRnIBRqzT7Cr_558iw" }}
                        style={styles.shoeImage}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    navLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    navRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBtn: {
        padding: 4,
    },
    brandText: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
    },
    bannerWrapper: {
        height: 320,
        width: '100%',
        position: 'relative',
        marginBottom: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        position: 'relative',
    },
    textContent: {
        zIndex: 10,
    },
    subHeader: {
        fontFamily: 'serif', // System serif if custom fonts not loaded
        fontStyle: 'italic',
        fontSize: 24,
        color: 'white',
        marginBottom: 4,
    },
    mainHeader: {
        fontSize: 48, // 5xl
        fontWeight: '900', // black
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: -1, // tracking-lighter
        lineHeight: 44, // tight leading
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    tagline: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 24,
    },
    shopBtn: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    shopBtnText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    discountCircle: {
        position: 'absolute',
        top: 32,
        right: 24,
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.2)',
        zIndex: 20,
        transform: [{ rotate: '12deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    discountUpTo: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    discountValue: {
        color: 'white',
        fontSize: 30,
        fontWeight: '900',
        lineHeight: 30,
    },
    discountOff: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'serif',
        fontStyle: 'italic',
    },
    shoeImage: {
        position: 'absolute',
        bottom: -48,
        right: -48,
        width: 256,
        height: 256, // Approx based on w-64
        transform: [{ rotate: '-12deg' }],
        zIndex: 15,
        opacity: 0.9,
    },
});

export default ShoeHeader;
