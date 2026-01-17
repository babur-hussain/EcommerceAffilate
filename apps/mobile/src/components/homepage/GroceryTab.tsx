import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../lib/api';
import ProductCard from './ProductCard';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

const GROCERY_CATEGORIES = ['Grocery', 'Food', 'Beverages', 'Fresh Produce', 'Dairy'];

export default function GroceryTab() {
    const router = useRouter();
    const [groceryProducts, setGroceryProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroceryProducts();
    }, []);

    const fetchGroceryProducts = async () => {
        try {
            const response = await api.get('/api/products?limit=20');
            const products = Array.isArray(response.data) ? response.data : (response.data.products || []);

            // Filter for grocery-related products
            const groceryItems = products.filter((product: Product) =>
                GROCERY_CATEGORIES.some(cat =>
                    product.category?.toLowerCase().includes(cat.toLowerCase())
                )
            );

            setGroceryProducts(groceryItems);
        } catch (error) {
            console.error('Error fetching grocery products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading grocery items...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <MaterialIcons name="local-grocery-store" size={32} color="#10B981" />
                <View style={styles.headerText}>
                    <Text style={styles.title}>Fresh Groceries</Text>
                    <Text style={styles.subtitle}>Daily essentials delivered to your door</Text>
                </View>
            </View>

            <View style={styles.categoryChips}>
                {GROCERY_CATEGORIES.map((category) => (
                    <TouchableOpacity key={category} style={styles.chip}>
                        <Text style={styles.chipText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {groceryProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="shopping-basket" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyText}>No grocery items available</Text>
                    <Text style={styles.emptySubtext}>Check back soon for fresh groceries</Text>
                </View>
            ) : (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Available Products</Text>
                        <Text style={styles.productCount}>{groceryProducts.length} items</Text>
                    </View>

                    <View style={styles.productsGrid}>
                        {groceryProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onPress={() => router.push(`/product/${product._id}`)}
                            />
                        ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerText: {
        marginLeft: 12,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    categoryChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 8,
    },
    chip: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#10B981',
    },
    chipText: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    productCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
});
