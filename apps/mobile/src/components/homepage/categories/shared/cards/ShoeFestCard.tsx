// Shoe fest card - simple card with offer text
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CardProps } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function ShoeFestCard({ product, theme, onPress }: CardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageWrapper}>
                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.offerText}>Min. {product.discount}% Off</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: ITEM_WIDTH,
        marginBottom: 16,
    },
    imageWrapper: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#F3F4F6',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    productName: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 2,
        textAlign: 'center',
    },
    offerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
    },
});
