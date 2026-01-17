import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../lib/api';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');
// Calculate width for 3-column layout
// Screen width - (horizontal padding * 2) - (gap * 2) / 3
const PADDING = 12; // Section padding
const GAP = 8; // Gap between cards
const CARD_WIDTH = (width - (PADDING * 2) - (GAP * 2)) / 3;

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    rating?: number;
}

interface GrocerySectionProps {
    categoryId?: string; // Optional for now as we might use dummy
}

export default function GrocerySection({ categoryId = 'DUMMY_GROCERY_ID' }: GrocerySectionProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [categoryId]);

    const fetchProducts = async () => {
        try {
            let endpoint = '/api/products?limit=6';

            // If a valid category ID is provided (not the default placeholder), filter by it
            if (categoryId && categoryId !== 'REPLACE_WITH_REAL_ID') {
                endpoint += `&category=${categoryId}`;
            }

            const response = await api.get(endpoint);
            let productsData = Array.isArray(response.data) ? response.data : (response.data.products || []);

            // Map backend data (title -> name) and fix category display
            productsData = productsData.map((product: any) => ({
                ...product,
                name: product.title || product.name,
                category: 'Grocery'
            }));

            setProducts(productsData.slice(0, 6));
        } catch (error) {
            console.error('Error fetching grocery products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeeAll = () => {
        router.push({
            pathname: '/common-category/[id]',
            params: { id: categoryId, name: 'Grocery' }
        });
    };

    if (loading || products.length === 0) {
        return null; // Or a loading skeleton
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Popular Grocery Products for You</Text>
                <TouchableOpacity onPress={handleSeeAll} style={styles.arrowButton}>
                    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {products.map((product) => (
                    <View key={product._id} style={styles.cardWrapper}>
                        <ProductCard
                            product={product}
                            onPress={() => router.push(`/product/${product._id}`)}
                            width={CARD_WIDTH}
                        />
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.moreButton} onPress={handleSeeAll}>
                <Ionicons name="arrow-down-outline" size={16} color="#2563EB" />
                <Text style={styles.moreText}>More below</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        paddingHorizontal: PADDING,
        paddingVertical: 16,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
        marginRight: 8,
    },
    arrowButton: {
        backgroundColor: '#1F2937', // Black/Dark Gray
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
    },
    cardWrapper: {
        marginBottom: GAP,
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    moreText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#2563EB',
    },
});
