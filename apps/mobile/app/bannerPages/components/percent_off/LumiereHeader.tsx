import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface LumiereHeaderProps {
    data: {
        title_top: string;
        title_bottom: string;
        subtitle: string;
        event_tag: string;
        button_text: string;
        image_url: string;
    };
}

export default function LumiereHeader({ data }: LumiereHeaderProps) {
    const router = useRouter();
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        rotate.value = withRepeat(
            withSequence(
                withTiming(2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const badgeStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { rotate: `${rotate.value}deg` }
            ]
        };
    });

    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Header Navigation */}
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconHitBox}>
                    <MaterialIcons name="arrow-back" size={24} color="#121212" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.iconHitBox}>
                    <MaterialIcons name="shopping-bag" size={24} color="#121212" />
                </TouchableOpacity>
            </View>

            <View style={styles.heroCard}>
                <Image source={{ uri: data.image_url }} style={styles.image} />
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.gradient}
                />

                {/* 50% Off Badge */}
                <Animated.View style={[styles.badge, badgeStyle]}>
                    <View style={styles.badgeContent}>
                        <MaterialIcons name="auto-awesome" size={24} color="white" style={styles.sparkle1} />
                        <MaterialIcons name="auto-awesome" size={16} color="white" style={styles.sparkle2} />
                        <Text style={styles.badgePercent}>-50<Text style={styles.percent}>%</Text></Text>
                        <Text style={styles.badgeLabel}>LIMITED</Text>
                    </View>
                </Animated.View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{data.event_tag}</Text>
                    </View>
                    <Text style={styles.title}>
                        {data.title_top}{'\n'}{data.title_bottom}
                    </Text>
                    <Text style={styles.subtitle}>{data.subtitle}</Text>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>{data.button_text}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    headerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 48, // Status bar spacing
        marginBottom: 16,
    },
    iconHitBox: {
        padding: 8,
    },
    heroCard: {
        height: 420,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#121212',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    badge: {
        position: 'absolute',
        top: 32,
        left: 24,
        zIndex: 20,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    badgeContent: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgePercent: {
        color: 'white',
        fontSize: 48,
        fontWeight: '900',
        fontFamily: 'PlayfairDisplay_700Bold',
        lineHeight: 48,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    percent: {
        fontSize: 24,
    },
    badgeLabel: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    sparkle1: {
        position: 'absolute',
        top: -10,
        right: -10,
    },
    sparkle2: {
        position: 'absolute',
        bottom: 10,
        left: -10,
    },
    content: {
        position: 'absolute',
        bottom: 32,
        left: 24,
        right: 24,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    tagText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        color: 'white',
        fontSize: 36,
        fontFamily: 'PlayfairDisplay_400Regular',
        lineHeight: 40,
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 16,
        maxWidth: 200,
    },
    button: {
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: 'black',
        fontSize: 14,
        fontWeight: '600',
    }
});
