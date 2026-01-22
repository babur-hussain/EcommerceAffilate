import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface FlashHeaderProps {
    data: {
        title_top: string;
        title_bottom: string;
        subtitle: string;
        discount_text: {
            prefix: string;
            value: string;
            suffix: string;
        };
        image_url: string;
    };
}

export default function FlashHeader({ data }: FlashHeaderProps) {
    const float1 = useSharedValue(0);
    const float2 = useSharedValue(0);

    useEffect(() => {
        float1.value = withRepeat(withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
        float2.value = withDelay(1000, withRepeat(withTiming(-10, { duration: 3500, easing: Easing.inOut(Easing.ease) }), -1, true));
    }, []);

    const animStyle1 = useAnimatedStyle(() => ({ transform: [{ translateY: float1.value }] }));
    const animStyle2 = useAnimatedStyle(() => ({ transform: [{ translateY: float2.value }] }));

    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Background Image & Overlay */}
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop' }}
                style={styles.bgImage}
                resizeMode="cover"
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(66, 32, 6, 0.4)', 'rgba(0,0,0,0.9)']}
                style={styles.gradient}
            />

            {/* Nav Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.blurBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.navRight}>
                    <TouchableOpacity style={styles.blurBtn}>
                        <MaterialIcons name="favorite-border" size={24} color="#FFEE58" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.blurBtn}>
                        <MaterialIcons name="shopping-cart" size={24} color="white" />
                        <View style={styles.dot} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Floating Coins */}
                <Animated.View style={[styles.coin, { top: 80, left: 16 }, animStyle1]}>
                    <Text style={styles.coinText}>$</Text>
                </Animated.View>
                <Animated.View style={[styles.coin, { bottom: 120, right: 24, width: 40, height: 40 }, animStyle2]}>
                    <Text style={styles.coinText}>$</Text>
                </Animated.View>

                {/* Text Block */}
                <View style={styles.textBlock}>
                    <Text style={styles.titleTop}>{data.title_top}</Text>
                    <Text style={styles.titleBottom}>{data.title_bottom}</Text>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>{data.subtitle}</Text>
                    </View>
                </View>

                {/* Hero Image Block */}
                <View style={styles.heroBlock}>
                    <View style={styles.pedestalGlow} />
                    <View style={styles.pedestalBase} />
                    <Image source={{ uri: data.image_url }} style={styles.heroImage} />
                </View>

                {/* Floating Discount Card */}
                <View style={styles.discountCard}>
                    <Text style={styles.discountPrefix}>{data.discount_text.prefix}</Text>
                    <Text style={styles.discountValue}>{data.discount_text.value}</Text>
                    <Text style={styles.discountSuffix}>{data.discount_text.suffix}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 480,
        position: 'relative',
        backgroundColor: '#050505',
    },
    bgImage: {
        ...StyleSheet.absoluteFillObject,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 48,
        paddingHorizontal: 24,
        zIndex: 20,
    },
    blurBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navRight: {
        flexDirection: 'row',
        gap: 12,
    },
    dot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D32F2F',
        borderWidth: 1,
        borderColor: 'black',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -40,
    },
    coin: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FBC02D', // gold-600
        borderWidth: 1,
        borderColor: '#FFF9C4', // gold-100
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        opacity: 0.8,
        zIndex: 10,
    },
    coinText: {
        color: '#F57F17', // gold-800
        fontWeight: 'bold',
        fontSize: 12,
    },
    textBlock: {
        alignItems: 'center',
        marginBottom: 16,
        transform: [{ rotate: '-2deg' }],
    },
    titleTop: {
        fontFamily: 'Anton_400Regular',
        fontSize: 60,
        lineHeight: 60,
        color: 'white',
        fontStyle: 'italic',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    titleBottom: {
        fontFamily: 'Anton_400Regular',
        fontSize: 60,
        lineHeight: 60,
        color: '#FFEE58', // gold-400
        fontStyle: 'italic',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    subtitleContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginTop: 8,
    },
    subtitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    heroBlock: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 16,
    },
    pedestalGlow: {
        position: 'absolute',
        width: 200,
        height: 200,
        backgroundColor: '#FFD700',
        opacity: 0.2,
        borderRadius: 100,
        zIndex: 0,
    },
    pedestalBase: {
        position: 'absolute',
        bottom: 20,
        width: 160,
        height: 40,
        backgroundColor: '#1F2937', // gray-800
        borderRadius: 80, // roughly oval
        borderTopWidth: 2,
        borderTopColor: '#FFD700',
        zIndex: 0,
        transform: [{ scaleY: 0.5 }],
    },
    heroImage: {
        width: 140,
        height: 180,
        resizeMode: 'contain',
        zIndex: 10,
        transform: [{ rotate: '-12deg' }],
    },
    discountCard: {
        position: 'absolute',
        top: '50%',
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFEE58', // gold-400
        alignItems: 'center',
        transform: [{ translateY: -40 }, { rotate: '6deg' }],
        zIndex: 30,
    },
    discountPrefix: {
        color: 'white',
        fontSize: 10, // xs
        fontWeight: 'bold',
    },
    discountValue: {
        fontFamily: 'Anton_400Regular',
        fontSize: 24,
        color: '#FFEE58', // gold-400
        fontStyle: 'italic',
    },
    discountSuffix: {
        color: 'white',
        fontSize: 8, // xxs
        letterSpacing: 1,
    }
});
