import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface MenFashionHeaderProps {
    data: {
        title: string;
        subtitle: string;
        background_text: string;
        image_url: string;
    };
}

export default function MenFashionHeader({ data }: MenFashionHeaderProps) {
    const router = useRouter();
    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Background Text "FASHION" */}
            <View style={styles.bgTextContainer}>
                <Text style={styles.bgText}>{data.background_text}</Text>
            </View>

            {/* Header Controls (Abs) */}
            <View style={styles.topControls}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.rightControls}>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="search" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="shopping-bag" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Model Image */}
            <View style={styles.imageWrapper}>
                <Image source={{ uri: data.image_url }} style={styles.image} />
                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(239, 51, 51, 0.8)', '#EF3333']}
                    style={styles.gradientOverlay}
                />
            </View>

            {/* Content Text */}
            <View style={styles.textContent}>
                <View style={styles.exclusiveBadge}>
                    <Text style={styles.exclusiveText}>{data.subtitle}</Text>
                </View>
                <Text style={styles.mainTitle}>{data.title.replace('\\n', '\n')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 420,
        backgroundColor: '#EF3333',
        position: 'relative',
        overflow: 'hidden',
    },
    bgTextContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.4,
        zIndex: 0,
    },
    bgText: {
        color: 'white',
        fontSize: 180,
        fontFamily: 'Anton_400Regular',
        textAlign: 'center',
        includeFontPadding: false,
        transform: [{ scaleY: 1.5 }],
        opacity: 0.5, // mix-blend-overlay simulated
    },
    topControls: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : 20,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 30,
    },
    rightControls: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: '90%',
        zIndex: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
    },
    textContent: {
        position: 'absolute',
        bottom: 32,
        left: 24,
        zIndex: 20,
    },
    exclusiveBadge: {
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.8)',
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'rgba(239, 51, 51, 0.2)',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    exclusiveText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2, // tracking-[0.2em]
        textTransform: 'uppercase',
        fontFamily: 'Inter_700Bold',
    },
    mainTitle: {
        color: 'white',
        fontSize: 36, // text-4xl
        fontFamily: 'Anton_400Regular',
        textTransform: 'uppercase',
        lineHeight: 40,
        letterSpacing: 1,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    }
});
