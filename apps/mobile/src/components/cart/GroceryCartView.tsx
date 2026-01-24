import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ProductType } from './CartItem';

interface GroceryCartViewProps {
    items: any[];
    updateQuantity: (id: string, qty: number) => void;
    basketTotal: number;
}

const GroceryCartView = ({ items, updateQuantity, basketTotal }: GroceryCartViewProps) => {
    return (
        <View style={styles.listContent}>
            {/* Delivery Banner */}
            <View style={styles.deliveryBanner}>
                <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#15803d" />
                <View style={styles.deliveryTextContainer}>
                    <Text style={styles.deliveryTitle}>Delivery in 15 mins</Text>
                    <Text style={styles.deliverySubtitle}>Shipment of {items.length} items</Text>
                </View>
            </View>

            {/* Items List */}
            <View style={styles.itemsList}>
                {items.map((item: any, index: number) => {
                    const product = item.productId as ProductType; // Better safety with defined type
                    if (!product) return null;

                    const price = product.price || 0;
                    const originalPrice = product.mrp || (price * 1.2); // Fallback logic kept minimal
                    const pid = product._id;

                    return (
                        <View key={pid || `item-${index}`} style={styles.groceryItemCard}>
                            {/* Image */}
                            <View style={styles.groceryImageContainer}>
                                <Image source={{ uri: product.image || (product.images && product.images[0]) }} style={styles.productImage} resizeMode="contain" />
                            </View>

                            {/* Info */}
                            <View style={styles.groceryItemInfo}>
                                <Text style={styles.groceryItemTitle} numberOfLines={2}>{product.name || product.title}</Text>
                                {/* Note: NetWeight needs to be in ProductType if real, else static for now */}
                                <Text style={styles.groceryItemWeight}>1 pc</Text>

                                <View style={styles.groceryPriceRow}>
                                    <Text style={styles.groceryCurrentPrice}>₹{price}</Text>
                                    <Text style={styles.groceryOriginalPrice}>₹{Math.round(originalPrice)}</Text>
                                </View>
                            </View>

                            {/* Quantity Control */}
                            <View style={styles.groceryQuantityControl}>
                                <TouchableOpacity
                                    style={styles.groceryQtyBtn}
                                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQuantity(pid, item.quantity - 1); }}
                                >
                                    <Text style={styles.groceryQtyBtnText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.groceryQtyText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    style={styles.groceryQtyBtn}
                                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQuantity(pid, item.quantity + 1); }}
                                >
                                    <Text style={styles.groceryQtyBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Bill Details */}
            <View style={styles.billSection}>
                <Text style={styles.sectionTitle}>Bill Details</Text>

                <View style={styles.billRow}>
                    <View style={styles.billRowLeft}>
                        <MaterialIcons name="receipt-long" size={16} color="#6B7280" />
                        <Text style={styles.billLabel}>Item Total</Text>
                    </View>
                    <Text style={styles.billValue}>₹{basketTotal}</Text>
                </View>

                <View style={styles.billRow}>
                    <View style={styles.billRowLeft}>
                        <MaterialIcons name="delivery-dining" size={16} color="#6B7280" />
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                    </View>
                    <Text style={[styles.billValue, { color: '#15803d' }]}>Free</Text>
                </View>

                <View style={styles.billRow}>
                    <View style={styles.billRowLeft}>
                        <MaterialIcons name="shopping-bag" size={16} color="#6B7280" />
                        <Text style={styles.billLabel}>Handling Charge</Text>
                    </View>
                    <Text style={styles.billValue}>₹2</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>To Pay</Text>
                    <Text style={styles.totalValue}>₹{basketTotal + 2}</Text>
                </View>
            </View>

            {/* Savings Banner */}
            <View style={styles.savingsBanner}>
                <MaterialIcons name="local-offer" size={18} color="#155E75" />
                <Text style={styles.savingsText}>You saved on this order!</Text>
            </View>

            {/* Safe Area padding for footer */}
            <View style={{ height: 100 }} />
        </View>
    );
};

export default GroceryCartView;

const styles = StyleSheet.create({
    listContent: {
        flex: 1
    },
    deliveryBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        padding: 12,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
    },
    deliveryTextContainer: {
        marginLeft: 12,
    },
    deliveryTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#14532D',
    },
    deliverySubtitle: {
        fontSize: 12,
        color: '#166534',
    },
    itemsList: {
        padding: 16,
    },
    groceryItemCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    groceryImageContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    productImage: {
        width: '80%',
        height: '80%',
    },
    groceryItemInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    groceryItemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    groceryItemWeight: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    groceryPriceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    groceryCurrentPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        marginRight: 6,
    },
    groceryOriginalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    groceryQuantityControl: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0FDFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CCFBF1',
        paddingVertical: 4,
        width: 32,
        marginLeft: 8,
    },
    groceryQtyBtn: {
        padding: 4,
    },
    groceryQtyBtnText: {
        fontSize: 16,
        color: '#0F766E',
        fontWeight: 'bold',
    },
    groceryQtyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F766E',
        marginVertical: 2,
    },
    billSection: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#111827',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    billRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    billLabel: {
        fontSize: 14,
        color: '#4B5563',
    },
    billValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    savingsBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFEFF',
        padding: 12,
        justifyContent: 'center',
        gap: 8,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#06B6D4',
        marginHorizontal: 16,
        borderRadius: 8,
    },
    savingsText: {
        color: '#155E75',
        fontSize: 12,
        fontWeight: '600',
    },
});
