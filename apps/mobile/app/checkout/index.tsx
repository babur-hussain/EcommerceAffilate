import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../src/lib/api';

const { width } = Dimensions.get('window');

interface CheckoutProduct {
    _id: string;
    title: string;
    price: number;
    mrp?: number;
    image: string;
    quantity: number;
    rating?: number;
    ratingCount?: number;
    protectPromiseFee?: number;
    shippingCharges?: number;
}

interface UpsellOffer {
    _id?: string;
    title: string;
    description?: string;
    originalPrice: number;
    offerPrice: number;
    discountPercentage?: number;
    tag?: string;
    features?: string[];
    image?: string;
}

export default function CheckoutScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const productId = params.productId as string;
    const selectedOffersParam = params.selectedOffers as string;

    const [product, setProduct] = useState<CheckoutProduct | null>(null);
    const [upsellOffers, setUpsellOffers] = useState<UpsellOffer[]>([]);
    const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [currentStep, setCurrentStep] = useState(2);
    const [isPriceDetailsVisible, setPriceDetailsVisible] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

    useEffect(() => {
        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    useEffect(() => {
        if (selectedOffersParam) {
            try {
                const parsed = JSON.parse(selectedOffersParam);
                console.log('🎯 Pre-selected offers from popup:', parsed);
                setSelectedOffers(parsed);
            } catch (error) {
                console.error('Error parsing selected offers:', error);
            }
        }
    }, [selectedOffersParam]);

    const fetchProductDetails = async () => {
        try {
            const response = await api.get(`/api/products/${productId}`);
            const data = response.data;

            setProduct({
                _id: data._id,
                title: data.title,
                price: data.price,
                mrp: data.mrp || Math.round(data.price * 1.3),
                image: data.primaryImage || data.image,
                quantity: 1,
                rating: data.rating || 4.7,
                ratingCount: data.ratingCount || 12567,
                protectPromiseFee: data.protectPromiseFee || 0,
                shippingCharges: typeof data.shippingCharges === 'number' ? data.shippingCharges : parseFloat(data.shippingCharges) || 0,
            });

            setUpsellOffers(data.lastChanceOffers || []);

            // Calculate delivery date
            const deliveryDays = 3;
            const date = new Date();
            date.setDate(date.getDate() + deliveryDays);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            setDeliveryDate(`${monthNames[date.getMonth()]} ${date.getDate()}, ${dayNames[date.getDay()]}`);
        } catch (error) {
            console.error('Error fetching product:', error);
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const toggleOffer = (offerId: string) => {
        if (selectedOffers.includes(offerId)) {
            setSelectedOffers(prev => prev.filter(id => id !== offerId));
        } else {
            setSelectedOffers(prev => [...prev, offerId]);
        }
    };

    const calculateTotal = () => {
        if (!product) return 0;

        let total = product.price;

        // Add protect promise fee if applicable
        if (product.protectPromiseFee) {
            total += product.protectPromiseFee;
        }

        // Add selected offers
        upsellOffers.forEach((offer, index) => {
            const id = offer._id || `temp-${index}`;
            if (selectedOffers.includes(id)) {
                total += offer.offerPrice;
            }
        });

        // Add shipping charges if applicable
        if (product.shippingCharges && product.shippingCharges > 0) {
            total += product.shippingCharges;
        }

        return total;
    };

    const calculateDiscount = () => {
        if (!product || !product.mrp) return 0;
        return product.mrp - product.price;
    };

    const calculateDiscountPercent = () => {
        if (!product || !product.mrp) return 0;
        return Math.round(((product.mrp - product.price) / product.mrp) * 100);
    };

    const handleContinue = () => {
        Alert.alert('Checkout', `Proceeding to payment with total: ₹${calculateTotal().toLocaleString()}`);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Product not found</Text>
            </View>
        );
    }

    const total = calculateTotal();
    const discount = calculateDiscount();
    const discountPercent = calculateDiscountPercent();

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="dark" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Order Summary</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Progress Stepper */}
                <View style={styles.stepperContainer}>
                    <View style={styles.stepperRow}>
                        {/* Step 1 - Address */}
                        <View style={styles.stepItem}>
                            <View style={[styles.stepCircle, styles.stepCompleted]}>
                                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                            </View>
                            <Text style={styles.stepLabel}>Address</Text>
                        </View>

                        <View style={[styles.stepLine, styles.stepLineCompleted]} />

                        {/* Step 2 - Order Summary */}
                        <View style={styles.stepItem}>
                            <View style={[styles.stepCircle, styles.stepActive]}>
                                <Text style={styles.stepNumber}>2</Text>
                            </View>
                            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Order Summary</Text>
                        </View>

                        <View style={styles.stepLine} />

                        {/* Step 3 - Payment */}
                        <View style={styles.stepItem}>
                            <View style={styles.stepCircle}>
                                <Text style={styles.stepNumberInactive}>3</Text>
                            </View>
                            <Text style={styles.stepLabel}>Payment</Text>
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Deliver To Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Deliver to:</Text>
                            <TouchableOpacity>
                                <Text style={styles.changeButton}>Change</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.addressCard}>
                            <View style={styles.addressHeader}>
                                <Text style={styles.addressName}>Babur</Text>
                                <View style={styles.homeTag}>
                                    <Text style={styles.homeTagText}>HOME</Text>
                                </View>
                            </View>
                            <Text style={styles.addressText}>
                                Agnihotri Colony, Chandrashekhar Ward, Sadar, Betul,{'\n'}
                                Genius Class, Betul 460001
                            </Text>
                            <Text style={styles.phoneText}>6264134364</Text>
                        </View>
                    </View>

                    {/* Product Card */}
                    <View style={styles.productCard}>
                        <View style={styles.productRow}>
                            <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />

                            <View style={styles.productInfo}>
                                <Text style={styles.productTitle} numberOfLines={2}>
                                    {product.title}
                                </Text>

                                <View style={styles.ratingRow}>
                                    <View style={styles.ratingBadge}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Ionicons
                                                key={star}
                                                name="star"
                                                size={12}
                                                color={star <= Math.floor(product.rating || 0) ? "#16A34A" : "#D1D5DB"}
                                            />
                                        ))}
                                    </View>
                                    <Text style={styles.ratingText}>
                                        {product.rating} · ({product.ratingCount?.toLocaleString()})
                                    </Text>
                                    <View style={styles.assuredBadge}>
                                        <Ionicons name="shield-checkmark" size={14} color="#2563EB" />
                                        <Text style={styles.assuredText}>Assured</Text>
                                    </View>
                                </View>

                                <View style={styles.priceRow}>
                                    <View style={styles.discountBadge}>
                                        <Ionicons name="arrow-down" size={12} color="#16A34A" />
                                        <Text style={styles.discountText}>{discountPercent}%</Text>
                                    </View>
                                    <Text style={styles.mrpText}>₹{product.mrp?.toLocaleString()}</Text>
                                    <Text style={styles.priceText}>₹{product.price.toLocaleString()}</Text>
                                </View>

                                <View style={styles.qtyRow}>
                                    <Text style={styles.qtyLabel}>Qty: {product.quantity}</Text>
                                    {(product.protectPromiseFee || 0) > 0 && (
                                        <View style={styles.protectRow}>
                                            <Text style={styles.protectText}>+ ₹{product.protectPromiseFee} Protect Promise Fee</Text>
                                            <Ionicons name="information-circle-outline" size={14} color="#6B7280" />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.emiRow}>
                                    <Text style={styles.emiText}>Or Pay ₹6,398</Text>
                                    <View style={styles.coinBadge}>
                                        <Ionicons name="cash" size={12} color="#F59E0B" />
                                        <Text style={styles.coinText}>25592</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Protection Plans */}
                    {upsellOffers.length > 0 && upsellOffers.map((offer, index) => {
                        const id = offer._id || `temp-${index}`;
                        const isSelected = selectedOffers.includes(id);

                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.protectionCard}
                                onPress={() => toggleOffer(id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.protectionHeader}>
                                    <View style={styles.protectionLeft}>
                                        <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
                                        <Text style={styles.protectionTitle}>{offer.title}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => toggleOffer(id)}>
                                        <Ionicons name="close" size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.protectionPriceRow}>
                                    <Text style={styles.protectionOriginalPrice}>₹{offer.originalPrice}</Text>
                                    <Text style={styles.protectionPrice}>₹{offer.offerPrice}</Text>
                                    {offer.discountPercentage && (
                                        <Text style={styles.protectionDiscount}>{offer.discountPercentage}% off</Text>
                                    )}
                                    {offer.tag && (
                                        <Text style={styles.protectionTag}>· {offer.tag}</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {/* Delivery Info */}
                    <View style={styles.deliveryInfo}>
                        <Text style={styles.deliveryText}>Delivery by {deliveryDate}</Text>
                    </View>

                    {/* Rest Assured Section */}
                    <View style={styles.restAssuredSection}>
                        <View style={styles.restAssuredHeader}>
                            <Ionicons name="cube" size={24} color="#F59E0B" />
                            <Text style={styles.restAssuredTitle}>Rest assured with Open Box Delivery</Text>
                        </View>

                        <Image source={{ uri: product.image }} style={styles.restAssuredImage} resizeMode="contain" />

                        <Text style={styles.restAssuredDesc}>
                            Delivery agent will open the package so you can check for correct product, damage or missing items. Share OTP to accept the delivery.{' '}
                            <Text style={styles.whyLink}>Why?</Text>
                        </Text>
                    </View>

                    {/* Donation Section */}
                    <View style={styles.donationSection}>
                        <View style={styles.donationHeader}>
                            <View style={styles.donationTextContainer}>
                                <Text style={styles.donationTitle}>Donate to Support Education</Text>
                                <Text style={styles.donationSubtitle}>Support transformative social work in India</Text>
                            </View>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/120x80' }}
                                style={styles.donationImage}
                                resizeMode="cover"
                            />
                        </View>

                        <View style={styles.donationAmounts}>
                            {[10, 20, 50, 100].map((amount) => (
                                <TouchableOpacity
                                    key={amount}
                                    style={[
                                        styles.donationButton,
                                        selectedDonation === amount && styles.donationButtonSelected
                                    ]}
                                    onPress={() => setSelectedDonation(selectedDonation === amount ? null : amount)}
                                >
                                    <Text style={[
                                        styles.donationButtonText,
                                        selectedDonation === amount && styles.donationButtonTextSelected
                                    ]}>
                                        ₹{amount}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.donationNote}>Note: 100% of the donation goes to the cause</Text>
                    </View>

                    {/* Price Breakdown */}
                    <View style={styles.priceBreakdown}>
                        <View style={styles.priceRowCompact}>
                            <Text style={styles.priceLabelCompact}>MRP(incl. of all taxes)</Text>
                            <Text style={styles.priceValueCompact}>₹{(product.mrp || 0).toLocaleString()}</Text>
                        </View>

                        <View style={styles.dottedSeparator} />

                        <TouchableOpacity style={styles.priceRowCompact}>
                            <View style={styles.priceRowLeft}>
                                <Text style={styles.priceLabelCompact}>Fees</Text>
                                <Ionicons name="chevron-down" size={14} color="#6B7280" />
                            </View>
                            <Text style={styles.priceValueCompact}>₹{product.protectPromiseFee || 0}</Text>
                        </TouchableOpacity>

                        <View style={styles.dottedSeparator} />

                        <TouchableOpacity style={styles.priceRowCompact}>
                            <View style={styles.priceRowLeft}>
                                <Text style={styles.priceLabelCompact}>Discounts</Text>
                                <Ionicons name="chevron-down" size={14} color="#6B7280" />
                            </View>
                            <Text style={styles.priceValueGreenCompact}>-₹{discount.toLocaleString()}</Text>
                        </TouchableOpacity>

                        <View style={styles.dottedSeparator} />

                        <View style={styles.priceRowCompact}>
                            <Text style={styles.totalLabelCompact}>Total Amount</Text>
                            <Text style={styles.totalValueCompact}>₹{total.toLocaleString()}</Text>
                        </View>

                        <View style={styles.savingsBoxCompact}>
                            <Text style={styles.savingsTextCompact}>
                                You will save ₹{discount.toLocaleString()} on this order
                            </Text>
                        </View>
                    </View>

                    {/* Terms */}
                    <View style={styles.termsSection}>
                        <Text style={styles.termsText}>
                            By continuing with the order, you confirm that you are above 18 years of age, and you agree to the our{' '}
                            <Text style={styles.termsLink}>Terms of Use</Text> and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom Bar */}
                <View style={styles.bottomBar}>
                    <View style={styles.totalSection}>
                        <Text style={styles.totalStrike}>₹{(product.mrp || 0).toLocaleString()}</Text>
                        <Text style={styles.totalAmount}>₹{total.toLocaleString()}</Text>
                        <TouchableOpacity onPress={() => setPriceDetailsVisible(true)}>
                            <Text style={styles.viewDetails}>View price details</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Price Details Modal */}
            <Modal
                visible={isPriceDetailsVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPriceDetailsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Price Details</Text>
                            <TouchableOpacity onPress={() => setPriceDetailsVisible(false)}>
                                <Ionicons name="close" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>

                        {product && (
                            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Price ({product?.quantity || 1} item)</Text>
                                    <Text style={styles.modalValue}>₹{product?.price.toLocaleString()}</Text>
                                </View>

                                {product?.protectPromiseFee && product.protectPromiseFee > 0 && (
                                    <View style={styles.modalRow}>
                                        <Text style={styles.modalLabel}>Protect Promise Fee</Text>
                                        <Text style={styles.modalValue}>₹{product.protectPromiseFee}</Text>
                                    </View>
                                )}

                                {selectedOffers.length > 0 && (
                                    <View>
                                        <View style={styles.modalDivider} />
                                        <Text style={styles.modalSectionTitle}>Add-ons</Text>
                                        {upsellOffers.map((offer, index) => {
                                            const id = offer._id || `temp-${index}`;
                                            if (!selectedOffers.includes(id)) return null;
                                            return (
                                                <View key={index} style={styles.modalRow}>
                                                    <Text style={styles.modalLabel}>{offer.title}</Text>
                                                    <Text style={styles.modalValue}>₹{offer.offerPrice.toLocaleString()}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}

                                {selectedDonation && selectedDonation > 0 && (
                                    <View>
                                        <View style={styles.modalDivider} />
                                        <View style={styles.modalRow}>
                                            <Text style={styles.modalLabel}>Donation</Text>
                                            <Text style={styles.modalValue}>₹{selectedDonation}</Text>
                                        </View>
                                    </View>
                                )}

                                <View style={styles.modalDivider} />

                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Delivery Charges</Text>
                                    {product.shippingCharges && product.shippingCharges > 0 ? (
                                        <Text style={styles.modalValue}>₹{product.shippingCharges.toLocaleString()}</Text>
                                    ) : (
                                        <Text style={styles.modalValueGreen}>FREE</Text>
                                    )}
                                </View>

                                <View style={styles.modalDivider} />

                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Discount</Text>
                                    <Text style={styles.modalValueGreen}>-₹{discount.toLocaleString()}</Text>
                                </View>

                                <View style={styles.modalDivider} />

                                <View style={[styles.modalRow, styles.modalTotalRow]}>
                                    <Text style={styles.modalTotalLabel}>Total Amount</Text>
                                    <Text style={styles.modalTotalValue}>₹{(total + (selectedDonation || 0)).toLocaleString()}</Text>
                                </View>

                                <View style={styles.modalSavingsBox}>
                                    <Text style={styles.modalSavingsText}>
                                        You will save ₹{discount.toLocaleString()} on this order
                                    </Text>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    stepperContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepItem: {
        alignItems: 'center',
        gap: 8,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCompleted: {
        backgroundColor: '#2563EB',
    },
    stepActive: {
        backgroundColor: '#2563EB',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    stepNumberInactive: {
        fontSize: 14,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    stepLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    stepLabelActive: {
        color: '#1F2937',
        fontWeight: '600',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 8,
    },
    stepLineCompleted: {
        backgroundColor: '#2563EB',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    changeButton: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
    },
    addressCard: {
        gap: 6,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    homeTag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    homeTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
    },
    addressText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    phoneText: {
        fontSize: 14,
        color: '#4B5563',
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    productRow: {
        flexDirection: 'row',
        gap: 12,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
    },
    productInfo: {
        flex: 1,
        gap: 6,
    },
    productTitle: {
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ratingBadge: {
        flexDirection: 'row',
        gap: 2,
    },
    ratingText: {
        fontSize: 12,
        color: '#6B7280',
    },
    assuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    assuredText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2563EB',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    discountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#16A34A',
    },
    mrpText: {
        fontSize: 13,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    priceText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    qtyLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    protectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    protectText: {
        fontSize: 11,
        color: '#6B7280',
    },
    emiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    emiText: {
        fontSize: 12,
        color: '#6B7280',
    },
    coinBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    coinText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#F59E0B',
    },
    protectionCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    protectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    protectionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    protectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    protectionPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    protectionOriginalPrice: {
        fontSize: 13,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    protectionPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: '#16A34A',
    },
    protectionDiscount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#16A34A',
    },
    protectionTag: {
        fontSize: 12,
        color: '#6B7280',
    },
    deliveryInfo: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    deliveryText: {
        fontSize: 13,
        color: '#6B7280',
    },
    restAssuredSection: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    restAssuredHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    restAssuredTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    restAssuredImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    restAssuredDesc: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 20,
    },
    whyLink: {
        color: '#2563EB',
        fontWeight: '600',
    },
    donationSection: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    donationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    donationTextContainer: {
        flex: 1,
        marginRight: 12,
    },
    donationTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    donationSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    donationImage: {
        width: 120,
        height: 80,
        borderRadius: 8,
    },
    donationAmounts: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    donationButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    donationButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    donationNote: {
        fontSize: 11,
        color: '#6B7280',
    },
    priceBreakdown: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    priceRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    priceLabel: {
        fontSize: 14,
        color: '#1F2937',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    priceValueGreen: {
        fontSize: 14,
        fontWeight: '600',
        color: '#16A34A',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1F2937',
    },
    savingsBox: {
        backgroundColor: '#D1FAE5',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    savingsText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#065F46',
        textAlign: 'center',
    },
    // Compact Price Breakdown Styles
    priceRowCompact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    priceLabelCompact: {
        fontSize: 14,
        color: '#1F2937',
    },
    priceValueCompact: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    priceValueGreenCompact: {
        fontSize: 14,
        fontWeight: '600',
        color: '#16A34A',
    },
    dottedSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderStyle: 'dotted',
        marginVertical: 4,
    },
    totalLabelCompact: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    totalValueCompact: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    savingsBoxCompact: {
        backgroundColor: '#D1FAE5',
        padding: 10,
        borderRadius: 6,
        marginTop: 12,
    },
    savingsTextCompact: {
        fontSize: 12,
        fontWeight: '600',
        color: '#065F46',
        textAlign: 'center',
    },
    termsSection: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    termsText: {
        fontSize: 11,
        color: '#6B7280',
        lineHeight: 16,
    },
    termsLink: {
        color: '#2563EB',
        fontWeight: '600',
    },
    bottomBar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        padding: 16,
        paddingBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    totalSection: {
        flex: 1,
    },
    totalStrike: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
    },
    viewDetails: {
        fontSize: 12,
        color: '#2563EB',
        fontWeight: '600',
    },
    continueButton: {
        backgroundColor: '#FCD34D',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    donationButtonSelected: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    donationButtonTextSelected: {
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    modalContent: {
        padding: 20,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    modalLabel: {
        fontSize: 14,
        color: '#4B5563',
    },
    modalValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    modalValueGreen: {
        fontSize: 14,
        fontWeight: '600',
        color: '#16A34A',
    },
    modalDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 8,
    },
    modalSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 8,
        marginBottom: 4,
    },
    modalTotalRow: {
        borderTopWidth: 2,
        borderTopColor: '#1F2937',
        paddingTop: 16,
        marginTop: 8,
    },
    modalTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    modalTotalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
    },
    modalSavingsBox: {
        backgroundColor: '#D1FAE5',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    modalSavingsText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#065F46',
        textAlign: 'center',
    },
});
