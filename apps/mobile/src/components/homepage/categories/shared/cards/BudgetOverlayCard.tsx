// Budget overlay card - for Budget Buys with price overlay
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CardProps } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

const PRICE_RANGES = [299, 399, 699, 999];

export default function BudgetOverlayCard({ product, theme, onPress, index = 0 }: CardProps) {
    const priceRange = PRICE_RANGES[index % PRICE_RANGES.length];

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            <View style={styles.overlay}>
                <Text style={styles.underText}>UNDER</Text>
                <Text style={styles.priceText}>₹{priceRange}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    underText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 2,
    },
    priceText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
});
