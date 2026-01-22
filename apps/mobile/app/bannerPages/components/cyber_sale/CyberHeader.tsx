import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface CyberHeaderProps {
    data: {
        title_top: string;
        title_bottom: string;
        discount_text: {
            prefix: string;
            value: string;
        };
        image_url: string;
    };
}

export default function CyberHeader({ data }: CyberHeaderProps) {
    // Pulse animation for lightning bolt/star
    const pulse = useSharedValue(1);
    const spin = useSharedValue(0);

    React.useEffect(() => {
        pulse.value = withRepeat(withTiming(1.2, { duration: 800 }), -1, true);
        spin.value = withRepeat(withTiming(360, { duration: 8000, easing: Easing.linear }), -1, false);
    }, []);

    const animPulse = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
    const animSpin = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));

    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="menu" size={24} color="#FFCB05" />
                </TouchableOpacity>
                <Text style={styles.topLogo}>POP SHOP</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="shopping-bag" size={24} color="#FFCB05" />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Floating Decorations */}
                <Animated.View style={[styles.decoPulse, animPulse]}>
                    <MaterialIcons name="flash-on" size={32} color="#D9242C" />
                </Animated.View>

                <Animated.View style={[styles.decoSpin, animSpin]}>
                    <MaterialIcons name="local-florist" size={36} color="#2A7FFF" />
                </Animated.View>

                {/* Vertical Text Stack */}
                <View style={styles.textStack}>
                    <Text style={styles.titleCyber}>{data.title_top}</Text>
                    <Text style={styles.titleSale}>{data.title_bottom}</Text>

                    {/* Zigzag SVG placeholder - represented by simple view or text for now */}
                    <Text style={styles.zigzag}>VVVVVV</Text>
                </View>

                {/* Hero Image Block */}
                <View style={styles.heroBlock}>
                    <View style={styles.imageFrame}>
                        <Image source={{ uri: data.image_url }} style={styles.heroImage} />
                    </View>

                    {/* Pop-out Discount Tag */}
                    <View style={styles.discountTag}>
                        <Text style={styles.discountPrefix}>{data.discount_text.prefix}</Text>
                        <Text style={styles.discountValue}>{data.discount_text.value}</Text>
                    </View>

                    {/* Star Badge */}
                    <View style={styles.starBadge}>
                        <MaterialIcons name="star" size={48} color="#FFCB05" style={{ textShadowColor: 'black', textShadowRadius: 1, textShadowOffset: { width: 1, height: 1 } }} />
                    </View>
                </View>
            </View>

            {/* Checkerboard Strip */}
            <LinearGradient
                colors={['#FFCB05', 'transparent']}
                start={[0, 0]} end={[1, 1]}
                locations={[0.5, 0.5]}
                style={styles.checkerStrip}
            >
                {/* Simulated checker pattern via repeated views or gradient */}
                <Image
                    source={{ uri: 'https://placehold.co/20x20/FFCB05/000000/png?text=+' }}
                    style={{ width: '100%', height: 24, resizeMode: 'repeat', opacity: 0.8 }}
                />
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        paddingBottom: 0,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 48,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#FFCB05',
        backgroundColor: 'black',
        zIndex: 50,
    },
    iconBtn: {
        padding: 4,
        borderRadius: 20,
    },
    topLogo: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 24,
        color: '#FFCB05',
        letterSpacing: 2,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#D9242C',
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'white',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    mainContent: {
        minHeight: 400,
        paddingHorizontal: 16,
        paddingTop: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    decoPulse: {
        position: 'absolute',
        top: 16,
        left: 8,
        zIndex: 0,
    },
    decoSpin: {
        position: 'absolute',
        top: 80,
        right: 24,
        zIndex: 0,
    },
    textStack: {
        marginBottom: 24,
        position: 'relative',
        zIndex: 10,
    },
    titleCyber: {
        fontFamily: 'Anton_400Regular',
        fontSize: 80,
        lineHeight: 80,
        color: '#FFCB05',
        textShadowColor: '#0F172A',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 0, // Hard shadow
        transform: [{ rotate: '-2deg' }],
    },
    titleSale: {
        fontFamily: 'Anton_400Regular',
        fontSize: 96,
        lineHeight: 80,
        color: '#D9242C',
        textShadowColor: '#0F172A',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 0, // Hard shadow
        marginLeft: 16,
        marginTop: -10,
        transform: [{ rotate: '1deg' }],
        zIndex: 2,
    },
    zigzag: {
        position: 'absolute',
        top: 100,
        left: -8,
        color: '#FFCB05',
        fontSize: 24,
        fontWeight: 'bold',
        transform: [{ rotate: '90deg' }],
        opacity: 0.8,
    },
    heroBlock: {
        marginTop: -30,
        marginRight: -20,
        alignItems: 'flex-end',
        position: 'relative',
    },
    imageFrame: {
        width: 200,
        height: 200,
        backgroundColor: '#FDBA74', // orange-300
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderWidth: 4,
        borderColor: 'black',
        overflow: 'hidden',
        // Hard drop shadow
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10, // Elevation doesn't support offset perfectly on android but good enough
    },
    heroImage: {
        width: '120%',
        height: '120%',
        resizeMode: 'cover',
        marginLeft: -10,
    },
    discountTag: {
        position: 'absolute',
        bottom: 16,
        left: 0, // Relative to the flex-end container, need to push it left
        right: 40,
        backgroundColor: '#D9242C',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: 'black',
        transform: [{ rotate: '-3deg' }],
        zIndex: 20,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    discountPrefix: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 14,
        color: 'white',
    },
    discountValue: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 24,
        color: '#FFCB05', // Secondary
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    starBadge: {
        position: 'absolute',
        bottom: 60,
        left: -40,
        zIndex: 20,
    },
    checkerStrip: {
        height: 24,
        backgroundColor: 'black',
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderTopColor: 'black',
        borderBottomColor: 'black',
        overflow: 'hidden',
    }
});
