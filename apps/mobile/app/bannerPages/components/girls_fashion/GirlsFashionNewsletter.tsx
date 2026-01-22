import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

interface GirlsFashionNewsletterProps {
    data: {
        image_url: string;
        heading: string;
        subtext: string;
        button_text: string;
    };
}

export default function GirlsFashionNewsletter({ data }: GirlsFashionNewsletterProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Image source={{ uri: data.image_url }} style={styles.bgImage} />
                <View style={styles.overlay} />

                <View style={styles.content}>
                    <Text style={styles.heading}>{data.heading}</Text>
                    <Text style={styles.subtext}>{data.subtext}</Text>

                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Your Email"
                            placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>{data.button_text}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        marginTop: 32,
        marginBottom: 32,
    },
    wrapper: {
        height: 160,
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        opacity: 0.9,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(139, 0, 0, 0.2)', // primary mix-blend-multiply approx
    },
    content: {
        alignItems: 'center',
        padding: 16,
        zIndex: 10,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay_400Regular',
        color: 'white',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    subtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 16,
        textAlign: 'center',
        maxWidth: 200,
        lineHeight: 16,
    },
    inputRow: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 250,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 999,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontSize: 12,
        color: 'white',
    },
    button: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 999,
    },
    buttonText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#8B0000', // Primary
        textTransform: 'uppercase',
    }
});
