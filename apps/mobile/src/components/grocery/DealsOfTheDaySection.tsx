import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const DEALS_CATEGORY_IDS = [
    '6966996a81e3721fae838d66', // Biscuits & Cookies
    '6966996e81e3721fae838dea', // Detergents
    '6966996781e3721fae838cee', // Mustard Oil
    '6966996681e3721fae838cc1', // Rice
    '6966996981e3721fae838d24', // White Sugar
];

export function DealsOfTheDaySection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Mock data fallback
            setProducts([
                { _id: 'dd1', title: 'Good Day Biscuits', price: 20, mrp: 25, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/cookie-biscuit/k/2/k/-original-imagp4m8m8z8m8z8.jpeg?q=70', netWeight: '100g', rating: 4.4, ratingCount: 8, categoryDetails: { _id: 'c6', name: 'Snacks' } },
                { _id: 'dd2', title: 'Detergent Powder 1kg', price: 90, mrp: 130, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/washing-powder/c/3/c/-original-imagg6t6g6t6g6t6.jpeg?q=70', netWeight: '1 kg', rating: 4.3, ratingCount: 12, categoryDetails: { _id: 'c7', name: 'Household' } },
                { _id: 'dd3', title: 'Sugar 1kg', price: 42, mrp: 50, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sugar/j/k/l/-original-imagm2h2m2h2m2h2.jpeg?q=70', netWeight: '1 kg', rating: 4.5, ratingCount: 20, categoryDetails: { _id: 'c8', name: 'Staples' } },
            ]);
        } catch (error) {
            console.error('Failed to fetch deals items:', error);
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
                <Text style={styles.headerTitle}>Deals of the day!</Text>
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
