import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface LuxHeaderProps {
    data: {
        title_top: string;
        title_bottom: string;
        subtitle: string;
        image_url: string;
    };
}

export default function LuxHeader({ data }: LuxHeaderProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Background Decorations */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />
            <View style={styles.blob3} />

            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{data.title_top}</Text>
                    <Text style={styles.title}>{data.title_bottom}</Text>
                </View>

                <Text style={styles.subtitle}>{data.subtitle}</Text>

                <View style={styles.imageArea}>
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: data.image_url }} style={styles.image} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0Bcb4', // accent-pink
        paddingTop: 80,
        paddingBottom: 40,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        overflow: 'hidden',
        position: 'relative',
    },
    blob1: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 256,
        height: 256,
        borderRadius: 128,
        backgroundColor: 'rgba(255,255,255,0.2)', // mix-blend-overlay sim
    },
    blob2: {
        position: 'absolute',
        bottom: 40,
        right: -20,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(139, 94, 85, 0.1)', // brown/10
    },
    blob3: {
        // Extra blob if needed
    },
    content: {
        paddingHorizontal: 24,
        zIndex: 10,
    },
    textContainer: {
        marginBottom: 16,
    },
    title: {
        fontFamily: 'Antonio_400Regular', // or 700 based on look, html says 7xl Antonio
        fontSize: 64,
        lineHeight: 64,
        color: '#3E2723', // accent-dark
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 0,
    },
    subtitle: {
        fontSize: 10,
        fontFamily: 'Montserrat_700Bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: 'rgba(62, 39, 35, 0.8)',
        marginBottom: 24,
        maxWidth: '70%',
    },
    imageArea: {
        height: 192,
        marginTop: 16,
        position: 'relative',
        width: '100%',
    },
    imageWrapper: {
        position: 'absolute',
        right: -30,
        top: -40,
        width: 256,
        height: 256,
        borderRadius: 128,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.5)',
        transform: [{ rotate: '12deg' }],
        elevation: 10, // shadow-soft
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        backgroundColor: 'white',
        padding: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 128,
        resizeMode: 'cover',
    }
});
