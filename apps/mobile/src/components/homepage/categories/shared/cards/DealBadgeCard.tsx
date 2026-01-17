// Deal badge card - for Early Bird Deals with blue badge at bottom
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CardProps } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function DealBadgeCard({ product, theme, onPress }: CardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageWrapper}>
                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                <View style={[styles.dealBadge, { backgroundColor: theme.badgeColor || '#0056D2' }]}>
                    <Text style={[styles.dealText, { color: theme.badgeTextColor || '#FFF' }]}>
                        Min. {product.discount}% Off
                    </Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.brandName} numberOfLines={1}>{product.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.discountText}>↓{product.discount}%</Text>
                    <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                    <Text style={styles.currentPrice}>₹{product.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: ITEM_WIDTH,
        backgroundColor: '#FFF',
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 0.8,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    dealBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 6,
        alignItems: 'center',
    },
    dealText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 8,
    },
    brandName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#111827',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    productName: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    discountText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
        marginRight: 4,
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        marginRight: 4,
    },
    currentPrice: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },
});
