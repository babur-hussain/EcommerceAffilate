import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface MegaHeaderProps {
    data: {
        title_main: string;
        title_sub: string;
        title_sub_highlight: string;
        subtitle: string;
        discount_percent: string;
        images: string[];
    };
}

const FlashingDot = ({ delay }: { delay: number }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withDelay(delay, withRepeat(
            withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        ));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <View style={styles.dotContainer}>
            <Animated.View style={[styles.dot, animatedStyle]} />
        </View>
    );
};

export default function MegaHeader({ data }: MegaHeaderProps) {
    const bounce1 = useSharedValue(0);
    const bounce2 = useSharedValue(0);
    const bounce3 = useSharedValue(0);

    useEffect(() => {
        bounce1.value = withRepeat(withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
        bounce2.value = withDelay(500, withRepeat(withTiming(-10, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true));
        bounce3.value = withDelay(1000, withRepeat(withTiming(-10, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true));
    }, []);

    const animImg1 = useAnimatedStyle(() => ({ transform: [{ translateY: bounce1.value }, { rotate: '-12deg' }] }));
    const animImg2 = useAnimatedStyle(() => ({ transform: [{ translateY: bounce2.value }, { rotate: '12deg' }] }));
    const animImg3 = useAnimatedStyle(() => ({ transform: [{ translateY: bounce3.value }, { rotate: '-6deg' }] }));

    if (!data) return null;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#7f1d1d', '#dc2626', '#f97316']}
                style={styles.gradient}
            >
                {/* Marquee Dots */}
                <View style={styles.marquee}>
                    {[0, 75, 150, 300, 100, 500].map((d, i) => <FlashingDot key={i} delay={d} />)}
                </View>

                {/* Decorative Elements */}
                <View style={[styles.decoElement, { top: 40, left: 16 }]}>
                    <MaterialIcons name="bolt" size={48} color="#FACC15" style={{ transform: [{ rotate: '12deg' }] }} />
                </View>
                <View style={[styles.decoElement, { top: 80, right: 16 }]}>
                    <MaterialIcons name="bolt" size={64} color="#FACC15" style={{ transform: [{ rotate: '-12deg' }] }} />
                </View>

                {/* Hero Text */}
                <View style={styles.textContainer}>
                    <View style={styles.promoRow}>
                        <MaterialIcons name="campaign" size={40} color="#FDE047" style={{ transform: [{ rotate: '-20deg' }] }} />
                        <Text style={styles.titleMain}>{data.title_main}</Text>
                        <MaterialIcons name="campaign" size={40} color="#FDE047" style={{ transform: [{ rotate: '20deg' }] }} />
                    </View>
                    <Text style={styles.titleSub}>
                        {data.title_sub}{'\n'}
                        <Text style={styles.titleHighlight}>{data.title_sub_highlight}</Text>
                    </Text>
                </View>

                <Text style={styles.subtitle}>{data.subtitle}</Text>

                {/* Floating Images & Card */}
                <View style={styles.imagesArea}>
                    {data.images[0] && (
                        <Animated.Image source={{ uri: data.images[0] }} style={[styles.floatImg, { left: -16, top: 0, width: 64, height: 64 }, animImg1]} />
                    )}
                    {data.images[1] && (
                        <Animated.Image source={{ uri: data.images[1] }} style={[styles.floatImg, { right: -24, top: 40, width: 80, height: 80 }, animImg2]} />
                    )}
                    {data.images[2] && (
                        <Animated.Image source={{ uri: data.images[2] }} style={[styles.floatImg, { left: -8, bottom: 16, width: 48, height: 80 }, animImg3]} />
                    )}

                    {/* Discount Card */}
                    <View style={styles.discountCard}>
                        <View style={styles.ribbonVertical} />
                        <View style={styles.ribbonHorizontal} />
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>DISCOUNT</Text>
                            <Text style={styles.cardPercent}>{data.discount_percent}<Text style={{ fontSize: 30 }}>%</Text></Text>
                            <Text style={styles.cardOff}>OFF</Text>
                        </View>
                        <View style={styles.iconGift}>
                            <MaterialIcons name="card-giftcard" size={48} color="#dc2626" />
                        </View>
                    </View>
                </View>

                {/* CTA Button */}
                <TouchableOpacity style={styles.ctaButton}>
                    <Text style={styles.ctaText}>SHOP NOW</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>

            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        borderRadius: 48,
        overflow: 'hidden',
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        elevation: 10,
        backgroundColor: '#dc2626',
    },
    gradient: {
        paddingTop: 48,
        paddingBottom: 80,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    marquee: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute',
        top: 0,
        paddingTop: 8,
    },
    dotContainer: {
        width: 4,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FEF08A', // yellow-200
        marginBottom: -6,
        shadowColor: 'yellow',
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    decoElement: {
        position: 'absolute',
        zIndex: 0,
    },
    textContainer: {
        transform: [{ rotate: '-2deg' }],
        alignItems: 'center',
        marginTop: 24,
        zIndex: 10,
    },
    promoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    titleMain: {
        fontFamily: 'Anton_400Regular',
        fontSize: 72,
        color: '#FFD700', // Gold
        textShadowColor: 'black',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 1,
    },
    titleSub: {
        fontFamily: 'Anton_400Regular',
        fontSize: 60,
        color: '#FFD700',
        lineHeight: 60,
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 1,
        fontStyle: 'italic', // simulated
    },
    titleHighlight: {
        fontSize: 48,
    },
    subtitle: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
        marginTop: 16,
        maxWidth: 240,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    imagesArea: {
        marginTop: 32,
        width: 200, // specific width context
        height: 200, // rough height
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    floatImg: {
        position: 'absolute',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 20,
    },
    discountCard: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 8,
        transform: [{ rotate: '1deg' }],
        borderBottomWidth: 8,
        borderBottomColor: '#E5E7EB',
        zIndex: 10,
        elevation: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    ribbonVertical: {
        position: 'absolute',
        top: 0,
        left: '50%',
        marginLeft: -16,
        width: 32,
        height: '100%',
        backgroundColor: 'rgba(220, 38, 38, 0.9)', // red
    },
    ribbonHorizontal: {
        position: 'absolute',
        top: '50%',
        marginTop: -12, // half height
        left: 0,
        width: '100%',
        height: 24,
        backgroundColor: 'rgba(220, 38, 38, 0.9)',
    },
    iconGift: {
        position: 'absolute',
        top: -24,
        left: '50%',
        marginLeft: -24,
        zIndex: 20,
    },
    cardContent: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        zIndex: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    cardPercent: {
        fontFamily: 'Anton_400Regular',
        fontSize: 60, // 8xl
        color: '#111827',
        lineHeight: 60,
    },
    cardOff: {
        fontFamily: 'Anton_400Regular',
        fontSize: 30, // 4xl
        color: '#111827',
        marginTop: -8,
    },
    ctaButton: {
        position: 'absolute',
        bottom: -24, // pull down
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#b91c1c', // red-700
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#f87171', // red-400
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        gap: 8,
    },
    ctaText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
