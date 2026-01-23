
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated, Easing, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const CyberHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme Colors
    const colors = {
        primary: "#D9242C", // Bold Red
        secondary: "#FFCB05", // Bold Yellow
        accent: "#2A7FFF", // Blue
        darkblock: "#0F172A", // Deep black/blue
        textLight: "#FFFFFF",
        textDark: "#000000",
        backgroundLight: "#F8FAFC",
        backgroundDark: "#0B0B0B"
    };

    // Animations
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 6000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.container}>
            {/* Top Bar for Nav mimic */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>POP SHOP</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.bagButton}>
                    <MaterialIcons name="shopping-bag" size={24} color={colors.secondary} />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Header Content */}
            <View style={styles.headerContent}>
                {/* Floating Elements */}
                <Animated.View style={[styles.floatIcon, styles.boltIcon, { transform: [{ scale: pulseAnim }] }]}>
                    <MaterialCommunityIcons name="lightning-bolt" size={32} color={colors.primary} />
                </Animated.View>

                <Animated.View style={[styles.floatIcon, styles.flowerIcon, { transform: [{ rotate: spin }] }]}>
                    <MaterialIcons name="local-florist" size={32} color={colors.accent} />
                </Animated.View>

                {/* Main Titles */}
                <View style={styles.titleContainer}>
                    <View style={styles.titleRow}>
                        {/* Text Stroke Simulation for CYBER */}
                        <Text style={[styles.titleText, styles.strokeText, { color: colors.darkblock, transform: [{ rotate: '-2deg' }] }]}>CYBER</Text>
                        <Text style={[styles.titleText, styles.frontText, { color: colors.secondary, transform: [{ rotate: '-2deg' }] }]}>CYBER</Text>
                    </View>

                    <View style={[styles.titleRow, { marginLeft: 16, marginTop: -10 }]}>
                        {/* Text Stroke Simulation for SALE */}
                        <Text style={[styles.titleText, styles.strokeText, { color: colors.darkblock, transform: [{ rotate: '1deg' }] }]}>SALE</Text>
                        <Text style={[styles.titleText, styles.frontText, { color: colors.primary, transform: [{ rotate: '1deg' }] }]}>SALE</Text>
                    </View>

                    {/* Zig Zag Decoration (Simulated with Text chars since SVG missing) */}
                    <View style={styles.zigZagContainer}>
                        <Text style={{ color: colors.secondary, fontSize: 32, fontWeight: 'bold', letterSpacing: -5 }}>
                            VVVVVV
                        </Text>
                    </View>
                </View>

                {/* Hero Image Section */}
                <View style={styles.heroImageSection}>
                    <View style={styles.imageFrame}>
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwwtEkfE5LZS0HGuf1i4bWzACl2OBWJjf53W_JKaL2yhoF2v30yKpDVGhvSOt8d5BOQfrGpQZ_U5qEdUFEXuZCeFK_hF8QRcDqzIMzKc26ylNWBZKf6HFcNFdrmzVv5rRJx6qWEC3NjFaW4aXu_sLXhUfNbHCAfGHW8YYGe41hoJYX-MIwgPdg7yVB23oGbbaFMSWXAHSOpsz-40iNIAnO6ieYa81od1nU0MXa4s9tpRK2V92eE9WGPRcR3B7aIHH7ozCfktdTd4Ye" }}
                            style={styles.heroImage}
                        />
                    </View>

                    {/* Discount Badge */}
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>UP TO <Text style={{ color: colors.secondary, textShadowColor: '#000', textShadowRadius: 1 }}>50%</Text></Text>
                    </View>

                    {/* Star Decoration */}
                    <View style={styles.starIcon}>
                        <MaterialCommunityIcons name="star-four-points" size={56} color={colors.secondary} style={{ textShadowColor: 'black', textShadowRadius: 1 }} />
                    </View>
                </View>
            </View>

            {/* Checker Strip */}
            <View style={styles.checkerStrip}>
                <View style={styles.checkerPattern} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        overflow: 'hidden',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 54, // Added space for status bar
        borderBottomWidth: 2,
        borderBottomColor: '#FFCB05',
        backgroundColor: '#000000',
        zIndex: 50,
    },
    menuButton: {
        padding: 4,
        borderRadius: 999,
    },
    topBarTitle: {
        fontSize: 24,
        fontWeight: '800', // tracking-wider
        color: '#FFCB05',
        letterSpacing: 1.5,
        // fontFamily: 'Bangers' // We don't have custom fonts loaded usually, stick to system bold
    },
    bagButton: {
        padding: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#D9242C',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    headerContent: {
        paddingTop: 32,
        paddingHorizontal: 16,
        paddingBottom: 40, // Space for image overhang
        position: 'relative',
    },
    floatIcon: {
        position: 'absolute',
        zIndex: 5,
    },
    boltIcon: {
        top: 16,
        left: 8,
    },
    flowerIcon: {
        top: 60,
        right: 24,
    },
    titleContainer: {
        marginBottom: 24,
        position: 'relative',
        zIndex: 10,
    },
    titleRow: {
        position: 'relative',
        height: 70, // Roughly matching text height
    },
    titleText: {
        fontSize: 80, // text-7xl / 8xl
        fontWeight: '900',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    frontText: {
        zIndex: 2,
    },
    strokeText: {
        zIndex: 1,
        textShadowColor: '#0F172A', // darkblock
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 0, // Hard shadow
        // textStroke is not standard RN, using shadow simulation
    },
    zigZagContainer: {
        position: 'absolute',
        top: '40%',
        left: -10,
        zIndex: 3,
    },
    heroImageSection: {
        alignItems: 'flex-end',
        marginTop: -40,
        marginRight: -20,
        position: 'relative',
        height: 220,
    },
    imageFrame: {
        width: 192, // w-48
        height: 192,
        backgroundColor: '#FDBA74',
        borderTopLeftRadius: 96, // rounded-t-full
        borderTopRightRadius: 96,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: 4,
        borderColor: 'black',
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        transform: [{ scale: 1.1 }, { translateY: 8 }]
    },
    discountBadge: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        backgroundColor: '#D9242C', // primary
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: 'black',
        transform: [{ rotate: '-3deg' }],
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
        zIndex: 20,
    },
    discountText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    starIcon: {
        position: 'absolute',
        bottom: 64,
        left: -32,
        zIndex: 20,
    },
    checkerStrip: {
        height: 24,
        backgroundColor: '#000',
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: 'black',
        overflow: 'hidden',
        flexDirection: 'row',
    },
    checkerPattern: {
        flex: 1,
        backgroundColor: '#FFCB05', // secondary
        // Pattern logic would be complex with just Views, 
        // simplifying to a solid yellow strip for stability or use SVG pattern if required
        // For MVP, bold yellow strip serves the visual divider purpose nicely
    }
});

export default CyberHeader;
