import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface CosmeticHeaderProps {
    data: {
        title_top: string;
        title_bottom: string;
        subtitle: string;
        button_text: string;
        image_url: string;
        badge_text_top: string;
        badge_text_center: string;
        badge_text_bottom: string;
    };
}

export default function CosmeticHeader({ data }: CosmeticHeaderProps) {
    const router = useRouter();
    const badgeBounce = useSharedValue(0);

    useEffect(() => {
        badgeBounce.value = withRepeat(
            withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedBadgeStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: badgeBounce.value }]
    }));

    if (!data) return null;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#D4EBF2', '#F0F9FB']}
                style={styles.gradientBg}
            >
                {/* Blur Blobs */}
                <View style={[styles.blob, styles.blobBlue]} />
                <View style={[styles.blob, styles.blobTeal]} />

                <View style={styles.content}>
                    {/* Top Navigation Bar */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: 16
                    }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                            <MaterialIcons name="arrow-back" size={24} color="#112D4E" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={{ padding: 8 }}>
                            <MaterialIcons name="shopping-bag" size={24} color="#112D4E" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>
                        {data.title_top}{'\n'}
                        <Text style={styles.italicTitle}>{data.title_bottom}</Text>
                    </Text>

                    <View style={styles.imageContainer}>
                        <Image source={{ uri: data.image_url }} style={styles.image} />

                        {/* Animated Badge */}
                        <Animated.View style={[styles.badge, animatedBadgeStyle]}>
                            <View style={styles.badgeInner}>
                                <Text style={styles.badgeTop}>{data.badge_text_top}</Text>
                                <Text style={styles.badgeCenter}>{data.badge_text_center}</Text>
                                <Text style={styles.badgeBottom}>{data.badge_text_bottom}</Text>
                            </View>
                        </Animated.View>
                    </View>

                    <Text style={styles.subtitle}>{data.subtitle}</Text>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>{data.button_text}</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        borderRadius: 40,
        overflow: 'hidden',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        elevation: 8,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        backgroundColor: 'white', // fallback
    },
    gradientBg: {
        paddingTop: 60, // status bar space
        paddingBottom: 64,
        paddingHorizontal: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    blob: {
        position: 'absolute',
        width: 256,
        height: 256,
        borderRadius: 128,
        opacity: 0.3,
    },
    blobBlue: {
        backgroundColor: '#BFDBFE', // blue-200
        top: -80,
        right: -80,
    },
    blobTeal: {
        backgroundColor: '#CCFBF1', // teal-100
        top: 80,
        left: -80,
    },
    content: {
        alignItems: 'center',
        zIndex: 10,
    },
    title: {
        fontSize: 40,
        fontFamily: 'PlayfairDisplay_400Regular', // Using regular because 600 might not be loaded if not used, design requests 5xl Playfair
        textAlign: 'center',
        color: '#112D4E', // primary
        letterSpacing: 1,
        marginBottom: 8,
        lineHeight: 48,
    },
    italicTitle: {
        fontWeight: '300', // font-light
        fontStyle: 'italic',
        fontFamily: 'PlayfairDisplay_400Regular_Italic', // Assuming loaded, otherwise fallback
    },
    imageContainer: {
        marginTop: 24,
        marginBottom: 32,
        width: '100%',
        height: 256,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-end', // Align image to bottom if needed, design says flex justify-center items-end
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        top: 40,
        right: -8,
        zIndex: 20,
    },
    badgeInner: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    badgeTop: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#64748B', // gray-500
    },
    badgeCenter: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#112D4E', // primary
        lineHeight: 24,
    },
    badgeBottom: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#112D4E',
    },
    subtitle: {
        fontSize: 16,
        color: '#4B5563', // gray-600
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Lato_300Light', // font-light
    },
    button: {
        backgroundColor: '#112D4E', // primary
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 999,
        elevation: 6,
        shadowColor: '#112D4E',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    }
});
