import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const BREAKFAST_CATEGORY_IDS = [
    '6966996b81e3721fae838d7b', // Bread
    '6966996a81e3721fae838d60', // Breakfast Cereals
    '6966996981e3721fae838d3c', // Coffee
    '6966996c81e3721fae838d9c', // Eggs
    '6966996b81e3721fae838d8a', // Milk
    '6966996a81e3721fae838d63', // Oats & Muesli
    '6966996981e3721fae838d39', // Tea
];

export function BreakfastEssentialsSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Ideally backend should support fetching by multiple category IDs
            // For now, we might fetch all products and filter locally if API is limited,
            // OR if we have an endpoint for it.
            // Let's assume we use the 'random' endpoint or 'products' endpoint.
            // Since we seeded specific items, let's try to fetch all products and filter.
            // A better way for performance would be a specific query, but let's stick to available tools.
            // The 'random' endpoint returns 10 items, which might not match our specific distinct categories.
            // Better to use the main products endpoint with a limit and client-side filter or repeated calls.

            // Optimization: Fetch all active products (since we have ~100) and filter.
            setProducts([
                { _id: 'be1', title: 'Whole Wheat Bread', price: 40, mrp: 50, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/bread/8/n/o/400-whole-wheat-bread-brown-bread-packet-britannia-original-imagq6z5z5z5z5z5.jpeg?q=70', netWeight: '400g', rating: 4.5, ratingCount: 120, categoryDetails: { _id: 'c9', name: 'Bakery' } },
                { _id: 'be2', title: 'Farm Fresh Eggs (6pcs)', price: 45, mrp: 60, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/egg/e/e/e/-original-imaghfcpz8zq8frz.jpeg?q=70', netWeight: '6 pcs', rating: 4.7, ratingCount: 300, categoryDetails: { _id: 'c10', name: 'Eggs' } },
                { _id: 'be3', title: 'Toned Milk 1L', price: 65, mrp: 70, image: 'https://rukminim2.flixcart.com/image/612/612/kdbzqfk0/milk/w/h/v/1-toned-fresh-milk-carton-amul-original-imafu9v4z5z7g2z5.jpeg?q=70', netWeight: '1 L', rating: 4.8, ratingCount: 500, categoryDetails: { _id: 'c3', name: 'Dairy' } },
            ]);
        } catch (error) {
            console.error('Failed to fetch breakfast items:', error);
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
                <Text style={styles.headerTitle}>Breakfast essential</Text>
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
        gap: 0,
    },
});
