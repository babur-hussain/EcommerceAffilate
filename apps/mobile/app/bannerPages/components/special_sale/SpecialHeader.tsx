import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface SpecialHeaderProps {
    data: {
        title_main: string;
        title_sub: string;
        badge_text: {
            top: string;
            middle: string;
            bottom: string;
        };
        images: string[];
    };
}

export default function SpecialHeader({ data }: SpecialHeaderProps) {
    const router = useRouter();
    const float1 = useSharedValue(0);
    const float2 = useSharedValue(0);
    const float3 = useSharedValue(0);

    useEffect(() => {
        float1.value = withRepeat(withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
        float2.value = withDelay(1000, withRepeat(withTiming(-10, { duration: 2400, easing: Easing.inOut(Easing.ease) }), -1, true));
        float3.value = withDelay(500, withRepeat(withTiming(-8, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true));
    }, []);

    const animStyle1 = useAnimatedStyle(() => ({ transform: [{ translateY: float1.value }] }));
    const animStyle2 = useAnimatedStyle(() => ({ transform: [{ translateY: float2.value }] }));
    const animStyle3 = useAnimatedStyle(() => ({ transform: [{ translateY: float3.value }] }));

    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Top Bar Overlay */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <MaterialIcons name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search for electronics..."
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        style={styles.searchInput}
                    />
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.iconBtn}>
                    <MaterialIcons name="shopping-cart" size={24} color="white" />
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <LinearGradient
                colors={['#8B0000', '#D32F2F', '#FF5252']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Background Decorations */}
                <Text style={[styles.bgDeco, { top: 20, left: 20, fontSize: 24 }]}>✦</Text>
                <Text style={[styles.bgDeco, { top: 40, right: 30, fontSize: 20 }]}>★</Text>
                <View style={[styles.bgLine, { bottom: 80, left: 40 }]} />

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.textBlock}>
                        <Text style={styles.titleMain}>{data.title_main}</Text>
                        <Text style={styles.titleSub}>{data.title_sub}</Text>
                    </View>

                    {/* Discount Badge */}
                    <View style={styles.discountBadge}>
                        <Text style={styles.badgeSmall}>{data.badge_text.top}</Text>
                        <Text style={styles.badgeLarge}>{data.badge_text.middle}</Text>
                        <Text style={styles.badgeSmall}>{data.badge_text.bottom}</Text>
                    </View>

                    {/* Floating Images */}
                    <View style={styles.imageArea}>
                        <View style={styles.pedestalLarge} />
                        <View style={styles.pedestalSmall} />

                        {data.images[0] && (
                            <Animated.Image
                                source={{ uri: data.images[0] }}
                                style={[styles.mainImage, animStyle1]}
                            />
                        )}
                        {data.images[1] && (
                            <Animated.Image
                                source={{ uri: data.images[1] }}
                                style={[styles.floatImageLeft, animStyle2]}
                            />
                        )}
                        {data.images[2] && (
                            <Animated.Image
                                source={{ uri: data.images[2] }}
                                style={[styles.floatImageRight, animStyle3]}
                            />
                        )}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60, // Increased for better safe area coverage
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#D32F2F', // match gradient start roughly
    },
    iconBtn: {
        padding: 8,
        borderRadius: 20,
    },
    searchBar: {
        flex: 1,
        marginHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 36,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 14,
        fontFamily: 'Roboto_400Regular',
    },
    cartBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
    gradient: {
        paddingTop: 130, // Increased further to clear top bar
        paddingBottom: 48,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
    },
    bgDeco: {
        position: 'absolute',
        color: '#FFD700',
        opacity: 0.4,
    },
    bgLine: {
        position: 'absolute',
        width: 8,
        height: 32,
        backgroundColor: '#FFD700',
        transform: [{ rotate: '45deg' }],
        opacity: 0.4,
    },
    content: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    textBlock: {
        alignItems: 'center',
        marginBottom: 16,
    },
    titleMain: {
        fontFamily: 'Anton_400Regular',
        fontSize: 72, // 6xl approx
        color: '#FFD700', // Gold
        lineHeight: 72,
        textShadowColor: '#8B0000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    titleSub: {
        fontFamily: 'Anton_400Regular',
        fontSize: 36, // 4xl approx
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 2,
        transform: [{ rotate: '-2deg' }],
        marginTop: -8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    discountBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        transform: [{ rotate: '12deg' }],
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 20,
    },
    badgeSmall: {
        fontSize: 8,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#D32F2F',
    },
    badgeLarge: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#D32F2F',
        lineHeight: 20,
    },
    imageArea: {
        marginTop: 32,
        width: 200,
        height: 180,
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
    },
    pedestalLarge: {
        position: 'absolute',
        bottom: 0,
        width: 192,
        height: 48,
        backgroundColor: '#111827', // gray-900
        borderTopWidth: 4,
        borderTopColor: '#FFD700',
        borderRadius: 96, // roughly 100% css
        zIndex: 0,
        transform: [{ scaleX: 1 }],
    },
    pedestalSmall: {
        position: 'absolute',
        bottom: 16,
        width: 160, // w-40
        height: 32, // h-8
        backgroundColor: '#1F2937', // gray-800
        borderTopWidth: 2,
        borderTopColor: '#FFD700',
        borderRadius: 80,
        zIndex: 0,
    },
    mainImage: {
        width: 160,
        height: 120,
        resizeMode: 'contain',
        zIndex: 10,
        marginBottom: 16,
    },
    floatImageLeft: {
        position: 'absolute',
        left: 0,
        bottom: 40,
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 20,
    },
    floatImageRight: {
        position: 'absolute',
        right: 0,
        bottom: 50,
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 20,
    }
});
