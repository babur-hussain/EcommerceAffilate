import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import api from '../../lib/api';
import ProductCard from '../../components/homepage/ProductCard';

// Reuse Product type or import shared
interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    description?: string;
    discount?: number;
}

export default function SearchResults() {
    const router = useRouter();
    const { q } = useLocalSearchParams(); // Query param
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('relevance');

    useEffect(() => {
        if (q) {
            fetchResults(q as string);
        }
    }, [q, sort]);

    const fetchResults = async (query: string) => {
        setLoading(true);
        try {
            // Mock sort param usage if backend supports it
            const response = await api.get(`/api/products?search=${encodeURIComponent(query)}&limit=20`);
            const data = response.data.products || response.data;

            let sortedData = Array.isArray(data) ? data : [];

            // Client side sort if needed, simplified
            if (sort === 'price_asc') sortedData.sort((a, b) => a.price - b.price);
            if (sort === 'price_desc') sortedData.sort((a, b) => b.price - a.price);

            setProducts(sortedData);
        } catch (error) {
            console.error('Search results error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSortPress = () => {
        // Simple toggle for demo
        if (sort === 'relevance') setSort('price_asc');
        else if (sort === 'price_asc') setSort('price_desc');
        else setSort('relevance');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => router.back()} // Go back to search input
                >
                    <Ionicons name="search" size={18} color="#6B7280" />
                    <Text style={styles.searchText} numberOfLines={1}>{q}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Feather name="filter" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {/* Sort / Utils Bar */}
            <View style={styles.utilsBar}>
                <Text style={styles.resultsCount}>{products.length} results found</Text>
                <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
                    <Text style={styles.sortText}>
                        Sort: {sort === 'relevance' ? 'Relevant' : sort === 'price_asc' ? 'Low to High' : 'High to Low'}
                    </Text>
                    <Feather name="chevron-down" size={14} color="#4B5563" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF6F00" />
                </View>
            ) : products.length > 0 ? (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View style={styles.gridItem}>
                            <ProductCard
                                product={item}
                                onPress={() => router.push(`/product/${item._id}`)}
                            />
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6134/6134065.png' }}
                        style={styles.emptyImage}
                    />
                    <Text style={styles.emptyTitle}>No results found</Text>
                    <Text style={styles.emptySubtitle}>Try searching for something else</Text>
                    <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
                        <Text style={styles.goBackText}>Search Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
        marginRight: 12,
    },
    searchText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#111827',
        fontWeight: '500',
        flex: 1,
    },
    filterButton: {
        padding: 4,
    },
    utilsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    resultsCount: {
        fontSize: 13,
        color: '#6B7280',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortText: {
        fontSize: 13,
        color: '#4B5563',
        marginRight: 4,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 8,
    },
    gridItem: {
        flex: 1,
        maxWidth: '50%',
        padding: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyImage: {
        width: 120,
        height: 120,
        marginBottom: 24,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    goBackButton: {
        backgroundColor: '#FF6F00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    goBackText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
