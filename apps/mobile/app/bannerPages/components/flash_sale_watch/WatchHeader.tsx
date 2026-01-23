
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated, Easing, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const WatchHeader = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme Colors
    const colors = {
        primary: "#D32F2F", // Red
        gold400: "#FFEE58",
        gold500: "#FFD700",
        gold900: "#B8860B",
        bgDark: "#050505",
        bgLight: "#FAFAFA",
        textWhite: "#FFFFFF",
    };

    // Animations
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Background Pattern Simulation */}
            <Image
                source={{ uri: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop" }}
                style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}
                resizeMode="cover"
            />

            {/* Dark Gradient Overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(66, 39, 9, 0.4)', 'rgba(0,0,0,0.95)']}
                style={StyleSheet.absoluteFill}
            />

            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.navRight}>
                    <TouchableOpacity style={styles.navBtn}>
                        <MaterialIcons name="favorite-border" size={24} color={colors.gold400} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.navBtn}>
                        <MaterialIcons name="shopping-cart" size={24} color="white" />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Floating Price Tag 1 */}
                <Animated.View style={[styles.priceTag, styles.priceTagTop, { transform: [{ translateY: floatAnim }] }]}>
                    <Text style={styles.priceSymbol}>$</Text>
                </Animated.View>

                {/* Floating Price Tag 2 */}
                <Animated.View style={[styles.priceTag, styles.priceTagBottom, { transform: [{ translateY: floatAnim }] }]}>
                    <Text style={[styles.priceSymbol, { fontSize: 14 }]}>$</Text>
                </Animated.View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>FLASH</Text>
                    <Text style={[styles.titleText, { color: colors.gold500 }]}>SALE</Text>
                    <View style={styles.subtitleBadge}>
                        <Text style={styles.subtitleText}>LIMITED TIME OFFER</Text>
                    </View>
                </View>

                {/* Watch Image Showcase */}
                <View style={styles.showcase}>
                    {/* Glow Effect */}
                    <View style={styles.glow} />
                    {/* Pedestal Base */}
                    <LinearGradient
                        colors={['#1F2937', '#9CA3AF', '#111827']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.pedestal}
                    />

                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD9I71hcr64vOA_XB6CUmWOCZY7Hy7_ARDqaqW-uJIaWiQ_EeQk3MBBgUw6HLsqY1XEpzRcjMQ5eBj6qcjYfGdfOCOR7glVW1vvM9up_wPmFXBHvLpeEyx0d_JElr28A2Vu-TAPImkAM-VZEnpEGDL9eJPmb4-vvgFeFI4InonWP3kUtcVr1M0ICZ6EHqYi04a04OFM1nZoEj2d1z9oJbycMgcUUJoIM-yRrdoWEb4o6TJvyQsVGqaNs7KHxclPVaG-8V4ThkbRDfp" }}
                        style={styles.watchImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Discount Badge Glassmorphism */}
                <View style={[styles.glassBadge, { borderColor: colors.gold400 }]}>
                    <Text style={styles.glassTextSmall}>UP TO</Text>
                    <Text style={[styles.glassTextLarge, { color: colors.gold500 }]}>50%</Text>
                    <Text style={styles.glassTextTiny}>DISCOUNT</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 480,
        backgroundColor: '#050505',
        position: 'relative',
        overflow: 'hidden',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 50, // Safe area
        position: 'relative',
        zIndex: 20,
    },
    navBtn: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 8,
        borderRadius: 999,
    },
    navRight: {
        flexDirection: 'row',
        gap: 12,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 10,
        height: 10,
        backgroundColor: '#D32F2F',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -40,
        position: 'relative',
        zIndex: 10,
    },
    priceTag: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(253, 224, 71, 0.9)', // yellow-300 gradient ish
        borderWidth: 1,
        borderColor: '#FEF08A',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    priceTagTop: {
        top: 80,
        left: 20,
        width: 32,
        height: 32,
    },
    priceTagBottom: {
        bottom: 120,
        right: 24,
        width: 40,
        height: 40,
    },
    priceSymbol: {
        color: '#713F12', // yellow-900
        fontWeight: 'bold',
        fontSize: 12,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 8,
        transform: [{ rotate: '-2deg' }],
    },
    titleText: {
        fontSize: 50, // text-6xl
        fontWeight: '900',
        fontStyle: 'italic',
        color: 'white',
        lineHeight: 50,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    subtitleBadge: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginTop: 8,
    },
    subtitleText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2, // tracking-widest
        textTransform: 'uppercase',
    },
    showcase: {
        width: 192, // w-48
        height: 192,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    glow: {
        position: 'absolute',
        inset: 0,
        borderRadius: 999,
        backgroundColor: '#FFD700',
        opacity: 0.2,
        transform: [{ scale: 1.2 }],
    },
    pedestal: {
        position: 'absolute',
        bottom: 0,
        width: 160,
        height: 40,
        borderRadius: 100, // rounded-[100%]
        borderTopWidth: 2,
        borderColor: '#FFD700',
    },
    watchImage: {
        width: 128, // w-32
        height: 128,
        transform: [{ rotate: '-12deg' }],
    },
    glassBadge: {
        position: 'absolute',
        top: '50%',
        right: 16,
        transform: [{ translateY: -40 }, { rotate: '6deg' }],
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    glassTextSmall: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    glassTextLarge: {
        fontSize: 24,
        fontWeight: '900',
        fontStyle: 'italic',
    },
    glassTextTiny: {
        color: 'white',
        fontSize: 8, // text-[10px]
        letterSpacing: 1,
    },
});

export default WatchHeader;
