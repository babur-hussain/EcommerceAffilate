import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { CachedImage } from '../common/CachedImage';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    rating?: number;
}

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    width?: number;
}

export default function ProductCard({ product, onPress, width: customWidth }: ProductCardProps) {
    return (
        <TouchableOpacity
            style={[styles.container, customWidth ? { width: customWidth } : {}]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <CachedImage
                    uri={product.images[0] || 'https://via.placeholder.com/150'}
                    style={styles.image}
                />
                <TouchableOpacity style={styles.favoriteButton}>
                    <MaterialIcons name="favorite-border" size={20} color="#4F46E5" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.name} numberOfLines={2}>
                    {product.name}
                </Text>
                <View style={styles.footer}>
                    <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
                    <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.rating}>4.5</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 160,
        width: '100%',
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        padding: 12,
    },
    category: {
        fontSize: 10,
        color: '#6B7280',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 4,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        height: 40,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B45309',
        marginLeft: 2,
    },
});
