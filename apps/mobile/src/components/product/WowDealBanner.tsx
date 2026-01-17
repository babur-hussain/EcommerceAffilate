import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Offer {
    type: string;
    title: string;
    description: string;
    discountAmount: number;
    code?: string;
}

interface WowDealBannerProps {
    price: number;
    offers?: Offer[];
}

export default function WowDealBanner({ price, offers }: WowDealBannerProps) {
    if (!offers || offers.length === 0) {
        return null; // Don't display if no offers configured
    }

    // Find the best offer (highest discount)
    const bestOffer = offers.reduce((prev, current) =>
        (prev.discountAmount > current.discountAmount) ? prev : current
        , offers[0]);

    // Calculations
    const lowestPrice = price - bestOffer.discountAmount;
    const emiPrice = Math.ceil(price / 24); // 24 months generic logic

    return (
        <View style={styles.paddingWrapper}>
            <View style={styles.container}>
                {/* Header */}
                <LinearGradient
                    colors={['#1e3a8a', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoText}>WOW!</Text>
                        <Text style={styles.logoSubText}>DEAL</Text>
                    </View>
                    <Text style={styles.headerText}>Apply offers for maximum savings</Text>
                    <Ionicons name="chevron-up" size={20} color="#FFFFFF" />
                </LinearGradient>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.pricingSplit}>
                        <View style={styles.leftPrice}>
                            <Text style={styles.finalPrice}>₹{lowestPrice.toLocaleString()}</Text>
                            <Text style={styles.priceLabel}>Lowest price for you</Text>
                        </View>
                        <View style={styles.divider}>
                            <Text style={styles.orText}>OR</Text>
                        </View>
                        <View style={styles.rightPrice}>
                            <Text style={styles.emiPrice}>₹{emiPrice.toLocaleString()} x 24m</Text>
                            <Text style={styles.priceLabel}>Pay ₹{(emiPrice * 24).toLocaleString()}</Text>
                        </View>
                    </View>

                    {/* Best Offer Box */}
                    <View style={styles.exchangeBox}>
                        <View style={styles.exchangeHeader}>
                            <Text style={styles.exchangeTitle}>{bestOffer.type} Offer</Text>
                            <TouchableOpacity>
                                <Text style={styles.applyText}>Apply</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.exchangeRow}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="pricetag" size={16} color="#4B5563" />
                            </View>
                            <View style={styles.exchangeInfo}>
                                <View style={styles.valueRow}>
                                    <Text style={styles.uptoText}>Save ₹{bestOffer.discountAmount.toLocaleString()}</Text>
                                    <View style={styles.bonusBadge}>
                                        <Text style={styles.bonusText}>{bestOffer.title}</Text>
                                    </View>
                                </View>
                                <Text style={styles.phoneModel} numberOfLines={1}>{bestOffer.description}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    paddingWrapper: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EFF6FF',
        backgroundColor: '#F0F9FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    logoBadge: {
        backgroundColor: '#000000',
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        transform: [{ skewX: '-10deg' }]
    },
    logoText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 10,
        fontStyle: 'italic',
    },
    logoSubText: {
        color: '#FFFFFF',
        fontSize: 8,
        marginTop: -2,
        fontWeight: '700',
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: '600',
        flex: 1,
        fontSize: 13,
    },
    content: {
        padding: 12,
    },
    pricingSplit: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    leftPrice: {
        flex: 1,
        backgroundColor: '#DBEAFE',
        padding: 10,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    finalPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E3A8A',
    },
    priceLabel: {
        fontSize: 11,
        color: '#4B5563',
    },
    divider: {
        width: 20,
        alignItems: 'center',
        zIndex: 10,
        marginLeft: -10,
        marginRight: -10,
    },
    orText: {
        backgroundColor: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        padding: 4,
        borderRadius: 10,
        color: '#4B5563',
    },
    rightPrice: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: 1,
        borderColor: '#DBEAFE',
        paddingLeft: 20,
    },
    emiPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    exchangeBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    exchangeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    exchangeTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4B5563',
    },
    applyText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },
    exchangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    exchangeInfo: {
        flex: 1,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        flexWrap: 'wrap',
    },
    uptoText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 8,
    },
    bonusBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    bonusText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#92400E',
    },
    phoneModel: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    }
});
