
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const BigPromoHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#F59E0B", // Amber-500
        primaryDark: "#D97706",
        backgroundLight: "#E0F2FE", // Sky-100
        backgroundDark: "#0F172A", // Slate-900
        cardLight: "#FFFFFF",
        cardDark: "#1E293B",
        brandBlue: "#0EA5E9",
        brandYellow: "#FDBA74",
        textLight: "#1E293B", // Slate-800
        textDark: "#F1F5F9", // Slate-100
    };

    // Animation values
    const floatAnim = useRef(new Animated.Value(0)).current;
    const floatDelayedAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createFloatAnimation = (anim: Animated.Value, delay: number = 0) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: -10,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                        delay: delay
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    })
                ])
            );
        };

        createFloatAnimation(floatAnim, 0).start();
        createFloatAnimation(floatDelayedAnim, 1500).start();
    }, []);

    const {
        mainTitle1 = "BIG",
        mainTitle2 = "PROMO",
        subtitle = "Electronic Products",
        discountText = "DISCOUNT UP TO 30% - 50% OFF"
    } = data || {};

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? colors.backgroundDark : colors.backgroundLight }]}>
            {/* Background Blobs */}
            <View style={[styles.blob, styles.blobBlue, { backgroundColor: isDarkMode ? 'rgba(30, 58, 138, 0.2)' : 'rgba(191, 219, 254, 0.5)' }]} />
            <View style={[styles.blob, styles.blobOrange, { backgroundColor: isDarkMode ? 'rgba(124, 45, 18, 0.2)' : 'rgba(254, 215, 170, 0.5)' }]} />

            {/* Cloud Icons */}
            <View style={[styles.cloud, styles.cloud1]}>
                <MaterialIcons name="cloud" size={140} color={isDarkMode ? 'rgba(30, 41, 59, 0.2)' : 'rgba(255, 255, 255, 0.4)'} />
            </View>
            <View style={[styles.cloud, styles.cloud2]}>
                <MaterialIcons name="cloud" size={180} color={isDarkMode ? 'rgba(30, 41, 59, 0.2)' : 'rgba(255, 255, 255, 0.6)'} />
            </View>

            {/* Header Content */}
            <View style={styles.content}>
                {/* Floating Elements */}
                <Animated.View style={[styles.floatIcon, styles.boltIcon, { transform: [{ translateY: floatAnim }] }]}>
                    <MaterialIcons name="bolt" size={48} color={colors.primary} />
                </Animated.View>

                <Animated.View style={[styles.floatIcon, styles.bellIcon, { transform: [{ translateY: floatDelayedAnim }] }]}>
                    <MaterialIcons name="notifications-active" size={48} color={colors.primary} />
                    <View style={styles.notificationBadge}>
                        <Text style={styles.badgeText}>%</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.floatIcon, styles.tagIcon, { transform: [{ translateY: floatDelayedAnim }] }]}>
                    <MaterialIcons name="local-offer" size={36} color={isDarkMode ? '#2563EB' : '#60A5FA'} />
                </Animated.View>

                {/* Main Titles */}
                <View style={styles.titleContainer}>
                    <View style={styles.titleWrapper}>
                        {/* Stroke simulation (CSS text-stroke is limited in RN) */}
                        <Text style={[styles.mainTitle, styles.titleStroke, { color: colors.brandBlue }]}>{mainTitle1}</Text>
                        <Text style={[styles.mainTitle, styles.titleFront, { color: colors.primary }]}>{mainTitle1}</Text>
                        {/* 3D Effect Shadow */}
                        <Text style={[styles.mainTitle, styles.titleShadow, { color: '#C2410C' }]}>{mainTitle1}</Text>
                    </View>

                    <View style={[styles.titleWrapper, styles.titleOffset]}>
                        <Text style={[styles.mainTitle, styles.titleStroke, { color: colors.brandBlue }]}>{mainTitle2}</Text>
                        <Text style={[styles.mainTitle, styles.titleFront, { color: '#FFFFFF' }]}>{mainTitle2}</Text>
                        <Text style={[styles.mainTitle, styles.titleShadow, { color: '#0369A1' }]}>{mainTitle2}</Text>
                    </View>
                </View>

                <Text style={[styles.subtitle, { color: isDarkMode ? '#FDE047' : '#FACC15', textShadowColor: '#000', textShadowRadius: 2 }]}>
                    {subtitle}
                </Text>

                <View style={[styles.discountBadge, { backgroundColor: colors.primary, borderColor: '#C2410C' }]}>
                    <Text style={styles.discountText}>{discountText}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    blob: {
        position: 'absolute',
        borderRadius: 999,
    },
    blobBlue: {
        width: 384,
        height: 384,
        top: -80,
        left: -80,
    },
    blobOrange: {
        width: 288,
        height: 288,
        top: 160,
        right: -80,
    },
    cloud: {
        position: 'absolute',
    },
    cloud1: {
        top: 40,
        left: 40,
        transform: [{ rotate: '12deg' }],
    },
    cloud2: {
        top: 128,
        right: -20,
        transform: [{ rotate: '-6deg' }],
    },
    content: {
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
    },
    floatIcon: {
        position: 'absolute',
        zIndex: 20,
    },
    boltIcon: {
        top: 20,
        left: 20,
        transform: [{ rotate: '-12deg' }],
    },
    bellIcon: {
        top: 10,
        right: 20,
        transform: [{ rotate: '12deg' }],
    },
    tagIcon: {
        bottom: 80,
        left: 10,
        transform: [{ rotate: '45deg' }],
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#3B82F6',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    titleContainer: {
        marginBottom: 8,
        alignItems: 'center',
    },
    titleWrapper: {
        position: 'relative',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
    },
    mainTitle: {
        fontSize: 72,
        fontWeight: '900',
        position: 'absolute',
        textAlign: 'center',
    },
    titleFront: {
        zIndex: 2,
    },
    titleStroke: {
        zIndex: 1,
        // React Native doesn't support -webkit-text-stroke. 
        // We can simulate or just use the color provided for now.
        // For accurate stroke, we'd need SVGs or external libs.
        // Using a slight offset/shadow hack for visibility if needed, 
        // but the design asks for stroke. 
        // We will just place it behind for now, mimicking standard layering.
        textShadowColor: '#0EA5E9',
        textShadowRadius: 4,
    },
    titleShadow: {
        zIndex: 0,
        top: 4,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 8 },
        textShadowRadius: 15,
    },
    titleOffset: {
        marginTop: -16,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '800', // Titan One-ish
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 24,
        marginTop: 8,
        textAlign: 'center',
    },
    discountBadge: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 999,
        borderBottomWidth: 4,
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    discountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    },
});

export default BigPromoHeader;
