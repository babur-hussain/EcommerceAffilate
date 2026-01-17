import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../../lib/api';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function FiftyPercentOffZone() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Fetch a batch of products to find those with high discounts
            const response = await api.get('/api/products?limit=50');
            const allProducts = Array.isArray(response.data) ? response.data : (response.data.products || []);

            const highDiscountProducts = allProducts
                .filter((p: any) => {
                    if (!p.mrp || !p.price) return false;
                    const discount = ((p.mrp - p.price) / p.mrp) * 100;
                    return discount >= 50;
                })
                .map((p: any) => ({
                    ...p,
                    discountPercent: Math.round(((p.mrp - p.price) / p.mrp) * 100)
                }))
                .slice(0, 10); // Show top 10 matches

            setProducts(highDiscountProducts);
        } catch (error) {
            console.error("Error fetching 50% off zone products:", error);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/product/${item._id}`)}
        >
            <TouchableOpacity style={styles.wishlistButton}>
                <Ionicons name="heart-outline" size={20} color="#EF4444" />
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150' }}
                    style={styles.productImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.cardContent}>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#EF4444" />
                </TouchableOpacity>

                <View style={styles.priceRow}>
                    <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>₹{item.price}</Text>
                    </View>
                    <Text style={styles.mrpText}>₹{item.mrp}</Text>
                </View>

                <Text style={styles.discountText}>{item.discountPercent}% OFF</Text>

                <Text style={styles.productTitle} numberOfLines={2}>{item.title || item.name}</Text>
                {/* Display stock or unit if available, otherwise omit to avoid hardcoded fake data */}
                {item.stock && item.stock < 20 && (
                    <Text style={styles.weightText}>{item.stock} left</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    if (products.length === 0) return null;

    return (
        <View style={styles.container}>
            {/* Header Section with Background Graphic */}
            <View style={styles.headerContainer}>
                {/* Background Pattern (Simulated with absolute views or gradient) */}
                <View style={styles.headerBackground}>
                    <LinearGradient
                        colors={['#F0F9FF', '#E0F2FE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    {/* Decorative wavy lines placeholder */}
                    <View style={styles.wavyDecoration} />
                </View>

                <View style={styles.headerTextContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.titlePercent}>50%</Text>
                        <View>
                            <Text style={styles.titleOff}>OFF</Text>
                            <Text style={styles.titleZone}>ZONE</Text>
                        </View>
                        {/* Sparkles/Stars */}
                        <Ionicons name="sparkles" size={16} color="#3B82F6" style={{ marginBottom: 10, marginLeft: 4 }} />
                    </View>
                    <Text style={styles.subtitle}>Half the price, double the joy!</Text>
                </View>

                {/* Header Banner Image */}
                <View style={styles.headerImageContainer}>
                    <Image
                        source={{ uri: 'https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-grocery-shopping-bag-isolated-png-image_11549419.png' }} // Better isolated grocery bag image
                        style={styles.headerImage}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />

            {/* See All Button */}
            <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See all</Text>
                <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginVertical: 12,
        paddingBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden',
        height: 120, // Fixed height for banner look
        alignItems: 'center',
    },
    headerBackground: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    wavyDecoration: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 150,
        backgroundColor: 'transparent',
        // In a real app, use an SVG or Image background for the wavy pattern. 
        // Simulating subtle border for now
        borderLeftWidth: 40,
        borderLeftColor: 'rgba(255,255,255,0.3)',
        transform: [{ skewX: '-20deg' }]
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 1,
    },
    headerImageContainer: {
        width: 140,
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    titlePercent: {
        fontSize: 42,
        fontWeight: '900',
        color: '#2563EB', // Blue 600
        fontStyle: 'italic',
        includeFontPadding: false,
    },
    titleOff: {
        fontSize: 14,
        fontWeight: '900',
        color: '#2563EB',
        fontStyle: 'italic',
        marginBottom: -4,
        marginLeft: 2,
    },
    titleZone: {
        fontSize: 14,
        fontWeight: '900',
        color: '#3B82F6', // Lighter blue
        fontStyle: 'italic',
        marginLeft: 2,
    },
    subtitle: {
        fontSize: 13,
        color: '#1F2937',
        marginTop: 4,
        fontWeight: '500',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    card: {
        width: 150,
        marginRight: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
    },
    imageContainer: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        position: 'relative',
    },
    addButton: {
        position: 'absolute',
        bottom: 30, // Adjust based on layout
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 8,
        padding: 2,
        zIndex: 5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 6,
    },
    priceBadge: {
        backgroundColor: '#16A34A', // Green
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priceText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    mrpText: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
        fontSize: 12,
    },
    discountText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#16A34A',
        marginBottom: 4,
    },
    productTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
        height: 36, // Fixed height for 2 lines
    },
    weightText: {
        fontSize: 11,
        color: '#6B7280',
    },
    seeAllButton: {
        backgroundColor: '#EEF2FF', // Light indigo/purple
        marginHorizontal: 16,
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    seeAllText: {
        color: '#4F46E5', // Indigo 600
        fontWeight: '600',
        fontSize: 14,
    }
});
