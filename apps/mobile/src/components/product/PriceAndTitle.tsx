import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PriceAndTitleProps {
    brand?: string;
    name: string;
    shortDescription?: string;
    price: number;
    mrp?: number;
    discount?: string;
    protectPromiseFee?: number;
}

export default function PriceAndTitle({ brand, name, shortDescription, price, mrp, discount, protectPromiseFee }: PriceAndTitleProps) {
    return (
        <View style={styles.container}>
            {brand && (
                <View style={styles.brandRow}>
                    <Text style={styles.brand}>{brand.toUpperCase()}</Text>
                    <TouchableOpacity>
                        <Text style={styles.visitStore}>Visit store</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={styles.title}>
                {name}
            </Text>

            {shortDescription && (
                <Text style={styles.description} numberOfLines={2}>
                    {shortDescription}
                </Text>
            )}

            <View style={styles.priceRow}>
                {discount && <Text style={styles.discount}>{discount}</Text>}
                {mrp && mrp > price && <Text style={styles.mrp}>₹{mrp.toLocaleString()}</Text>}
                <Text style={styles.price}>₹{price.toLocaleString()}</Text>
            </View>

            {/* Conditionally render Protect Promise Fee */}
            {protectPromiseFee !== undefined && protectPromiseFee > 0 && (
                <TouchableOpacity style={styles.feeRow}>
                    <Text style={styles.feeText}>+₹{protectPromiseFee} Protect Promise Fee</Text>
                    <Ionicons name="chevron-forward" size={12} color="#6B7280" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    brand: {
        fontSize: 13,
        fontWeight: '800',
        color: '#374151',
        marginRight: 8,
        letterSpacing: 0.5,
    },
    visitStore: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2563EB',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937', // Darker gray/black for better contrast
        lineHeight: 24,
        marginBottom: 8,
    },
    description: {
        fontSize: 13,
        color: '#6B7280', // Gray-500
        marginBottom: 12,
        lineHeight: 18,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    discount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#16A34A', // Green
        marginRight: 8,
    },
    mrp: {
        fontSize: 18,
        color: '#9CA3AF', // Gray
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827', // Black
    },
    feeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    feeText: {
        fontSize: 12,
        color: '#6B7280',
        marginRight: 2,
    }
});
