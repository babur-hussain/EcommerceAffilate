import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const COLORS = [
    { name: 'Pantone Blue', color: '#6381A5', image: 'https://m.media-amazon.com/images/I/71YdE55GNJL._AC_SL1500_.jpg' }, // Dummy images
    { name: 'Pantone Pink', color: '#B958A5', image: 'https://m.media-amazon.com/images/I/711zW-G0Y2L._AC_UY1100_.jpg' },
    { name: 'Pantone Teal', color: '#1B6B92', image: 'https://m.media-amazon.com/images/I/71f6I+K+gZL._AC_UY1100_.jpg' },
    { name: 'Pantone Greener Pastures', color: '#3A5F40', image: 'https://m.media-amazon.com/images/I/61X3e0rJtEL._AC_SL1500_.jpg' },
];

const VARIANTS = [
    { ram: '8 GB', storage: '128 GB', price: 18999, original: 20999, discount: '10%' },
    { ram: '8 GB', storage: '256 GB', price: 19999, original: 22999, discount: '13%', lowStock: '10 left' },
];

export default function VariantSelector() {
    const [selectedColor, setSelectedColor] = useState(COLORS[3]); // Default Green
    const [selectedVariant, setSelectedVariant] = useState(VARIANTS[1]); // Default 256GB

    return (
        <View style={styles.container}>
            {/* Color Selection */}
            <Text style={styles.label}>
                Selected Color: <Text style={styles.value}>{selectedColor.name}</Text>
            </Text>
            <View style={styles.colorRow}>
                {COLORS.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedColor(item)}
                        style={[
                            styles.colorOption,
                            selectedColor.name === item.name && styles.selectedColorOption,
                        ]}
                    >
                        <Image source={{ uri: item.image }} style={styles.colorImage} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Storage Selection */}
            <Text style={styles.label}>
                Variant: <Text style={styles.value}>{selectedVariant.storage} + {selectedVariant.ram}</Text>
            </Text>
            <View style={styles.variantRow}>
                {VARIANTS.map((item, index) => {
                    const isSelected = selectedVariant.storage === item.storage;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedVariant(item)}
                            style={[
                                styles.variantOption,
                                isSelected && styles.selectedVariantOption,
                            ]}
                        >
                            <Text style={[styles.variantTitle, isSelected && styles.selectedText]}>
                                {item.storage} + {item.ram}
                            </Text>

                            <View style={styles.priceRow}>
                                <Text style={styles.discountText}>↓{item.discount}</Text>
                                <Text style={styles.strikeText}>{item.original.toLocaleString()}</Text>
                            </View>

                            <Text style={[styles.priceText, isSelected && styles.selectedText]}>
                                ₹{item.price.toLocaleString()}
                            </Text>

                            {item.lowStock && (
                                <Text style={styles.lowStockText}>{item.lowStock}</Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    label: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '600',
        marginBottom: 12,
    },
    value: {
        color: '#111827',
        fontWeight: '400',
    },
    colorRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    colorOption: {
        width: 60,
        height: 70,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 12,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedColorOption: {
        borderColor: '#111827',
        borderWidth: 2,
    },
    colorImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 4,
    },
    variantRow: {
        flexDirection: 'row',
    },
    variantOption: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
        backgroundColor: '#F9FAFB',
    },
    selectedVariantOption: {
        borderColor: '#FCE7F3', // Light pink border
        backgroundColor: '#FDF2F8', // Very light pink bg
        borderWidth: 1.5,
    },
    variantTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    selectedText: {
        // color: '#000', 
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    discountText: {
        fontSize: 11,
        color: '#16A34A',
        fontWeight: '700',
        marginRight: 4,
    },
    strikeText: {
        fontSize: 11,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    priceText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    lowStockText: {
        fontSize: 11,
        color: '#EA580C',
        marginTop: 4,
        fontWeight: '500',
    }
});
