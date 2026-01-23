import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ElegantHeaderProps {
    data: {
        title_top: string;
        title_bottom: string;
        subtitle: string;
    };
}

export default function ElegantHeader({ data }: ElegantHeaderProps) {
    // Animation for sparkles
    const router = useRouter();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.8);
    const rotation = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500 }),
                withTiming(0.8, { duration: 1500 })
            ),
            -1,
            true
        );
        rotation.value = withRepeat(
            withSequence(
                withTiming(15, { duration: 1500 }),
                withTiming(0, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const sparkleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { rotate: `${rotation.value}deg` }
            ],
            opacity: opacity.value
        };
    });

    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Background Decorations */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />
            <View style={styles.blob3} />

            {/* Sparkles */}
            <Animated.View style={[styles.sparkle1, sparkleStyle]}>
                <MaterialIcons name="auto-awesome" size={32} color="white" />
            </Animated.View>
            <Animated.View style={[styles.sparkle2, sparkleStyle]}>
                <MaterialIcons name="auto-awesome" size={24} color="rgba(255,255,255,0.8)" />
            </Animated.View>

            <View style={styles.content}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.brand}>LUXE BEAUTY</Text>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/cart')}>
                        <MaterialIcons name="shopping-bag" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Hero Content */}
                <View style={styles.heroText}>
                    <Text style={styles.title}>
                        {data.title_top}{'\n'}{data.title_bottom}
                    </Text>
                    <Text style={styles.subtitle}>{data.subtitle}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F26985', // Vibrant Rose Pink
        paddingTop: 56,
        paddingHorizontal: 24,
        paddingBottom: 80,
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        position: 'relative',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    blob1: {
        position: 'absolute',
        top: -60,
        left: -60,
        width: 256,
        height: 256,
        borderRadius: 128,
        backgroundColor: 'rgba(255,255,255,0.1)',
        // blur is hard in RN without libs, usually standard View doesn't blur bg unless BlurView.
        // We use simple opacity overlay simulation
    },
    blob2: {
        position: 'absolute',
        bottom: -40,
        right: -40,
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    blob3: {
        position: 'absolute',
        top: 40,
        right: 40,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(244, 114, 182, 0.4)', // pink-400 equivalentish
    },
    sparkle1: {
        position: 'absolute',
        top: 48,
        right: 32,
    },
    sparkle2: {
        position: 'absolute',
        bottom: 64,
        left: 24,
    },
    content: {
        zIndex: 10,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    brand: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    iconButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 999,
    },
    dot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderColor: '#F26985',
        borderWidth: 2,
        borderRadius: 5,
    },
    heroText: {
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontFamily: 'Montserrat_700Bold',
        color: 'white',
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 12,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        color: '#FCE7F3', // pink-100
        fontSize: 14,
        fontFamily: 'Lato_300Light',
        letterSpacing: 1,
        opacity: 0.9,
    }
});
