import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';

const { width } = Dimensions.get('window');

interface Offer {
    _id: string;
    title: string;
    productId: {
        _id: string;
        title: string;
        price: number;
        image: string;
    };
    minSpendAmount: number;
    dealPrice: number;
}

export function StealDealSection() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await api.get('/api/offers/active');
            setOffers(response.data);
        } catch (error) {
            console.error('Failed to fetch steal deals:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || offers.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <View style={styles.stealDealBadge}>
                    <Text style={styles.stealDealText}>STEAL DEALS</Text>
                </View>
                <Text style={styles.pickAnyText}>Pick any one!</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {offers.map((offer) => (
                    <TouchableOpacity key={offer._id} style={styles.card} activeOpacity={0.9}>
                        {/* Header Bar */}
                        <View style={styles.headerBar}>
                            <MaterialCommunityIcons name="shopping" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                            <Text style={styles.headerText}>
                                Shop for ₹{offer.minSpendAmount} to unlock this deal
                            </Text>
                        </View>

                        <View style={styles.cardContent}>
                            {/* Product Image */}
                            <Image
                                source={{ uri: offer.productId.image }}
                                style={styles.productImage}
                                resizeMode="contain"
                            />

                            {/* Product Details */}
                            <View style={styles.detailsContainer}>
                                {/* Weight Badge - Hardcoded for demo if not in API, or mock it */}
                                <View style={styles.weightBadge}>
                                    <Text style={styles.weightText}>250 g</Text>
                                </View>

                                <Text style={styles.productTitle} numberOfLines={2}>
                                    {offer.productId.title}
                                </Text>

                                <View style={styles.priceRow}>
                                    <View style={styles.dealPriceBadge}>
                                        <Text style={styles.dealPriceText}>₹{offer.dealPrice}</Text>
                                    </View>
                                    <Text style={styles.originalPriceText}>
                                        current price ₹{offer.productId.price}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    stealDealBadge: {
        backgroundColor: '#15803d', // Green
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
        transform: [{ skewX: '-10deg' }], // Slight skew for dynamic look if desired, or just standard
    },
    stealDealText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
        fontStyle: 'italic',
    },
    pickAnyText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        width: width * 0.75, // Reduced width
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerBar: {
        backgroundColor: '#D35400', // Dark Orange matching screenshot
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 12,
    },
    detailsContainer: {
        flex: 1,
    },
    weightBadge: {
        backgroundColor: '#F5F5F5',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 6,
    },
    weightText: {
        fontSize: 10,
        color: '#666666',
        fontWeight: '500',
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 8,
        lineHeight: 20,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dealPriceBadge: {
        backgroundColor: '#FFEB3B', // Yellow
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    dealPriceText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    originalPriceText: {
        fontSize: 12,
        color: '#757575',
        textDecorationLine: 'line-through',
        textDecorationColor: 'red',
    },
});
