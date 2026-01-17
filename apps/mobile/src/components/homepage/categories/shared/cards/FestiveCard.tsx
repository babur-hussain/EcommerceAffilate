// Festive card - for Sankranti with purple banner and kite icons
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CardProps } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function FestiveCard({ product, theme, onPress }: CardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageWrapper}>
                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            </View>
            <View style={[styles.festiveBanner, { backgroundColor: theme.accentColor || '#BA68C8' }]}>
                <View style={styles.festiveIconLeft} />
                <View style={styles.cardContent}>
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.priceText}>From ₹{product.price}</Text>
                </View>
                <View style={styles.festiveIconRight} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: ITEM_WIDTH,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    imageWrapper: {
        width: '100%',
        height: 200,
        backgroundColor: '#F3F4F6',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    festiveBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    festiveIconLeft: {
        width: 14,
        height: 14,
        backgroundColor: '#FFEB3B',
        transform: [{ rotate: '-45deg' }],
        borderRadius: 2,
    },
    festiveIconRight: {
        width: 14,
        height: 14,
        backgroundColor: '#FFEB3B',
        transform: [{ rotate: '45deg' }],
        borderRadius: 2,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 8,
    },
    productName: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 2,
        fontWeight: '500',
    },
    priceText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
