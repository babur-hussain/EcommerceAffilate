import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../../../src/lib/api';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface MegaProduct {
    id: string; // Transformed ID
    _id?: string; // Original ID
    title: string;
    price: string; // Formatted price
    original_price?: string;
    image_url: string;
    badge_text?: string;
    rating?: string;
    review_count?: string;
}

interface MegaGridProps {
    data: {
        items?: MegaProduct[];
        dataSource?: {
            endpoint: string;
            params?: any;
        };
        title?: string; // Optional title override
    };
}

export default function MegaGrid({ data }: MegaGridProps) {
    const router = useRouter();
    const [products, setProducts] = useState<MegaProduct[]>(data?.items || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If items are provided directly, usage them.
        if (data?.items && data.items.length > 0) {
            setProducts(data.items);
            return;
        }

        // Otherwise if dataSource is provided, fetch dynamic products
        if (data?.dataSource) {
            fetchProducts();
        }
    }, [data]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { endpoint, params } = data.dataSource!;
            const res = await api.get(endpoint, { params });

            // Normalize data
            const rawList = Array.isArray(res.data) ? res.data : (res.data.products || []);
            const formatted: MegaProduct[] = rawList.map((p: any) => ({
                id: p._id,
                _id: p._id,
                title: p.title || p.name,
                price: `₹${p.price}`,
                original_price: p.mrp ? `₹${p.mrp}` : undefined,
                image_url: p.images?.[0] || 'https://placehold.co/200',
                badge_text: p.discount ? `-${p.discount}%` : undefined,
                rating: p.rating?.toString() || '4.5',
                review_count: p.reviews?.length?.toString() || '10+'
            }));

            setProducts(formatted);
        } catch (e) {
            console.error('MegaGrid fetch error', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: 'center', paddingVertical: 20 }]}>
                <ActivityIndicator color="#DC2626" />
            </View>
        );
    }

    if (!products || products.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {products.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || item._id || index}
                        style={styles.card}
                        onPress={() => router.push(`/product/${item.id || item._id}`)}
                        activeOpacity={0.95}
                    >
                        {item.badge_text && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.badge_text}</Text>
                            </View>
                        )}

                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

                            {(item.rating) && (
                                <View style={styles.ratingRow}>
                                    <MaterialIcons name="star" size={14} color="#FACC15" />
                                    <Text style={styles.ratingText}>{item.rating} ({item.review_count || '0'})</Text>
                                </View>
                            )}

                            <View style={styles.footer}>
                                <View>
                                    {item.original_price && (
                                        <Text style={styles.originalPrice}>{item.original_price}</Text>
                                    )}
                                    <Text style={styles.price}>{item.price}</Text>
                                </View>

                                <TouchableOpacity style={styles.cartButton}>
                                    <MaterialIcons name="add-shopping-cart" size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.viewAllBtn}>
                <Text style={styles.viewAllText}>View All Deals</Text>
                <MaterialIcons name="arrow-forward-ios" size={12} color="#DC2626" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        paddingBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: GAP,
    },
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    badge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#FFD700', // secondary
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderBottomRightRadius: 8,
        zIndex: 10,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'black',
    },
    imageContainer: {
        width: '100%',
        height: 128,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 10,
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    originalPrice: {
        fontSize: 10,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#DC2626', // red
    },
    cartButton: {
        backgroundColor: '#DC2626',
        padding: 8,
        borderRadius: 8,
        shadowColor: 'red',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    viewAllBtn: {
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    viewAllText: {
        color: '#DC2626',
        fontWeight: '600',
        fontSize: 14,
    }
});
