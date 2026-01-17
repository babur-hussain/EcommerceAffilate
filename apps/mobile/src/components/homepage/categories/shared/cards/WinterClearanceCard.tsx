// Winter clearance card - blue themed with curved image
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CardProps } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function WinterClearanceCard({ product, theme, onPress }: CardProps) {
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.accentColor || '#1E88E5' }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            </View>
            <View style={styles.overlay}>
                <Text style={styles.offerText}>Min. {product.discount}% Off</Text>
                <View style={styles.brandContainer}>
                    <Text style={styles.brandText}>{product.brand}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: ITEM_WIDTH,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        height: 240,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 4,
    },
    offerText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    brandContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        minWidth: 80,
        alignItems: 'center',
    },
    brandText: {
        color: '#111',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
