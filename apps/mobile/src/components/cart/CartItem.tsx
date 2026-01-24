import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export interface ProductType {
    _id: string;
    name?: string;
    title?: string;
    price: number;
    mrp?: number; // Original price
    images?: string[];
    image?: string;
    discount?: number;
    rating?: number;
    ratingCount?: number;
}

export interface CartItemType {
    productId: ProductType | string; // Handle populated or ID only
    quantity: number;
}

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
    // Type Guard / Safe Access
    const product = typeof item.productId === 'object' ? item.productId : { _id: item.productId } as ProductType;
    const productId = product._id;
    const name = product.name || product.title || 'Unknown Product';
    const price = product.price || 0;
    const quantity = item.quantity;

    // Use backend provided MRP if available, otherwise fallback to price (no fake math)
    const originalPrice = product.mrp || price;

    // Calculate reliable discount percentage if MRP exists and is > price
    const hasDiscount = originalPrice > price;
    const discount = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const imageUri = (product.images && product.images[0]) || product.image;

    return (
        <View style={styles.cartItemContainer}>
            <View style={styles.cartItemContent}>
                <View style={styles.imageColumn}>
                    <View style={styles.imageWrapper}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.productImage} />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <MaterialIcons name="image" size={24} color="#9CA3AF" />
                            </View>
                        )}
                    </View>
                    <View style={styles.qtySelector}>
                        <Text style={styles.qtyLabel}>Qty: {quantity}</Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
                    </View>
                </View>

                <View style={styles.detailsColumn}>
                    <Text style={styles.productTitle} numberOfLines={2}>{name}</Text>

                    <View style={styles.ratingRow}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>{product.rating || '4.5'}</Text>
                            <FontAwesome name="star" size={10} color="#fff" style={{ marginLeft: 2 }} />
                        </View>
                        <Text style={styles.ratingCount}> ({product.ratingCount || 100})</Text>
                    </View>

                    <View style={styles.priceRow}>
                        {hasDiscount && <Text style={styles.discountText}>↓{discount}%</Text>}
                        {hasDiscount && <Text style={styles.originalPrice}>₹{originalPrice.toLocaleString()}</Text>}
                        <Text style={styles.currentPrice}>₹{price.toLocaleString()}</Text>
                    </View>

                    {hasDiscount && <Text style={styles.offersText}>Best Price Applied</Text>}

                    <View style={styles.deliveryRow}>
                        <Text style={styles.deliveryDate}>Standard Delivery</Text>
                        <View style={styles.separator} />
                        <Text style={styles.freeDelivery}>Free</Text>
                    </View>
                </View>
            </View>

            <View style={styles.itemActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="archive" size={20} color="#878787" />
                    <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onRemove(productId)}
                >
                    <MaterialIcons name="delete" size={20} color="#878787" />
                    <Text style={styles.actionText}>Remove</Text>
                </TouchableOpacity>
                <View style={styles.qtyEditButton}>
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onUpdateQuantity(productId, quantity - 1); }} style={styles.qtyBtn}>
                        <MaterialIcons name="remove" size={16} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onUpdateQuantity(productId, quantity + 1); }} style={styles.qtyBtn}>
                        <MaterialIcons name="add" size={16} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Memoize to prevent re-renders in large lists
export default React.memo(CartItem);

const styles = StyleSheet.create({
    cartItemContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 8,
        borderBottomColor: '#F1F3F6',
    },
    cartItemContent: {
        flexDirection: 'row',
        padding: 12,
    },
    imageColumn: {
        width: 100,
        alignItems: 'center',
    },
    imageWrapper: {
        width: 80,
        height: 80,
        marginBottom: 8,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 2,
    },
    qtyLabel: {
        fontSize: 13,
        color: '#212121',
        fontWeight: '500',
    },
    detailsColumn: {
        flex: 1,
        paddingLeft: 12,
    },
    productTitle: {
        fontSize: 14,
        color: '#212121',
        marginBottom: 6,
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingBadge: {
        backgroundColor: '#388E3C',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    ratingCount: {
        fontSize: 12,
        color: '#878787',
        marginLeft: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    currentPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 13,
        color: '#878787',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    discountText: {
        fontSize: 13,
        color: '#388E3C',
        fontWeight: '600',
        marginRight: 6
    },
    offersText: {
        fontSize: 12,
        color: '#2874F0',
        marginBottom: 6,
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryDate: {
        fontSize: 12,
        color: '#212121',
    },
    separator: {
        width: 1,
        height: 10,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 6,
    },
    freeDelivery: {
        fontSize: 12,
        color: '#388E3C',
        fontWeight: '600'
    },
    itemActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingVertical: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#F0F0F0',
    },
    actionText: {
        fontSize: 14,
        color: '#878787',
        marginLeft: 6,
        fontWeight: '500',
    },
    qtyEditButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    qtyBtn: {
        padding: 5
    }
});
