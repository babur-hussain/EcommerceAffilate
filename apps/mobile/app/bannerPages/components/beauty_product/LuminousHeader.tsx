import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface LuminousHeaderProps {
    data: {
        title_top: string;
        title_bottom: string;
        subtitle: string;
        button_text: string;
        image_url: string;
    };
}

export default function LuminousHeader({ data }: LuminousHeaderProps) {
    const router = useRouter();

    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Header Navigation */}
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconHitBox}>
                    <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.iconHitBox}>
                    <MaterialIcons name="shopping-bag" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {/* 
               Background Image Area 
               We use a container that is positioned absolutely on the right.
               To get the angled cut effect (slope from top-20% to bottom-0%),
               we can overlay a white rotated view or just transform the container.
               
               Simpler approach without SVG:
               1. Place image in a container that allows overflow.
               2. Place a white View on top of the image (left side) rotated to create the diagonal.
            */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={{ uri: data.image_url }}
                    style={styles.backgroundImage}
                />

                {/* The "Cut" Overlay - A white view rotated to mask the left side */}
                <View style={styles.angledMask} />
            </View>

            <View style={styles.content}>
                <Text style={styles.titleTop}>{data.title_top}</Text>
                <Text style={styles.titleBottom}>{data.title_bottom}</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{data.button_text}</Text>
                </TouchableOpacity>

                <Text style={styles.subtitle}>{data.subtitle}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Height 400 as per previous design
        height: 480,
        backgroundColor: 'white',
        position: 'relative',
        justifyContent: 'flex-start', // Changed to flex-start to align header
        overflow: 'hidden', // Contain the mask
    },
    headerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 48, // Status bar spacing
        zIndex: 20, // ensure clickable
    },
    iconHitBox: {
        padding: 8,
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    backgroundImage: {
        position: 'absolute',
        right: -50, // Shift right slightly if needed, or keeping it right-aligned
        top: 0,
        bottom: 0,
        width: width * 0.8, // Take up mostly right side
        resizeMode: 'cover',
        left: width * 0.3, // Start 30% from left ideally
    },
    angledMask: {
        position: 'absolute',
        top: -100,
        bottom: -100,
        left: -150, // Position it to the left
        width: width * 0.8, // Wide enough to cover
        backgroundColor: 'white',
        transform: [
            { rotate: '-10deg' }, // Rotate to create the slash / slope
            { translateX: 40 }
        ],
        zIndex: 1, // On top of image
    },
    content: {
        paddingHorizontal: 24,
        marginTop: 40,
        maxWidth: '65%',
        zIndex: 10, // Above image and mask
    },
    titleTop: {
        fontSize: 36,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: '#111827',
        lineHeight: 40,
    },
    titleBottom: {
        fontSize: 48,
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: -1,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#a03028', // primary
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignSelf: 'flex-start',
        elevation: 4,
        marginBottom: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'PlayfairDisplay_400Regular_Italic',
        color: '#1F2937',
        lineHeight: 24,
        maxWidth: 220,
    }
});
