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
            const response = await api.get('/api/products/public/random');

            // Filter products to only show Grocery items (parent or direct)
            const GROCERY_CATEGORY_ID = "696686d02c5aacc146652e03";
            const groceryProducts = response.data.filter((product: Product) => {
                const categoryId = product.categoryDetails?._id;
                const parentCategoryId = product.categoryDetails?.parentCategory;
                return categoryId === GROCERY_CATEGORY_ID || parentCategoryId === GROCERY_CATEGORY_ID;
            });

            setProducts(groceryProducts);
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
