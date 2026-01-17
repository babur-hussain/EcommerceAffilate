import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CachedImage } from '../common/CachedImage';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useBasket } from '../../context/BasketContext';
import * as Haptics from 'expo-haptics';

export interface Product {
    _id: string;
    title: string;
    price: number;
    mrp?: number;
    image: string;
    primaryImage?: string;
    rating?: number;
    ratingCount?: number;
    netWeight?: string;
    categoryDetails?: {
        _id: string;
        name: string;
        parentCategory?: string;
    };
}

interface ProductCardStyle1Props {
    product: Product;
}

export function ProductCardStyle1({ product }: ProductCardStyle1Props) {
    const { addToBasket, removeFromBasket, getItemCount } = useBasket();

    // Calculate discount percentage
    const mrp = product.mrp || product.price * 1.2; // Fallback for demo
    const discount = Math.round(((mrp - product.price) / mrp) * 100);
    const rating = product.rating || (4 + Math.random()).toFixed(1); // Demo rating if missing

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            {/* Image Section with separate background */}
            <View style={styles.imageSection}>
                <View style={styles.imageBackground} />
                <CachedImage
                    uri={product.primaryImage || product.image}
                    style={styles.productImage}
                    resizeMode="contain"
                />

                {/* Discount Badge - Now inside image section */}
                {discount > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>↓ {discount}%</Text>
                    </View>
                )}

                {/* Rating Badge - Now overlaying image bottom-left */}
                <View style={styles.ratingPill}>
                    <Text style={styles.ratingText}>{rating}</Text>
                    <AntDesign name="star" size={10} color="#FFFFFF" />
                </View>

                {/* Add Button - Overlapping Image and Content */}
                <View style={styles.addButtonContainer}>
                    {getItemCount(product._id) === 0 ? (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                addToBasket(product);
                            }}
                        >
                            <Ionicons name="add" size={24} color="#DC2626" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.quantityControl}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    removeFromBasket(product._id);
                                }}
                            >
                                <Ionicons name="remove" size={18} color="#374151" />
                            </TouchableOpacity>

                            <Text style={styles.quantityText}>{getItemCount(product._id)}</Text>

                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    addToBasket(product);
                                }}
                            >
                                <Ionicons name="add" size={18} color="#374151" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Details Section */}
            <View style={styles.detailsContainer}>
                {/* 1. Weight/Size */}
                <Text style={styles.weightText}>{product.netWeight || "12 x 70 g"}</Text>

                {/* 2. Name */}
                <Text style={styles.productTitle} numberOfLines={2}>
                    {product.title}
                </Text>

                {/* 3. Price */}
                <View style={styles.priceRow}>
                    <View style={styles.priceHighlight}>
                        <Text style={styles.currentPriceText}>₹{product.price}</Text>
                    </View>
                    <Text style={styles.originalPriceText}>₹{Math.round(mrp)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 105,
        paddingBottom: 12,
        marginRight: 6,
    },
    discountBadge: {
        position: 'absolute',
        top: 4, // Adjusted for 100% background
        left: 4, // Adjusted for 100% background
        backgroundColor: '#16A34A',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderTopLeftRadius: 10, // Matching border radius
        borderBottomRightRadius: 10,
        zIndex: 10,
        elevation: 2,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    imageSection: {
        height: 120, // Restored height to keep visual impact
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 4,
        position: 'relative',
    },
    imageBackground: {
        position: 'absolute',
        width: '100%', // Fills the container
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    productImage: {
        width: '90%', // Increased from 75% to make image larger with narrow margins
        height: '90%',
        zIndex: 1,
    },
    // New Rating Pill Style (Overlay)
    ratingPill: {
        position: 'absolute',
        bottom: 0,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(31, 41, 55, 0.9)', // Dark background
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 2,
        zIndex: 20,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 0,
        right: 8,
        zIndex: 20,
    },
    addButton: {
        width: 32, // Adjusted size to fit compact card
        height: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        height: 32,
        paddingHorizontal: 4,
    },
    quantityButton: {
        width: 28,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
        marginHorizontal: 4,
        minWidth: 16,
        textAlign: 'center',
    },
    detailsContainer: {
        paddingHorizontal: 10,
        marginTop: 0, // Reduced from 4
    },
    weightText: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
        alignSelf: 'flex-start',
        backgroundColor: '#F3F4F6', // Added background
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    productTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        height: 34,
        lineHeight: 17,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    priceHighlight: {
        backgroundColor: '#FDE047',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 2,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        transform: [{ skewX: '-10deg' }]
    },
    currentPriceText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#000000',
        transform: [{ skewX: '10deg' }],
        fontStyle: 'italic', // Explicitly added to ensure italic look
    },
    originalPriceText: {
        fontSize: 11,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        fontWeight: '500',
        fontStyle: 'italic', // Consistent styling
    },
});
