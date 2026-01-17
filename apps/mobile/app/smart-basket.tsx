import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../src/lib/api';
import { ProductCardStyle1, Product } from '../src/components/grocery/ProductCardStyle1';

const CATEGORY_IDS = [
    '69668824a35b0a2c24fa8387', // Extra Virgin Olive Oil (1L)
    '6967547db5f185ae0ee5ba7f', // Premium Ready-to-Use Masala Pastes
    '6967547db5f185ae0ee5ba85', // Premium Salt
    '6967547db5f185ae0ee5ba88', // Premium Mustard Oil
    '6967547db5f185ae0ee5ba8b', // Premium Sunflower Oil
    '6967547db5f185ae0ee5ba8e', // Premium Soybean Oil
    '6967547db5f185ae0ee5ba91', // Premium Groundnut Oil
    '6967547db5f185ae0ee5ba94', // Premium Rice Bran Oil
];

export default function SmartBasketScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/products?limit=200');
            const allProducts: Product[] = response.data;

            // In a real scenario, we'd filter by category ID. Here we filter by specific product IDs as proxies for "Smart Basket" items
            const filtered = allProducts.filter(p => CATEGORY_IDS.includes(p._id));
            setProducts(filtered);
        } catch (error) {
            console.error('Failed to fetch smart basket items:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Smart Basket</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF9800" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.grid}>
                        {products.map((product) => (
                            <View key={product._id} style={styles.gridItem}>
                                <ProductCardStyle1 product={product} />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF8E7',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        marginBottom: 12,
    },
});
