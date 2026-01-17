import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import api from '../../src/lib/api';

const ORDER_STATUS_STEPS = [
    { key: 'CREATED', label: 'Order Placed', icon: 'clipboard-list' },
    { key: 'PAID', label: 'Payment Confirmed', icon: 'credit-card' },
    { key: 'PROCESSING', label: 'Processing', icon: 'box-open' },
    { key: 'SHIPPED', label: 'Shipped', icon: 'shipping-fast' },
    { key: 'DELIVERED', label: 'Delivered', icon: 'home' },
];

interface OrderDetails {
    _id: string;
    items: {
        productId: {
            title: string;
            images: string[];
            price: number;
        };
        quantity: number;
        price: number;
    }[];
    shippingAddress: {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
    deliveryPartnerId?: {
        name: string;
        phone: string;
    };
    paymentStatus: string;
    paymentProvider: string;
}

export default function OrderTrackingScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data);
        } catch (e: any) {
            setError(e.response?.data?.error || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = (status: string) => {
        const index = ORDER_STATUS_STEPS.findIndex(s => s.key === status);
        // Handle intermediate/failure states if necessary
        if (status === 'CANCELLED') return -1;
        if (status === 'RETURNED') return 5;
        return index;
    };

    const currentStepIndex = order ? getStatusIndex(order.status) : 0;

    const renderTimeline = () => {
        return (
            <View style={styles.timelineContainer}>
                {ORDER_STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <View key={step.key} style={styles.timelineStep}>
                            <View style={styles.stepIndicatorContainer}>
                                <View style={[
                                    styles.stepLine,
                                    index === 0 && { backgroundColor: 'transparent' }, // No line before first step
                                    index <= currentStepIndex && index !== 0 && { backgroundColor: '#10B981' }
                                ]} />

                                <Animated.View
                                    style={[
                                        styles.stepIconContainer,
                                        isCompleted ? styles.stepIconCompleted : styles.stepIconPending,
                                        isCurrent && styles.stepIconCurrent
                                    ]}
                                >
                                    <FontAwesome5
                                        name={step.icon}
                                        size={14}
                                        color={isCompleted ? 'white' : '#9CA3AF'}
                                    />
                                </Animated.View>

                                <View style={[
                                    styles.stepLine,
                                    index === ORDER_STATUS_STEPS.length - 1 && { backgroundColor: 'transparent' }, // No line after last step
                                    index < currentStepIndex && { backgroundColor: '#10B981' }
                                ]} />
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={[
                                    styles.stepTitle,
                                    isCompleted ? styles.textCompleted : styles.textPending
                                ]}>
                                    {step.label}
                                </Text>
                                {isCurrent && (
                                    <Text style={styles.stepSubtitle}>
                                        {order?.status === 'DELIVERED' ? 'Your item has been delivered' : 'In Progress'}
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Order Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerContent}>
                    <Text>Loading order details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !order) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Error</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerContent}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text style={styles.errorText}>{error || 'Order not found'}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Order ID & Date */}
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.sectionCard}>
                    <View style={styles.orderHeaderRow}>
                        <View>
                            <Text style={styles.orderIdLabel}>Order ID</Text>
                            <Text style={styles.orderIdText}>#{order._id.slice(-8).toUpperCase()}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.orderDateLabel}>Date</Text>
                            <Text style={styles.orderDateText}>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Tracking Timeline */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Order Status</Text>
                    {renderTimeline()}
                </Animated.View>

                {/* Delivery Partner Info */}
                {order.deliveryPartnerId && (
                    <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Delivery Partner</Text>
                        <View style={styles.partnerRow}>
                            <View style={styles.partnerAvatar}>
                                <FontAwesome5 name="user-alt" size={20} color="#4B5563" />
                            </View>
                            <View style={styles.partnerInfo}>
                                <Text style={styles.partnerName}>{order.deliveryPartnerId.name}</Text>
                                <Text style={styles.partnerPhone}>+91 {order.deliveryPartnerId.phone}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.callButton}
                                onPress={() => Linking.openURL(`tel:${order.deliveryPartnerId?.phone}`)}
                            >
                                <Ionicons name="call" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

                {/* Shipping Address */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                    <View style={styles.addressContainer}>
                        <Text style={styles.addressName}>{order.shippingAddress.name}</Text>
                        <Text style={styles.addressText}>{order.shippingAddress.addressLine1}</Text>
                        <Text style={styles.addressText}>
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </Text>
                        <Text style={styles.addressPhone}>Phone: {order.shippingAddress.phone}</Text>
                    </View>
                </Animated.View>

                {/* Order Items */}
                <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
                    {order.items.map((item, idx) => (
                        <View key={idx} style={styles.itemRow}>
                            <Image
                                source={{ uri: item.productId.images[0] }}
                                style={styles.itemImage}
                            />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemTitle} numberOfLines={2}>
                                    {item.productId.title}
                                </Text>
                                <Text style={styles.itemSubtext}>Qty: {item.quantity}</Text>
                                <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>

                {/* Payment Summary */}
                <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Payment Method</Text>
                        <Text style={styles.paymentValue}>{order.paymentProvider || 'N/A'}</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Payment Status</Text>
                        <Text style={[
                            styles.paymentValue,
                            { color: order.paymentStatus === 'SUCCESS' ? '#10B981' : '#F59E0B' }
                        ]}>
                            {order.paymentStatus}
                        </Text>
                    </View>
                    <View style={[styles.paymentRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{order.totalAmount.toLocaleString()}</Text>
                    </View>
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F3F4F6',
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
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    orderHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderIdLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    orderIdText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    orderDateLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    orderDateText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },

    // Timeline Styles
    timelineContainer: {
        marginVertical: 8,
    },
    timelineStep: {
        flexDirection: 'row',
        minHeight: 60, // Ensure decent height for lines
    },
    stepIndicatorContainer: {
        alignItems: 'center',
        width: 40,
        marginRight: 12,
    },
    stepLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E5E7EB',
    },
    stepIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        backgroundColor: '#E5E7EB',
        borderWidth: 2,
        borderColor: 'white',
    },
    stepIconCompleted: {
        backgroundColor: '#10B981',
    },
    stepIconCurrent: {
        backgroundColor: '#3B82F6',
        transform: [{ scale: 1.1 }],
    },
    stepIconPending: {
        backgroundColor: '#E5E7EB',
    },
    stepContent: {
        flex: 1,
        paddingBottom: 24,
        justifyContent: 'flex-start',
        paddingTop: 4,
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    stepSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    textCompleted: {
        color: '#111827',
    },
    textPending: {
        color: '#9CA3AF',
    },

    // Partner Styles
    partnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    partnerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    partnerInfo: {
        flex: 1,
    },
    partnerName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    partnerPhone: {
        fontSize: 13,
        color: '#6B7280',
    },
    callButton: {
        backgroundColor: '#10B981',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },

    // Address Styles
    addressContainer: {
        // paddingLeft: 8,
    },
    addressName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    addressPhone: {
        marginTop: 6,
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },

    // Item Styles
    itemRow: {
        flexDirection: 'row',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 16,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 4,
        lineHeight: 20,
    },
    itemSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },

    // Payment Styles
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    paymentLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    paymentValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2874F0',
    },

    // Center Content
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#374151',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#2874F0',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});
