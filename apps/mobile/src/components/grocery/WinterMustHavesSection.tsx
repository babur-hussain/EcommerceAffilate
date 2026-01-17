import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const WINTER_IDS = [
    '69675480b5f185ae0ee5bad3', // Premium Tea
    '69675480b5f185ae0ee5bad6', // Premium Coffee
    '69675481b5f185ae0ee5baf4', // Premium Soups
    // Filling with others since we only found 3 matches above or use duplicates for demo
    '69675480b5f185ae0ee5bad3',
    '69675480b5f185ae0ee5bad6',
    '69675481b5f185ae0ee5baf4',
];

export function WinterMustHavesSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/products?limit=200');
            const allProducts: Product[] = response.data;

            const filtered = allProducts.filter(p => WINTER_IDS.includes(p._id));
            // Ensure unique items if ID list has duplicates for demo filling
            const unique = Array.from(new Set(filtered.map(p => p._id))).map(id => filtered.find(p => p._id === id));

            setProducts(unique as Product[]);
        } catch (error) {
            console.error('Failed to fetch winter products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || products.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Winter Must Haves</Text>
                <TouchableOpacity style={styles.arrowButton}>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

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
        marginBottom: 24,
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
        gap: 0,
    },
});
