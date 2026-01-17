import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const SMART_BASKET_IDS = [
    '69668824a35b0a2c24fa8387', // Extra Virgin Olive Oil (1L)
    '6967547db5f185ae0ee5ba7f', // Premium Ready-to-Use Masala Pastes
    '6967547db5f185ae0ee5ba85', // Premium Salt
    '6967547db5f185ae0ee5ba88', // Premium Mustard Oil
    '6967547db5f185ae0ee5ba8b', // Premium Sunflower Oil
    '6967547db5f185ae0ee5ba8e', // Premium Soybean Oil
];

export function YourSmartBasketSection() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/products?limit=200');
            const allProducts: Product[] = response.data;

            const filtered = allProducts.filter(p => SMART_BASKET_IDS.includes(p._id));
            const ordered = SMART_BASKET_IDS.map(id => filtered.find(p => p._id === id)).filter(Boolean) as Product[];

            setProducts(ordered.length > 0 ? ordered : filtered.slice(0, 6));
        } catch (error) {
            console.error('Failed to fetch smart basket products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || products.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Absolute Background Image - Scales with content height */}
            <Image
                source={{ uri: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768384854/IMG_1815_zma9n8.jpg' }}
                style={styles.backgroundImage}
                resizeMode="stretch"
            />

            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitleSmall}>YOUR</Text>
                        <View style={styles.titleRow}>
                            <View style={styles.smartBadge}>
                                <Text style={styles.smartText}>SMART</Text>
                            </View>
                            <Text style={styles.headerTitleLarge}>BASKET</Text>
                        </View>
                    </View>

                    <View style={styles.saveBadge}>
                        <Text style={styles.saveLabel}>Save minimum</Text>
                        <View style={styles.amountContainer}>
                            <Text style={styles.rupeeSymbol}>₹</Text>
                            <Text style={styles.saveAmount}>300</Text>
                        </View>
                    </View>
                </View>

                {/* Products List */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {products.map((product) => (
                        <ProductCardStyle1 key={product._id} product={product} />
                    ))}
                </ScrollView>

                {/* View All Button */}
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => router.push('/smart-basket')}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#1F2937" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FFF', // Fallback
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 20,
        marginBottom: 16,
    },
    headerTitleSmall: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 2,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smartBadge: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 6,
    },
    smartText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
        fontStyle: 'italic',
    },
    headerTitleLarge: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    saveBadge: {
        backgroundColor: '#FDE047',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    saveLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 0,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rupeeSymbol: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 1,
    },
    saveAmount: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F2937',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    viewAllButton: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 4,
    },
});
