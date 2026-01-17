import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface LastChanceOffer {
    _id?: string;
    title: string;
    description?: string;
    originalPrice: number;
    offerPrice: number;
    discountPercentage?: number;
    tag?: string;
    features?: string[];
    image?: string;
}

interface LastChancePopupProps {
    visible: boolean;
    onClose: () => void;
    onContinue: (selectedOffers: string[]) => void;
    offers: LastChanceOffer[];
}

export default function LastChancePopup({ visible, onClose, onContinue, offers }: LastChancePopupProps) {
    const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

    const toggleOffer = (index: number) => {
        // Determine ID or use index as fallback ID for selection logic
        const id = offers[index]._id || `temp-${index}`;

        if (selectedOffers.includes(id)) {
            setSelectedOffers(prev => prev.filter(item => item !== id));
        } else {
            setSelectedOffers(prev => [...prev, id]);
        }
    };

    const calculateSavings = () => {
        let savings = 0;
        offers.forEach((offer, index) => {
            const id = offer._id || `temp-${index}`;
            if (selectedOffers.includes(id)) {
                savings += (offer.originalPrice - offer.offerPrice);
            }
        });
        return savings;
    };

    const savings = calculateSavings();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.addedText}>Added to cart</Text>
                            <Text style={styles.productText}>Product details...</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title}>Last Chance at this Price!</Text>

                        <View style={styles.iconsRow}>
                            <Ionicons name="shield-checkmark" size={24} color="#2563EB" />
                            <View style={styles.dashLine} />
                            <Ionicons name="headset-outline" size={24} color="#9CA3AF" />
                        </View>
                        <View style={styles.labelsRow}>
                            <Text style={styles.activeLabel}>Protection Plans</Text>
                            <Text style={styles.inactiveLabel}>Accessories</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                            {offers.map((offer, index) => {
                                const id = offer._id || `temp-${index}`;
                                const isSelected = selectedOffers.includes(id);

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.card, isSelected && styles.selectedCard]}
                                        onPress={() => toggleOffer(index)}
                                        activeOpacity={0.9}
                                    >
                                        {offer.tag && (
                                            <View style={styles.tagBadge}>
                                                <Text style={styles.tagText}>{offer.tag}</Text>
                                            </View>
                                        )}

                                        <View style={styles.imageContainer}>
                                            {offer.image ? (
                                                <Image source={{ uri: offer.image }} style={styles.offerImage} resizeMode="contain" />
                                            ) : (
                                                <Ionicons name="shield-checkmark-outline" size={60} color="#E5E7EB" style={{ alignSelf: 'center' }} />
                                            )}
                                            {isSelected && (
                                                <View style={styles.selectedOverlay}>
                                                    <Text style={styles.bestOfferText}>Selected</Text>
                                                </View>
                                            )}
                                        </View>

                                        <Text style={styles.offerTitle}>{offer.title}</Text>

                                        <View style={styles.priceRow}>
                                            {offer.discountPercentage && (
                                                <Text style={styles.discountText}>↓ {offer.discountPercentage}%</Text>
                                            )}
                                            <Text style={styles.originalPrice}>₹{offer.originalPrice}</Text>
                                            <Text style={styles.offerPrice}>₹{offer.offerPrice}</Text>
                                        </View>

                                        {offer.description && (
                                            <Text style={styles.descriptionText}>{offer.description}</Text>
                                        )}

                                        {offer.features && (
                                            <View style={styles.featuresList}>
                                                {offer.features.slice(0, 3).map((feat, i) => (
                                                    <View key={i} style={styles.featureItem}>
                                                        <Ionicons name="checkmark" size={14} color="#4B5563" />
                                                        <Text style={styles.featureText} numberOfLines={1}>{feat}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}

                                        {isSelected && (
                                            <TouchableOpacity style={styles.removeBtn} onPress={() => toggleOffer(index)}>
                                                <Ionicons name="close" size={16} color="#4B5563" />
                                                <Text style={styles.removeText}>Remove</Text>
                                            </TouchableOpacity>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Savings Footer */}
                    {savings > 0 && (
                        <View style={styles.savingsFooter}>
                            <Text style={styles.savingsText}>Additional savings unlocked: ₹{savings}</Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.outlineBtn} onPress={onClose}>
                            <Text style={styles.outlineBtnText}>Go to checkout</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => onContinue(selectedOffers)}
                        >
                            <Text style={styles.primaryBtnText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#F9FAFB'
    },
    addedText: {
        fontSize: 12,
        color: '#6B7280',
    },
    productText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    content: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    iconsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 16,
    },
    dashLine: {
        width: 60,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    labelsRow: {
        flexDirection: 'row',
        gap: 40,
        marginBottom: 20,
    },
    activeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    inactiveLabel: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    scroll: {
        maxHeight: 350,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    card: {
        width: 200,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        marginRight: 16,
        backgroundColor: '#fff',
    },
    selectedCard: {
        borderColor: '#2563EB',
        backgroundColor: '#EFF6FF',
    },
    tagBadge: {
        position: 'absolute',
        top: -1,
        left: -1,
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopLeftRadius: 12,
        borderBottomRightRadius: 12,
        zIndex: 1,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#065F46',
    },
    imageContainer: {
        height: 120,
        justifyContent: 'center',
        marginBottom: 12,
        marginTop: 16,
        position: 'relative',
    },
    offerImage: {
        width: '100%',
        height: '100%',
    },
    selectedOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2563EB',
        paddingVertical: 4,
        alignItems: 'center',
    },
    bestOfferText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '700',
    },
    offerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    discountText: {
        fontSize: 12,
        color: '#16A34A',
        fontWeight: '700',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    offerPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    descriptionText: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 8,
    },
    featuresList: {
        gap: 4,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    featureText: {
        fontSize: 11,
        color: '#4B5563',
    },
    removeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
        gap: 4,
    },
    removeText: {
        fontSize: 12,
        color: '#4B5563',
    },
    savingsFooter: {
        backgroundColor: '#ECFDF5',
        padding: 8,
        alignItems: 'center',
    },
    savingsText: {
        color: '#047857',
        fontWeight: '700',
        fontSize: 13,
    },
    footer: {
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    outlineBtn: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        alignItems: 'center',
    },
    outlineBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    primaryBtn: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#FFD700', // Yellow
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
});
