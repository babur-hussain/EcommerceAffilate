import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface PromoHeaderProps {
    data: {
        title_big: string;
        title_promo: string;
        subtitle: string;
        discount_text: string;
    };
}

export default function PromoHeader({ data }: PromoHeaderProps) {
    // Shared Values for Floating Animation
    const float1 = useSharedValue(0);
    const float2 = useSharedValue(0);
    const float3 = useSharedValue(0);

    useEffect(() => {
        float1.value = withRepeat(
            withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        float2.value = withDelay(500, withRepeat(
            withTiming(-10, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        ));
        float3.value = withDelay(1000, withRepeat(
            withTiming(8, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        ));
    }, []);

    const animatedStyle1 = useAnimatedStyle(() => ({ transform: [{ translateY: float1.value }, { rotate: '-12deg' }] }));
    const animatedStyle2 = useAnimatedStyle(() => ({ transform: [{ translateY: float2.value }, { rotate: '12deg' }] }));
    const animatedStyle3 = useAnimatedStyle(() => ({ transform: [{ translateY: float3.value }, { rotate: '45deg' }] }));

    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Background Decorations */}
            <View style={[styles.blob, styles.blobBlue]} />
            <View style={[styles.blob, styles.blobOrange]} />

            <View style={styles.cloudLeft}>
                <MaterialIcons name="cloud" size={140} color="rgba(255,255,255,0.4)" />
            </View>
            <View style={styles.cloudRight}>
                <MaterialIcons name="cloud" size={180} color="rgba(255,255,255,0.6)" />
            </View>

            {/* Floating Icons */}
            <Animated.View style={[styles.floatingIcon, { top: 60, left: 24 }, animatedStyle1]}>
                <MaterialIcons name="bolt" size={48} color="#F59E0B" style={styles.dropShadow} />
            </Animated.View>

            <Animated.View style={[styles.floatingIcon, { top: 40, right: 24 }, animatedStyle2]}>
                <View>
                    <MaterialIcons name="notifications-active" size={48} color="#F59E0B" style={styles.dropShadow} />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>%</Text>
                    </View>
                </View>
            </Animated.View>

            <Animated.View style={[styles.floatingIcon, { top: 200, left: 16 }, animatedStyle3]}>
                <MaterialIcons name="local-offer" size={40} color="#60A5FA" style={styles.dropShadow} />
            </Animated.View>


            {/* Main Content */}
            <View style={styles.titleContainer}>
                {/* BIG - Layered for 3D effect */}
                <View style={styles.textLayerContainer}>
                    <Text style={[styles.text3D, styles.textShadowOrange]}>{data.title_big}</Text>
                    <Text style={[styles.text3D, styles.textFrontOrange]}>{data.title_big}</Text>
                </View>

                {/* PROMO - Layered for 3D effect */}
                <View style={[styles.textLayerContainer, { marginTop: -16 }]}>
                    <Text style={[styles.text3D, styles.textShadowWhite]}>{data.title_promo}</Text>
                    <Text style={[styles.text3D, styles.textFrontWhite]}>{data.title_promo}</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>{data.subtitle}</Text>

            <View style={styles.discountPill}>
                <Text style={styles.discountText}>{data.discount_text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 24,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 24,
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.5,
    },
    blobBlue: {
        backgroundColor: '#BFDBFE', // blue-200
        top: -80,
        left: -80,
        opacity: 0.5,
    },
    blobOrange: {
        backgroundColor: '#FED7AA', // orange-200
        top: 100,
        right: -80,
        opacity: 0.5,
    },
    cloudLeft: {
        position: 'absolute',
        top: 20,
        left: 20,
        transform: [{ rotate: '12deg' }],
    },
    cloudRight: {
        position: 'absolute',
        top: 80,
        right: -20,
        transform: [{ rotate: '-6deg' }],
    },
    floatingIcon: {
        position: 'absolute',
        zIndex: 10,
    },
    dropShadow: {
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#3B82F6', // blue-500
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 8,
        position: 'relative',
        zIndex: 20,
    },
    textLayerContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        height: 70, // Rough height for text
    },
    text3D: {
        fontFamily: 'TitanOne_400Regular',
        fontSize: 70, // 7xl approx
        textAlign: 'center',
        position: 'absolute',
    },
    textShadowOrange: {
        color: '#C2410C', // Deep Orange shadow
        top: 4,
        // textShadow support in RN is essentially simple offset
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 8 },
        textShadowRadius: 10,
        transform: [{ rotate: '-2deg' }],
    },
    textFrontOrange: {
        color: '#F59E0B',
        top: 0,
        transform: [{ rotate: '-2deg' }],
        // Simulate stroke with textShadow if needed or just rely on font weight
    },
    textShadowWhite: {
        color: '#0369A1', // Deep Blue shadow
        top: 4,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 8 },
        textShadowRadius: 10,
        transform: [{ rotate: '2deg' }],
    },
    textFrontWhite: {
        color: 'white',
        top: 0,
        transform: [{ rotate: '2deg' }],
    },
    subtitle: {
        fontFamily: 'CarterOne_400Regular', // Using Carter One as per design for secondary title? Actually design just says "Electronic Products", font yellow-400 uppercase
        // The requested font map: display=Titan One, body=Nunito. Carter One was in the link but possibly unused or for "Electronic Products".
        // Let's use Carter One here since it visually matches the "Electronic Products" style in the head link.
        fontSize: 28,
        color: '#FACC15', // yellow-400
        textTransform: 'uppercase',
        textShadowColor: '#000',
        textShadowOffset: { width: 1.5, height: 1.5 }, // Stroke sim
        textShadowRadius: 1,
        marginBottom: 24,
        zIndex: 20,
        textAlign: 'center',
        letterSpacing: 1,
    },
    discountPill: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 999,
        borderBottomWidth: 4,
        borderBottomColor: '#C2410C', // orange-700
        shadowColor: '#F97316',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
        zIndex: 20,
        transform: [{ scale: 1.05 }], // Hover state sim
    },
    discountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'Nunito_800ExtraBold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});
