import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import api from '../../lib/api';
import { ProductCardStyle1, Product } from './ProductCardStyle1';

export function TopPicksSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Mock data fallback
            setProducts([
                { _id: 'tp1', title: 'Fresh Bananas', price: 40, mrp: 60, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/fruit/e/s/q/-original-imagz6f2x9p8g6hz.jpeg?q=70', netWeight: '1 kg', rating: 4.5, ratingCount: 100, categoryDetails: { _id: 'c1', name: 'Fruits' } },
                { _id: 'tp2', title: 'Farm Fresh Tomatoes', price: 30, mrp: 40, image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/vegetable/q/u/u/-original-imag5q25xgu5d22s.jpeg?q=70', netWeight: '1 kg', rating: 4.2, ratingCount: 50, categoryDetails: { _id: 'c2', name: 'Vegetables' } },
                { _id: 'tp3', title: 'Cow Milk', price: 70, mrp: 75, image: 'https://rukminim2.flixcart.com/image/612/612/kdbzqfk0/milk/w/h/v/1-toned-fresh-milk-carton-amul-original-imafu9v4z5z7g2z5.jpeg?q=70', netWeight: '1 L', rating: 4.8, ratingCount: 200, categoryDetails: { _id: 'c3', name: 'Dairy' } },
            ]);
        } catch (error) {
            console.error('Failed to fetch top picks:', error);
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
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Top Picks for You</Text>
                    <Text style={styles.headerSubtitle}>Based on what is popular around you</Text>
                </View>
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
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    arrowButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1F2937', // Dark grey/black arrow button
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 0,
    },
});
