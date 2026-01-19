import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import * as Haptics from 'expo-haptics';

interface AddToCartButtonProps {
    productId: string;
    product: any; // Using any to be flexible with different product shapes, or strict Product type if available
    stock?: number;
    style?: ViewStyle;
    size?: number;
    color?: string;
    children?: React.ReactNode;
}

export default function AddToCartButton({
    productId,
    product,
    stock,
    style,
    size = 20,
    color = "#374151",
    children
}: AddToCartButtonProps) {
    const { addToCart, cart } = useCart();

    // Use prop stock if provided, otherwise fallback to product.stock or 0
    const currentStock = stock !== undefined ? stock : (product.stock !== undefined ? product.stock : 0);

    // Check if product is globally out of stock
    const isOutOfStock = currentStock <= 0;

    // Check if user has already reached the max stock limit in their cart
    const cartItem = cart?.items.find(item =>
        (typeof item.productId === 'string' ? item.productId : item.productId._id) === productId
    );
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    const isMaxLimitReached = !isOutOfStock && cartQuantity >= currentStock;

    const handlePress = async () => {
        if (isOutOfStock) return;

        if (isMaxLimitReached) {
            alert(`Max limit reached! You already have all ${currentStock} available units in your cart.`);
            return;
        }

        // Immediate feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            await addToCart(productId, 1, product);
        } catch (error: any) {
            console.error("Add to cart error", error);
            if (error.message?.includes('400')) {
                alert("Could not add to cart. You may have reached the maximum stock limit.");
            } else {
                alert("Failed to add to cart. Please try again.");
            }
        }
    };

    if (isOutOfStock) {
        // Render nothing or disabled state? 
        // Logic in ProductCard was to disable the button but still show the icon (wishlist/cart)
        // But for a dedicated AddToCartButton, maybe we just show disabled state.
        // However, ProductCard applies opacity to the whole card.
        // Here we just handle the button icon.
        return (
            <TouchableOpacity
                style={[styles.button, style, { opacity: 0.5 }]}
                disabled={true}
            >
                {children ? children : <Ionicons name="cart-outline" size={size} color={color} />}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {children ? (
                children
            ) : (
                isMaxLimitReached ? (
                    <Ionicons name="checkmark-circle" size={size} color="#10B981" />
                ) : (
                    <Ionicons name="cart-outline" size={size} color={color} />
                )
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
