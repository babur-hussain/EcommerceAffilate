import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomActionBarProps {
    price: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function BottomActionBar({ price, onAddToCart, onBuyNow }: BottomActionBarProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
                <Ionicons name="cart-outline" size={24} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.emiButton}>
                <Text style={styles.emiTitle}>Buy with EMI</Text>
                <Text style={styles.emiSub}>From ₹3,334/m</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buyButton} onPress={onBuyNow}>
                <Text style={styles.buyText}>Buy now</Text>
                <Text style={styles.buyPrice}>at ₹{price.toLocaleString()}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        alignItems: 'center',
        paddingBottom: 24, // Safe area
    },
    cartButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    emiButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    emiTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
    },
    emiSub: {
        fontSize: 10,
        color: '#6B7280',
    },
    buyButton: {
        flex: 1.2,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FFD700', // Yellow
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1F2937',
    },
    buyPrice: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1F2937',
    }
});
