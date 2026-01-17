import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CachedImage from '../../shared/CachedImage';

export interface LightningDealProduct {
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
    isVeg?: boolean; // New: Veg icon
    isImported?: boolean; // New: Imported badge
    isGreatDeal?: boolean; // New: Great Deal badge
    footerText?: string; // New: "See more like this"
}

interface LightningDealCardProps {
    product: LightningDealProduct;
    onAdd: () => void;
    onSeeMore?: () => void;
}

export default function LightningDealCard({ product, onAdd, onSeeMore }: LightningDealCardProps) {
    const formatPrice = (price: number) => price ? `₹${price.toLocaleString()}` : '';
    const formatReviews = (count: number) => count ? `(${count.toLocaleString()})` : '(0)';

    return (
        <View style={styles.card}>
            {/* Badges Overlay */}
            <View style={styles.badgesContainer}>
                {product.isImported && (
                    <View style={styles.importedBadge}>
                        <Text style={styles.importedText}>Imported</Text>
                    </View>
                )}
                {product.isGreatDeal && (
                    <View style={styles.greatDealBadge}>
                        <Ionicons name="flash" size={10} color="#FFFFFF" />
                        <Text style={styles.greatDealText}>GREAT{"\n"}DEAL</Text>
                    </View>
                )}
            </View>

            {/* Image Area */}
            <View style={styles.imageContainer}>
                <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={22} color="#9CA3AF" />
                </TouchableOpacity>
                {product.image ? (
                    <CachedImage source={product.image} style={styles.image} contentFit="contain" />
                ) : (
                    <View style={[styles.image, { backgroundColor: '#F3F4F6' }]} />
                )}

                {/* ADD Button */}
                <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                    <Text style={styles.addButtonText}>ADD</Text>
                </TouchableOpacity>
            </View>

            {/* Details Area */}
            <View style={styles.detailsContainer}>
                {/* Veg Icon + Weight Row */}
                <View style={styles.metaRow}>
                    {product.isVeg !== undefined && (
                        <View style={styles.vegIcon}>
                            <View style={styles.vegDot} />
                        </View>
                    )}
                    <Text style={styles.weightText}>{product.weight}</Text>
                </View>

                {/* Title */}
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

                {/* Rating */}
                <View style={styles.ratingRow}>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name="star"
                                size={12}
                                color={star <= product.rating ? "#FBBF24" : "#E5E7EB"}
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

                {/* Scarcity */}
                {product.timeLeft && (
                    <Text style={styles.scarcityText}>{product.timeLeft}</Text>
                )}

                {/* Discount */}
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
            </View>

            {/* Footer Button ("See more like this") */}
            {product.footerText && (
                <TouchableOpacity style={styles.footerButton} onPress={onSeeMore}>
                    <Text style={styles.footerButtonText}>{product.footerText}</Text>
                    <Ionicons name="caret-forward" size={12} color="#166534" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden', // Clip footer
        marginBottom: 8,
    },
    badgesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20,
        flexDirection: 'row',
    },
    importedBadge: {
        backgroundColor: '#EDF2F7', // Light gray/purple tint
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderTopLeftRadius: 16,
        borderBottomRightRadius: 8,
    },
    importedText: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '700',
    },
    greatDealBadge: {
        position: 'absolute',
        right: -160 + 40, // Hacky positioning or use right: 10 on container if needed, but per design it's usually top right
        top: 0,
        backgroundColor: '#EF4444', // Red
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8, // Bookmark shape?
        height: 36,
        width: 30,
    },
    greatDealText: {
        fontSize: 7,
        color: '#FFFFFF',
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 8,
    },
    imageContainer: {
        height: 140,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 12,
        marginTop: 10, // Space for badges
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 0,
        right: 8,
        zIndex: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: -14,
        right: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#4D8B4D',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 20,
    },
    addButtonText: {
        color: '#15803D',
        fontWeight: '800',
        fontSize: 13,
    },
    detailsContainer: {
        paddingHorizontal: 12,
        paddingTop: 16, // Space for button overlap
        paddingBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    vegIcon: {
        width: 14,
        height: 14,
        borderWidth: 1,
        borderColor: '#16A34A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        borderRadius: 2,
    },
    vegDot: {
        width: 8,
        height: 8,
        backgroundColor: '#16A34A',
        borderRadius: 4,
    },
    weightText: {
        fontSize: 10,
        color: '#374151',
        fontWeight: '600',
    },
    name: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
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
        color: '#059669',
        marginLeft: 4,
        letterSpacing: 0.2,
    },
    scarcityText: {
        fontSize: 10,
        color: '#EA580C',
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
        marginLeft: 4,
    },
    footerButton: {
        backgroundColor: '#ECFDF5', // Very light green
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    footerButtonText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#166534', // Dark green
        marginRight: 4,
    }
});
