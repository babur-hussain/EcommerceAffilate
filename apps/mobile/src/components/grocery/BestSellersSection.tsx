import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const BEST_SELLER_IDS = [
    '69675484b5f185ae0ee5bb45', // Premium Mayonnaise
    '69675481b5f185ae0ee5bafd', // Premium Oats & Muesli
    '69675480b5f185ae0ee5badc', // Premium Energy Drinks
    '6967547bb5f185ae0ee5ba61', // Premium Maida & Sooji
    '6967547db5f185ae0ee5ba7f', // Premium Ready-to-Use Masala Pastes
    '6967547cb5f185ae0ee5ba6d', // Premium Poha, Daliya, Sabudana
];

export function BestSellersSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Fetch all products and filter by ID locally
            // Ideally backend would support GET /products?ids=...
            const response = await api.get('/api/products?limit=200');
            const allProducts: Product[] = response.data;

            const filtered = allProducts.filter(p => BEST_SELLER_IDS.includes(p._id));

            // Maintain the order of IDs in BEST_SELLER_IDS if possible, or just filtered result
            const ordered = BEST_SELLER_IDS.map(id => filtered.find(p => p._id === id)).filter(Boolean) as Product[];

            setProducts(ordered.length > 0 ? ordered : filtered.slice(0, 6));
        } catch (error) {
            console.error('Failed to fetch best sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || products.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bestsellers</Text>
                <TouchableOpacity style={styles.arrowButton}>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Horizontal Scroll List */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {products.map((product) => (
                    <ProductCardStyle1 key={product._id} product={product} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    arrowButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 0, // Using 0 gap as per user's latest preference
    },
});
