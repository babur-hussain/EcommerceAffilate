import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface LuminousSaleProps {
    data: {
        tag: string;
        title: string;
        link_text: string;
        image_url: string;
    };
}

export default function LuminousSale({ data }: LuminousSaleProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: data.image_url }} style={styles.image} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.tag}>{data.tag}</Text>
                    <Text style={styles.title}>{data.title}</Text>
                    <TouchableOpacity>
                        <Text style={styles.link}>{data.link_text}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    card: {
        backgroundColor: '#fdf2ee', // secondary-light
        borderRadius: 16,
        overflow: 'hidden',
        height: 128,
        flexDirection: 'row',
        position: 'relative',
    },
    imageContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '50%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.6,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 24,
        zIndex: 10,
    },
    tag: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#a03028', // primary
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#111827',
        marginBottom: 8,
    },
    link: {
        fontSize: 12,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: '#111827',
    }
});
