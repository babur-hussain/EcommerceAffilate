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
            // Mock data fallback
            setProducts([
                { _id: 'bs1', title: 'Premium Basmati Rice', price: 249, mrp: 350, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/rice/y/n/z/5-super-premium-basmati-rice-bag-1-kohinoor-original-imags3x2y7h7qshz.jpeg?q=70', netWeight: '5 kg', rating: 4.8, ratingCount: 200, categoryDetails: { _id: 'c4', name: 'Staples' } },
                { _id: 'bs2', title: 'Sunflower Oil 1L', price: 180, mrp: 220, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/edible-oil/g/v/t/-original-imagg9k8z6c7qg5z.jpeg?q=70', netWeight: '1 L', rating: 4.6, ratingCount: 150, categoryDetails: { _id: 'c5', name: 'Oil' } },
                { _id: 'bs3', title: 'Atta 5kg', price: 210, mrp: 250, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/flour/z/t/t/5-sharbati-atta-1-bag-aashirvaad-original-imafv2z2g3z2g3z2.jpeg?q=70', netWeight: '5 kg', rating: 4.7, ratingCount: 180, categoryDetails: { _id: 'c4', name: 'Staples' } },
            ]);
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
