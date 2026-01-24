import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

const SOFT_SKIN_IDS = [
    '69675486b5f185ae0ee5bb7e', // Premium Dishwash Bars & Liquids
    '6967547eb5f185ae0ee5ba91', // Premium Groundnut Oil
    '6967547db5f185ae0ee5ba85', // Premium Salt
    '6967547fb5f185ae0ee5bab5', // Premium Figs
    '6967547fb5f185ae0ee5babe', // Premium White Sugar
    '69675480b5f185ae0ee5bad3', // Premium Tea
];

export function SoftSkinSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setProducts([
                { _id: 'ss1', title: 'Moisturizing Cream', price: 250, mrp: 300, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/moisturizer-cream/e/d/e/-original-imaghfcpz8zq8frz.jpeg?q=70', netWeight: '200ml', rating: 4.6, ratingCount: 150, categoryDetails: { _id: 'c11', name: 'Personal Care' } },
                { _id: 'ss2', title: 'Body Lotion', price: 180, mrp: 220, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/body-lotion/j/k/l/-original-imagg9k8z6c7qg5z.jpeg?q=70', netWeight: '100ml', rating: 4.5, ratingCount: 80, categoryDetails: { _id: 'c11', name: 'Personal Care' } },
                { _id: 'ss3', title: 'Face Wash', price: 150, mrp: 199, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/face-wash/m/n/o/-original-imagm2h2m2h2m2h2.jpeg?q=70', netWeight: '100g', rating: 4.7, ratingCount: 200, categoryDetails: { _id: 'c11', name: 'Personal Care' } },
            ]);
        } catch (error) {
            console.error('Failed to fetch soft skin products:', error);
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
                <Text style={styles.headerTitle}>Soft Skin Everyday</Text>
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
        marginTop: 0, // Tight spacing below specials
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
