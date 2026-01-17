import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TrendingProduct {
    id: string;
    name: string;
    image: any;
    rating: number;
    reviews: number;
    deliveryTime: string;
    timeLeft?: string;
    price: number;
    mrp: number;
    discount: string;
    weight: string;
    tag?: string;
}

interface TrendingProductCardProps {
    product: TrendingProduct;
    onAdd: () => void;
}

export default function TrendingProductCard({ product, onAdd }: TrendingProductCardProps) {
    // Safe formatting helpers
    const formatPrice = (price: number) => price ? `₹${price.toLocaleString()}` : '';
    const formatReviews = (count: number) => count ? `(${count.toLocaleString()})` : '(0)';

    return (
        <View style={styles.card}>
            {/* Image Area */}
            <View style={styles.imageContainer}>
                <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={22} color="#9CA3AF" />
                </TouchableOpacity>
                {product.image ? (
                    <Image source={product.image} style={styles.image} resizeMode="contain" />
                ) : (
                    <View style={[styles.image, { backgroundColor: '#F3F4F6' }]} />
                )}

                {/* ADD Button - Overlapping properly */}
                <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                    <Text style={styles.addButtonText}>ADD</Text>
                </TouchableOpacity>
            </View>

            {/* Details Area */}
            <View style={styles.detailsContainer}>
                {/* Weight Badge */}
                {product.weight ? (
                    <View style={styles.weightBadge}>
                        <Text style={styles.weightText}>{product.weight}</Text>
                    </View>
                ) : <View style={{ height: 20 }} />}

                {/* Title */}
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

                {/* Rating Row */}
                <View style={styles.ratingRow}>
                    {/* Stars */}
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name="star"
                                size={12}
                                color={star <= (product.rating || 0) ? "#FBBF24" : "#E5E7EB"}
                            />
                        ))}
                    </View>
                    <Text style={styles.reviews}> {formatReviews(product.reviews)}</Text>
                </View>

                {/* Delivery Time */}
                <View style={styles.infoRow}>
                    <Ionicons name="time" size={12} color="#16A34A" />
                    <Text style={styles.deliveryText}>{product.deliveryTime}</Text>
                </View>

                {/* Scarcity / Tag */}
                {product.tag ? (
                    <Text style={styles.tagText}>{product.tag}</Text>
                ) : product.timeLeft ? (
                    <Text style={styles.scarcityText}>{product.timeLeft}</Text>
                ) : null}

                {/* Discount (if exists and fits logic) */}
                {product.discount ? (
                    <Text style={styles.discountText}>{product.discount}</Text>
                ) : null}

                {/* Price Row */}
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{formatPrice(product.price)}</Text>
                    {product.mrp > product.price && (
                        <Text style={styles.mrp}>MRP {formatPrice(product.mrp)}</Text>
                    )}
                </View>

                {/* EMI breakdown text below price if needed, but not in all cards */}
                {product.price >= 3000 && product.tag?.includes('EMI') && (
                    <Text style={styles.emiText}>₹{Math.round(product.price / 3).toLocaleString()}/month (No cost EMI)</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 20, // Rounded corners
        marginRight: 16,
        // Soft shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'visible',
        marginBottom: 10,
        paddingBottom: 12,
    },
    imageContainer: {
        height: 150,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 12,
        marginBottom: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: 'transparent',
    },
    addButton: {
        position: 'absolute',
        bottom: -12,
        right: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#4D8B4D', // Slightly darker green border
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 20,
    },
    addButtonText: {
        color: '#15803D', // Green 700
        fontWeight: '800',
        fontSize: 13,
    },
    detailsContainer: {
        paddingHorizontal: 12,
        paddingTop: 16, // Space for button overlap
    },
    weightBadge: {
        backgroundColor: '#F7F9FC',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        marginBottom: 6,
    },
    weightText: {
        fontSize: 10,
        color: '#6B7280', // Gray 500
        fontWeight: '700',
    },
    name: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937', // Gray 800
        lineHeight: 18,
        marginBottom: 6,
        height: 38,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 4,
    },
    reviews: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    deliveryText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#059669', // Emerald 600
        marginLeft: 4,
        letterSpacing: 0.2, // Small caps feel
    },
    tagText: {
        fontSize: 10,
        color: '#2563EB', // Blue 600
        fontWeight: '700',
        marginBottom: 2,
    },
    scarcityText: {
        fontSize: 10,
        color: '#EA580C', // Orange/Red for "Only X left"
        fontWeight: '700',
        marginBottom: 2,
    },
    discountText: {
        fontSize: 10,
        color: '#2563EB',
        fontWeight: '800',
        marginBottom: 0,
        marginTop: 2,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1F2937',
        marginRight: 6,
    },
    mrp: {
        fontSize: 11,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        fontWeight: '500',
        marginLeft: 4, // Added margin
    },
    emiText: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 2,
        fontWeight: '500',
    }
});
