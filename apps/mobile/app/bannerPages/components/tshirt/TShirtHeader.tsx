import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface TShirtHeaderProps {
    data: {
        title_line_1: string;
        title_line_2: string;
        badge_text: string;
        background_colors: {
            primary: string;
            dark: string;
        };
        overlay_shape_color: string;
    };
}

export default function TShirtHeader({ data }: TShirtHeaderProps) {
    if (!data) return null;

    // Colors from HTML design
    // bg-yellow-400 -> #FACC15
    // bg-yellow-600 -> #CA8A04
    // primary -> #0f5e36

    return (
        <View style={styles.container}>
            {/* Header Main Background - Green Gradient */}
            <View style={styles.headerBackground}>
                <ImageBackground
                    source={{ uri: 'https://www.transparenttextures.com/patterns/cream-paper.png' }}
                    style={styles.textureOverlay}
                    imageStyle={{ opacity: 0.2, resizeMode: 'repeat' }}
                >
                    <LinearGradient
                        colors={['#15803d', '#0f5e36']} // green-700 to green-900
                        style={styles.gradient}
                    >
                        {/* Skewed Shape (simulated with absolute view and transform) */}
                        <View style={styles.skewedShape} />

                        {/* Blurred Circle */}
                        <View style={styles.blurCircle} />

                        {/* Content */}
                        <View style={styles.content}>
                            <Text style={styles.titleLine1}>{data.title_line_1}</Text>
                            <Text style={styles.titleLine2}>{data.title_line_2}</Text>

                            <View style={styles.badgePill}>
                                <Text style={styles.badgeText}>{data.badge_text}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground>

                {/* Bottom Shadow Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'transparent']}
                    style={styles.topShadowOverlay}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 340,
        backgroundColor: '#0f5e36',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        marginBottom: 30, // mt-8 in design implies some spacing
        overflow: 'hidden'
    },
    headerBackground: {
        flex: 1,
        position: 'relative',
    },
    textureOverlay: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingTop: 70,
    },
    skewedShape: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '120%',
        height: '90%',
        backgroundColor: '#FACC15', // Yellow Accent
        transform: [
            { translateX: -40 },
            { translateY: -40 },
            { rotate: '-6deg' }, // Skew approximation with rotation
            { skewY: '-6deg' }
        ],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    blurCircle: {
        position: 'absolute',
        top: 16,
        right: 40,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FDE047', // yellow-300
        opacity: 0.4,
        // React Native doesn't support 'blur' CSS filter directly on Views easily without specific libs
        // We simulate with opacity and maybe overlay. In Expo Image styles 'blurRadius' works, strictly views hard.
        // For visual parity, simple circle suffices.
    },
    content: {
        zIndex: 20,
        alignItems: 'center',
    },
    titleLine1: {
        fontFamily: 'PermanentMarker_400Regular',
        fontSize: 60,
        color: 'white',
        transform: [{ rotate: '-3deg' }],
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
        marginBottom: 0,
        lineHeight: 65,
    },
    titleLine2: {
        fontFamily: 'PermanentMarker_400Regular',
        fontSize: 50,
        color: '#FACC15', // Accent
        transform: [{ rotate: '-2deg' }],
        marginTop: -10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    badgePill: {
        marginTop: 16,
        backgroundColor: 'rgba(0,0,0,0.2)', // black/20
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        // backdrop-blur not supported natively on View without expo-blur
    },
    badgeText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold', // font-medium equivalent
        letterSpacing: 2, // tracking-widest
        textTransform: 'uppercase',
    },
    topShadowOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        zIndex: 20,
    }
});
