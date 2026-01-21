import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../src/lib/api';

interface ReturnItem {
    productId: {
        title: string;
        images: string[];
    };
    quantity: number;
    price: number;
}

interface ReturnRequest {
    _id: string;
    returnRequestNumber: string;
    orderId: {
        _id: string;
        orderNumber: string;
    };
    items: ReturnItem[];
    status: string;
    refundAmount: number;
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending', color: '#F59E0B' },
    APPROVED: { label: 'Approved', color: '#10B981' },
    REJECTED: { label: 'Rejected', color: '#EF4444' },
    PICKUP_SCHEDULED: { label: 'Pickup Scheduled', color: '#8B5CF6' },
    PICKED_UP: { label: 'Picked Up', color: '#6366F1' },
    RECEIVED: { label: 'Received', color: '#14B8A6' },
    INSPECTING: { label: 'Inspecting', color: '#F97316' },
    REFUND_INITIATED: { label: 'Refund Initiated', color: '#06B6D4' },
    REFUND_COMPLETED: { label: 'Refund Completed', color: '#059669' },
};

export default function MyReturnsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReturns = async () => {
        try {
            const res = await api.get('/api/returns/mine');
            // The API returns { returns: [...] } based on backend implementation
            setReturns(res.data.returns || []);
        } catch (e) {
            console.error("Failed to fetch returns", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReturns();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchReturns();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const renderReturnItem = ({ item }: { item: ReturnRequest }) => {
        // Display first item image/title as representative
        const firstItem = item.items[0];
        const itemsCount = item.items.reduce((sum, i) => sum + i.quantity, 0);
        const statusConfig = STATUS_CONFIG[item.status] || { label: item.status, color: '#6B7280' };

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
            // Later can add detail screen: onPress={() => router.push(`/returns/${item._id}`)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.returnNumber}>#{item.returnRequestNumber}</Text>
                        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}15` }]}>
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                            {statusConfig.label}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.imageContainer}>
                        {firstItem?.productId?.images?.[0] ? (
                            <Image
                                source={{ uri: firstItem.productId.images[0] }}
                                style={styles.productImage}
                            />
                        ) : (
                            <View style={[styles.productImage, { backgroundColor: '#F3F4F6' }]} />
                        )}
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.productTitle} numberOfLines={2}>
                            {firstItem?.productId?.title || 'Unknown Product'}
                        </Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.itemsText}>
                                {itemsCount} item{itemsCount > 1 ? 's' : ''}
                            </Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.refundText}>Refund: ₹{item.refundAmount.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Returns</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={returns}
                renderItem={renderReturnItem}
                keyExtractor={item => item._id}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2874F0" />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="assignment-return" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>No returns found</Text>
                            <Text style={styles.emptySubtitle}>You haven't requested any returns yet</Text>
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
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
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
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    returnNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    dateText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        marginRight: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemsText: {
        fontSize: 12,
        color: '#6B7280',
    },
    dot: {
        fontSize: 12,
        color: '#D1D5DB',
        marginHorizontal: 8,
    },
    refundText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#10B981',
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
    },
});
