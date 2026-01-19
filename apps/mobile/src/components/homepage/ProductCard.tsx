import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import CachedImage from '../shared/CachedImage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import * as Haptics from 'expo-haptics';
import AddToCartButton from '../shared/AddToCartButton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    rating?: number;
    stock?: number;
}

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    width?: number;
    actionButtonType?: 'wishlist' | 'cart';
    stock?: number;
}

export default function ProductCard({ product, onPress, width: customWidth, actionButtonType = 'wishlist', stock }: ProductCardProps) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    // Use prop stock if provided, otherwise fallback to product.stock or 0
    const currentStock = stock !== undefined ? stock : (product as any).stock !== undefined ? (product as any).stock : 0;

    // Check if product is globally out of stock
    const isOutOfStock = currentStock <= 0;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                customWidth ? { width: customWidth } : {},
                isOutOfStock && { opacity: 0.6 }
            ]}
            onPress={isOutOfStock ? undefined : onPress}
            activeOpacity={0.9}
            disabled={isOutOfStock}
        >

            <View style={styles.imageContainer}>
                <CachedImage
                    source={{ uri: product.images[0] || 'https://via.placeholder.com/150' }}
                    style={styles.image}
                    contentFit="cover"
                />
                <View style={styles.actionContainer}>
                    {actionButtonType === 'cart' ? (
                        <AddToCartButton
                            productId={product._id}
                            product={product}
                            stock={stock}
                            style={styles.favoriteButton}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={() => {
                                const inWishlist = isInWishlist(product._id);
                                if (inWishlist) {
                                    removeFromWishlist(product._id);
                                } else {
                                    addToWishlist({
                                        _id: product._id,
                                        title: product.name,
                                        price: product.price,
                                        images: product.images
                                    });
                                }
                            }}
                        >
                            <MaterialIcons
                                name={isInWishlist(product._id) ? "favorite" : "favorite-border"}
                                size={20}
                                color={isInWishlist(product._id) ? "#EF4444" : "#4F46E5"}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                {isOutOfStock && (
                    <View style={styles.oosContainer}>
                        <Text style={styles.oosText}>Out of Stock</Text>
                    </View>
                )}
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
    actionContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10
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
        fontWeight: '700',
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
    oosContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    oosText: {
        color: '#DC2626',
        fontWeight: 'bold',
        fontSize: 14,
        transform: [{ rotate: '-15deg' }],
        borderWidth: 2,
        borderColor: '#DC2626',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }
});
