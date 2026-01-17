import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../src/lib/api';

interface OrderItem {
    _id: string;
    items: {
        productId: {
            title: string;
            images: string[];
        };
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function MyOrdersScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders/mine');
            if (res.data) {
                setOrders(res.data);
            }
        } catch (e) {
            console.error("Failed to fetch orders", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchOrders();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'DELIVERED': return '#10B981'; // Green
            case 'CANCELLED': return '#EF4444'; // Red
            case 'SHIPPED': return '#3B82F6';   // Blue
            case 'PROCESSING': return '#F59E0B'; // Amber
            default: return '#6B7280'; // Gray
        }
    };

    const renderOrderItem = ({ item }: { item: OrderItem }) => {
        const mainProduct = item.items[0]?.productId;
        const itemsCount = item.items.reduce((sum, i) => sum + i.quantity, 0);
        const displayDate = new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => router.push(`/orders/${item._id}` as any)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.dateText}>{displayDate}</Text>
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.imageContainer}>
                        {mainProduct?.images?.[0] ? (
                            <Image source={{ uri: mainProduct.images[0] }} style={styles.productImage} />
                        ) : (
                            <View style={[styles.productImage, { backgroundColor: '#F3F4F6' }]} />
                        )}
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.productTitle} numberOfLines={2}>
                            {mainProduct?.title || 'Unknown Product'}
                        </Text>
                        {itemsCount > 1 && (
                            <Text style={styles.moreItemsText}>+ {itemsCount - 1} more items</Text>
                        )}
                        <Text style={styles.priceText}>₹{item.totalAmount.toLocaleString()}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.orderId}>Order #{item._id.slice(-8).toUpperCase()}</Text>
                    <TouchableOpacity
                        style={styles.trackButton}
                        onPress={() => router.push(`/orders/${item._id}` as any)}
                    >
                        <Text style={styles.trackButtonText}>Track Order</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2874F0" />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="bag-handle-outline" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>No orders yet</Text>
                            <Text style={styles.emptySubtitle}>Start shopping to see your orders here!</Text>
                            <TouchableOpacity style={styles.shopNowButton} onPress={() => router.push('/')}>
                                <Text style={styles.shopNowText}>Shop Now</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    moreItemsText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    priceText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    orderId: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'monospace',
    },
    trackButton: {
        // backgroundColor: '#EFF6FF',
        // paddingVertical: 6,
        // paddingHorizontal: 12,
        // borderRadius: 6,
    },
    trackButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 24,
    },
    shopNowButton: {
        backgroundColor: '#2874F0',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopNowText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});
