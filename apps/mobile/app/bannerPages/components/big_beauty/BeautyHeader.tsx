import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface BeautyHeaderProps {
    data: {
        title: string;
        discount_text: string;
        images: {
            left: string;
            center: string;
            right: string;
        };
    };
}

export default function BeautyHeader({ data }: BeautyHeaderProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ffdab9', '#fff0e5']} // peach to soft peach
                style={styles.background}
            />
            {/* Soft decorative blobs */}
            <View style={[styles.blob, styles.blob1]} />
            <View style={[styles.blob, styles.blob2]} />
            <View style={[styles.blob, styles.blob3]} />

            <View style={styles.content}>
                {/* Header Top Bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="menu" size={24} color="#3E2723" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="notifications" size={24} color="#3E2723" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* Title & Badge */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{data.title}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{data.discount_text}</Text>
                    </View>
                </View>

                {/* Images Illustration */}
                <View style={styles.imagesArea}>
                    {/* Left Tilted */}
                    <View style={[styles.imageWrapper, styles.imageLeft]}>
                        <Image source={{ uri: data.images.left }} style={styles.image} />
                    </View>
                    {/* Right Tilted */}
                    <View style={[styles.imageWrapper, styles.imageRight]}>
                        <Image source={{ uri: data.images.right }} style={styles.image} />
                    </View>
                    {/* Center Main */}
                    <View style={[styles.imageWrapper, styles.imageCenter]}>
                        <Image source={{ uri: data.images.center }} style={styles.image} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        paddingTop: 48,
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    blob: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'white',
        opacity: 0.4,
    },
    blob1: { width: 10, height: 10, top: 20, left: 20, backgroundColor: '#FEF3C7' }, // yellow-100
    blob2: { width: 4, height: 4, bottom: 40, left: '30%', backgroundColor: '#FEF08A' }, // yellow-200
    blob3: { width: 64, height: 64, top: 80, left: 32, opacity: 0.3, filter: 'blur(20px)' }, // bigger blurred blob simulation

    content: {
        zIndex: 10,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    iconButton: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: 8,
        borderRadius: 999,
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'white',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 48, // text-6xl is huge, mobile maybe 48 or 42
        fontFamily: 'DancingScript_700Bold',
        color: '#3E2723', // Primary Dark Brown
        marginBottom: 8,
        textAlign: 'center',
    },
    badge: {
        backgroundColor: '#3E2723',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 999,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 2,
    },
    imagesArea: {
        height: 160,
        position: 'relative',
        marginTop: 16,
    },
    imageWrapper: {
        position: 'absolute',
        width: 96, // w-24
        height: 128, // h-32
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    imageLeft: {
        left: 0,
        bottom: 0,
        transform: [{ rotate: '-10deg' }, { translateY: 8 }, { translateX: -16 }],
    },
    imageRight: {
        right: 0,
        bottom: 0,
        transform: [{ rotate: '10deg' }, { translateY: 8 }, { translateX: 16 }],
    },
    imageCenter: {
        width: 112, // w-28
        height: 144, // h-36
        left: '50%',
        bottom: -10,
        transform: [{ translateX: -56 }], // Center it: -width/2
        zIndex: 20,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});
