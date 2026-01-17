import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useBasket } from '../../context/BasketContext';
import { StealDealSection } from './StealDealSection';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface BasketScreenProps {
    onShopNow?: () => void;
    onBack?: () => void;
}

export default function BasketScreen({ onBack }: BasketScreenProps) {
    const { basket, removeFromBasket, updateQuantity, basketTotal, clearBasket } = useBasket();
    const router = useRouter();

    // Group items by category if needed, or just list them.
    const items = basket?.items || [];
    const isEmpty = items.length === 0;

    if (isEmpty) {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack}>
                        <MaterialIcons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Grocery basket</Text>
                    <Feather name="search" size={24} color="#111827" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Empty State Content */}
                    <View style={styles.emptyContent}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png' }}
                            style={styles.emptyImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.emptyTitle}>Your basket is empty!</Text>

                        <TouchableOpacity style={styles.shopNowButton} onPress={onBack}>
                            <Text style={styles.shopNowText}>Shop now</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Recommendations */}
                    <View style={styles.recommendations}>
                        {/* Reuse Steal Deal Section */}
                        <StealDealSection />

                        {/* Try it, Buy it Section (Mockup for now as requested by "like this") */}
                        <View style={styles.tryItSection}>
                            <Text style={styles.sectionTitle}>Try it, Buy it!</Text>
                            <Text style={styles.sectionSubtitle}>Samples for you</Text>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                                {[1, 2].map((i) => (
                                    <View key={i} style={styles.sampleCard}>
                                        <Image
                                            source={{ uri: i === 1 ? 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768339123/products/nn8po2g34ud2irlriuxl.png' : 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768339216/products/kxl5ejlw3jyuxicbdimo.png' }}
                                            style={styles.sampleImage}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.sampleInfo}>
                                            <Text style={styles.sampleName}>Kwality Vanilla Ice Cream Mix 100 g</Text>
                                            <View style={styles.priceRow}>
                                                <Text style={styles.samplePrice}>₹60</Text>
                                                <Text style={styles.sampleOrgPrice}>60</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Basket ({items.reduce((acc, item) => acc + item.quantity, 0)} Items)</Text>
                <TouchableOpacity onPress={clearBasket}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

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
                    {items.map((item, index) => {
                        const product = item.productId as any;
                        const price = product.price || 0;
                        const originalPrice = product.mrp || (price * 1.2);

                        return (
                            <View key={product._id || `item-${index}`} style={styles.itemCard}>
                                {/* Image */}
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: product.image || product.primaryImage }} style={styles.productImage} resizeMode="contain" />
                                </View>

                                {/* Info */}
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemTitle} numberOfLines={2}>{product.title}</Text>
                                    <Text style={styles.itemWeight}>{product.netWeight || '1 pc'}</Text>

                                    <View style={styles.priceRow}>
                                        <Text style={styles.currentPrice}>₹{price}</Text>
                                        <Text style={styles.originalPrice}>₹{Math.round(originalPrice)}</Text>
                                    </View>
                                </View>

                                {/* Quantity Control */}
                                <View style={styles.quantityControl}>
                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() => updateQuantity(product._id || product, item.quantity - 1)}
                                    >
                                        <Text style={styles.qtyBtnText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() => updateQuantity(product._id || product, item.quantity + 1)}
                                    >
                                        <Text style={styles.qtyBtnText}>+</Text>
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
                    <Text style={styles.savingsText}>You saved ₹{Math.round(basketTotal * 0.2)} on this order!</Text>
                </View>

            </ScrollView>

            {/* Bottom Floating Action Button for Checkout */}
            <View style={styles.checkoutBar}>
                <View>
                    <Text style={styles.checkoutTotalLabel}>Total</Text>
                    <Text style={styles.checkoutTotalValue}>₹{basketTotal + 2}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutButtonText}>Proceed to Pay</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    emptyContent: {
        alignItems: 'center',
        paddingTop: 0, // Removed padding completely
        paddingBottom: 30,
        backgroundColor: '#FFFFFF',
    },
    emptyImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
        marginTop: 10,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 24,
    },
    shopNowButton: {
        backgroundColor: '#2563EB', // Blue
        paddingVertical: 12,
        paddingHorizontal: 48,
        borderRadius: 4,
    },
    shopNowText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    recommendations: {
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
    },
    tryItSection: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: -12, // Pull up closer to title
        marginBottom: 12,
    },
    sampleCard: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        marginRight: 12,
        padding: 12,
    },
    sampleImage: {
        width: '100%',
        height: 100,
        marginBottom: 8,
    },
    sampleInfo: {},
    sampleName: {
        fontSize: 12,
        color: '#374151',
        marginBottom: 4,
        height: 32,
    },
    samplePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginRight: 8,
    },
    sampleOrgPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#111827',
        flex: 1,
        marginLeft: 16,
    },
    clearText: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '600',
    },
    scrollContent: {
        paddingBottom: 120, // Space for bottom bar + checkout bar
    },
    deliveryBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7', // Green-100
        margin: 16,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#86EFAC',
    },
    deliveryTextContainer: {
        marginLeft: 12,
    },
    deliveryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#14532D',
    },
    deliverySubtitle: {
        fontSize: 12,
        color: '#166534',
    },
    itemsList: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    itemCard: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    imageContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    productImage: {
        width: '80%',
        height: '80%',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 4,
    },
    itemWeight: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    currentPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    quantityControl: {
        backgroundColor: '#15803d', // Green
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        height: 32,
        alignSelf: 'center',
    },
    qtyBtn: {
        width: 28,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    qtyText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
    billSection: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
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
        borderStyle: 'dashed', // Dashed border doesn't work well with height 1, but View doesn't support borderStyle easily without workarounds. Default solid.
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
        backgroundColor: '#ECFEFF', // Cyan-50
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CFFAFE',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    savingsText: {
        color: '#155E75',
        fontSize: 13,
        fontWeight: '600',
    },
    checkoutBar: {
        position: 'absolute',
        bottom: 100, // Above bottom nav
        left: 16,
        right: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    checkoutTotalLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    checkoutTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    checkoutButton: {
        backgroundColor: '#15803d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
