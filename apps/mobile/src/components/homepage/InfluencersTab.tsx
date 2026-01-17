import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

interface Influencer {
    _id: string;
    name: string;
    profileImage?: string;
    bio?: string;
    followers?: number;
    category?: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

export default function InfluencersTab() {
    const router = useRouter();
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInfluencers();
        fetchRecommendedProducts();
    }, []);

    const fetchInfluencers = async () => {
        try {
            const response = await api.get('/api/influencers');
            setInfluencers(response.data || []);
        } catch (error) {
            console.error('Error fetching influencers:', error);
        }
    };

    const fetchRecommendedProducts = async () => {
        try {
            const response = await api.get('/api/products?limit=6');
            const products = Array.isArray(response.data) ? response.data : (response.data.products || []);
            setRecommendedProducts(products);
        } catch (error) {
            console.error('Error fetching recommended products:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatFollowers = (count?: number) => {
        if (!count) return '0';
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading influencers...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <MaterialIcons name="people" size={32} color="#EC4899" />
                <View style={styles.headerText}>
                    <Text style={styles.title}>Top Influencers</Text>
                    <Text style={styles.subtitle}>Discover products from your favorite creators</Text>
                </View>
            </View>

            {influencers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="person-outline" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyText}>No influencers available yet</Text>
                    <Text style={styles.emptySubtext}>Check back soon for featured influencers</Text>
                </View>
            ) : (
                <View style={styles.influencerSection}>
                    <Text style={styles.sectionTitle}>Featured Influencers</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.influencerScroll}>
                        {influencers.map((influencer) => (
                            <TouchableOpacity key={influencer._id} style={styles.influencerCard}>
                                <View style={styles.avatarContainer}>
                                    {influencer.profileImage ? (
                                        <Image source={{ uri: influencer.profileImage }} style={styles.avatar} />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <MaterialIcons name="person" size={32} color="#9CA3AF" />
                                        </View>
                                    )}
                                    <View style={styles.verifiedBadge}>
                                        <MaterialIcons name="verified" size={16} color="#3B82F6" />
                                    </View>
                                </View>
                                <Text style={styles.influencerName} numberOfLines={1}>
                                    {influencer.name}
                                </Text>
                                <Text style={styles.followers}>
                                    {formatFollowers(influencer.followers)} followers
                                </Text>
                                <TouchableOpacity style={styles.followButton}>
                                    <Text style={styles.followButtonText}>Follow</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {recommendedProducts.length > 0 && (
                <View style={styles.productsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Influencer Picks</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.productsList}>
                        {recommendedProducts.map((product) => (
                            <TouchableOpacity
                                key={product._id}
                                style={styles.productCard}
                                onPress={() => router.push(`/product/${product._id}`)}
                            >
                                {product.images?.[0] && (
                                    <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                                )}
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.productPrice}>₹{product.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
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
    influencerSection: {
        paddingVertical: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    influencerScroll: {
        paddingLeft: 16,
    },
    influencerCard: {
        width: 140,
        marginRight: 12,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#EC4899',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
    },
    influencerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 4,
    },
    followers: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    followButton: {
        backgroundColor: '#EC4899',
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 16,
    },
    followButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    productsSection: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAll: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
    },
    productsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#F3F4F6',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
});
