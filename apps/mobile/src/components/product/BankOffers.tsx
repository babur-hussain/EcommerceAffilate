import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Offer {
    type: string;
    title: string;
    description: string;
    discountAmount: number;
    code?: string;
}

interface BankOffersProps {
    offers?: Offer[];
}

// Helper to get icon based on offer type
const getOfferIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'bank': return 'https://cdn-icons-png.flaticon.com/512/825/825454.png';
        case 'exchange': return 'https://cdn-icons-png.flaticon.com/512/302/302302.png';
        case 'emi': return 'https://cdn-icons-png.flaticon.com/512/825/825463.png';
        default: return 'https://cdn-icons-png.flaticon.com/512/302/302302.png';
    }
};

export default function BankOffers({ offers }: BankOffersProps) {
    if (!offers || offers.length === 0) {
        return null;
    }

    const totalSavings = offers.reduce((acc, curr) => acc + curr.discountAmount, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Select and apply the best offers</Text>

            {/* Top Summary Row */}
            <View style={styles.summaryRow}>
                <View style={styles.iconRow}>
                    <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                    <Text style={styles.summaryText}>Extra off on Exchange + Banks</Text>
                </View>
                <Text style={styles.summaryValue}>₹{totalSavings.toLocaleString()} off</Text>
            </View>

            <View style={[styles.summaryRow, { borderBottomWidth: 0, marginBottom: 16 }]}>
                <View style={styles.iconRow}>
                    <Ionicons name="radio-button-on" size={18} color="#2563EB" />
                    <Text style={[styles.summaryText, { fontWeight: '700' }]}>All offers</Text>
                </View>
                <Text style={[styles.summaryValue, { fontWeight: '700' }]}>₹{totalSavings.toLocaleString()} off</Text>
            </View>

            {/* Offers Grid */}
            <View style={styles.offersHeader}>
                <Text style={styles.subTitle}>Available offers</Text>
                <Text style={styles.viewLink}>View all</Text>
            </View>

            <View style={styles.grid}>
                {offers.map((offer, index) => (
                    <View key={index} style={styles.card}>
                        {index === 0 && <View style={styles.badge}><Text style={styles.badgeText}>Best Value</Text></View>}

                        <View style={styles.cardHeader}>
                            <Image source={{ uri: getOfferIcon(offer.type) }} style={styles.bankIcon} resizeMode="contain" />
                            <View style={styles.promoCol}>
                                <Text style={styles.promoText}>₹{offer.discountAmount.toLocaleString()} off</Text>
                                <Text style={styles.bankName}>{offer.title}</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.applyText}>Apply</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.cardFooter}>
                            <Text style={styles.desc} numberOfLines={2}>{offer.description || `${offer.type} Offer`}</Text>
                            <Ionicons name="chevron-forward" size={12} color="#9CA3AF" />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#EFF6FF', // Light blue background section
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 13,
        color: '#4B5563',
        marginLeft: 8,
    },
    summaryValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
    },
    offersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    viewLink: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        textDecorationLine: 'underline',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    badge: {
        position: 'absolute',
        top: -10,
        left: 0,
        backgroundColor: '#FDE68A', // Yellow
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 8,
        zIndex: 10,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#92400E',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 8,
    },
    bankIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    promoCol: {
        flex: 1,
    },
    promoText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
    },
    bankName: {
        fontSize: 11,
        color: '#6B7280',
    },
    applyText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    desc: {
        fontSize: 10,
        color: '#6B7280',
        maxWidth: '85%',
    }
});
