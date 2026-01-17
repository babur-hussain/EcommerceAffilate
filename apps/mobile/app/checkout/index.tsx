import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../src/lib/api';
import PaymentSection from '../../src/components/checkout/PaymentSection';
import RazorpayCheckout from 'react-native-razorpay';
// import RazorpayCheckout from '../../src/mocks/RazorpayCheckout';
// @ts-ignore
// import AllInOneSDKManager from 'paytm-allinone-react-native';
import AllInOneSDKManager from '../../src/mocks/PaytmAllInOneSDKManager';
import { useAuth } from '../../src/context/AuthContext';
import { useCart } from '../../src/context/CartContext';

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
    offers?: any[];
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

interface Address {
    _id: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
    type?: string;
}

export default function CheckoutScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const productId = params.productId as string;
    const selectedOffersParam = params.selectedOffers as string;
    const source = params.source as string;
    const isCartCheckout = source === 'cart';

    const { user } = useAuth();
    const { cart, cartTotal } = useCart();

    const [product, setProduct] = useState<CheckoutProduct | null>(null);
    const [upsellOffers, setUpsellOffers] = useState<UpsellOffer[]>([]);
    const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [currentStep, setCurrentStep] = useState(2);
    const [isPriceDetailsVisible, setPriceDetailsVisible] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<number | null>(null);
    const [addressId, setAddressId] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isAddressModalVisible, setAddressModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            fetchAddresses();
        }, [])
    );

    const fetchAddresses = async () => {
        try {
            const res = await api.get('/api/addresses'); // Verified endpoint
            if (res.data && Array.isArray(res.data)) {
                setAddresses(res.data);

                // Select default or first
                const defaultAddr = res.data.find((a: Address) => a.isDefault) || res.data[0];
                if (defaultAddr) {
                    setAddressId(defaultAddr._id);
                    setSelectedAddress(defaultAddr);
                }
            }
        } catch (e) {
            console.log("Error fetching addresses", e);
            // Alert.alert("Error", "Failed to load addresses");
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductDetails();
        } else if (isCartCheckout) {
            setLoading(false);
            // Cart data is already in context
        }
    }, [productId, isCartCheckout]);

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
                offers: data.offers || [],
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
        if (currentStep === 2) {
            setCurrentStep(3);
        } else {
            // Recalculate total dynamically in case of state changes
            const finalTotal = isCartCheckout ? cartTotal : calculateTotal();
            Alert.alert('Checkout', `Proceeding to payment with total: ₹${finalTotal.toLocaleString()}`);
        }
    };

    const handleBack = () => {
        if (currentStep === 3) {
            setCurrentStep(2);
        } else {
            router.back();
        }
    };

    const handlePaymentSelect = async (method: string) => {
        if (!product) return;

        // We need an addressId. For this implementation, we'll try to find one or alert.
        // If addressId is null, we can't create order.
        // For development/demo, if we can't fetch one, we might fail.
        // Let's assume we have a valid addressId or we fetch it ad-hoc.
        let validAddressId = addressId;
        if (!validAddressId) {
            try {
                // Quick hack: fetch addresses if not loaded
                // Actually, let's just create a dummy address ID if we are in dev/test environment OR ask user to add address
                // Since I cannot implement full address management now, I will warn the user.
                Alert.alert("Address Required", "Please select a delivery address in Step 1.");
                return;
            } catch { }
        }

        setLoading(true);
        try {
            // 1. Create Order
            let items: any[] = [];

            if (isCartCheckout && cart && cart.items) {
                items = cart.items.map((item: any) => ({
                    productId: typeof item.productId === 'string' ? item.productId : item.productId._id,
                    quantity: item.quantity
                }));
            } else if (product) {
                items = [{ productId: product._id, quantity: product.quantity }];
                // Add upsells for single product checkout
                upsellOffers.forEach((offer, idx) => {
                    const id = offer._id || `temp-${idx}`;
                    if (selectedOffers.includes(id) && offer._id) {
                        // items.push({ productId: offer._id, quantity: 1 });
                    }
                });
            }

            if (items.length === 0) {
                Alert.alert("Error", "No items to checkout.");
                setLoading(false);
                return;
            }

            const orderPayload = {
                items,
                addressId: validAddressId,
                selectedOfferIds: selectedOffers.filter(id => !id.toString().startsWith('temp-')), // Filter out temp IDs if any
                paymentMethod: method // Pass the selected payment method (e.g., 'COD', 'PAYTM', 'RAZORPAY')
                // couponCode: ... // if we had coupons
            };

            // Create order to get ID
            const orderRes = await api.post('/api/orders', orderPayload);
            const order = orderRes.data;
            const orderId = order._id;

            if (method === 'COD') {
                // Direct success
                router.push('/checkout/success');
            } else if (method === 'PAYTM') {
                try {
                    const payRes = await api.post(`/api/orders/${orderId}/pay`, { provider: 'PAYTM' });
                    const { mid, orderId: paytmOrderId, txnToken, amount, callbackUrl, isStaging, restrictAppInvoke } = payRes.data;

                    // Start Paytm Transaction
                    AllInOneSDKManager.startTransaction(
                        paytmOrderId,
                        mid,
                        txnToken,
                        amount,
                        callbackUrl,
                        isStaging,
                        restrictAppInvoke,
                        `paytm${mid}` // urlScheme
                    ).then(async (result: any) => {
                        console.log("Paytm Result:", result);
                        /*
                           Response format:
                           {
                               "BANKNAME": "WALLET",
                               "BANKTXNID": "123456",
                               "CHECKSUMHASH": "...",
                               "CURRENCY": "INR",
                               "GATEWAYNAME": "WALLET",
                               "MID": "...",
                               "ORDERID": "...",
                               "PAYMENTMODE": "PPI",
                               "RESPCODE": "01",
                               "RESPMSG": "Txn Success",
                               "STATUS": "TXN_SUCCESS",
                               "TXNAMOUNT": "100.00",
                               "TXNDATE": "2023-01-01 12:00:00",
                               "TXNID": "..."
                           }
                        */
                        if (result.STATUS === 'TXN_SUCCESS') {
                            // Verify with backend
                            await api.post(`/api/orders/${orderId}/verify`, result);
                            Alert.alert("Payment Successful", "Your order has been placed successfully!", [
                                { text: "OK", onPress: () => router.push('/') }
                            ]);
                        } else {
                            Alert.alert("Payment Failed", result.RESPMSG || "Transaction failed");
                        }
                    }).catch((err: any) => {
                        console.error("Paytm SDK Error:", err);
                        Alert.alert("Payment Failed", "Transaction cancelled or failed.");
                    });
                } catch (e) {
                    console.error("Paytm Init Error:", e);
                    Alert.alert("Error", "Failed to initiate Paytm payment");
                }
            } else {
                // Online Payment (Razorpay) - Backup
                const payRes = await api.post(`/api/orders/${orderId}/pay`, { provider: 'RAZORPAY' });
                const { paymentOrderId, key_id, amount, name, description, prefill } = payRes.data;

                const options = {
                    description: description || 'Payment for Order',
                    image: 'https://i.imgur.com/3g7nmJC.png', // Placeholder
                    currency: 'INR',
                    key: key_id,
                    amount: amount,
                    name: name || 'Ecommerce App',
                    order_id: paymentOrderId,
                    prefill: {
                        email: user?.email || 'user@example.com',
                        contact: (selectedAddress?.phone || user?.phone || '').replace(/\s/g, ''),
                        name: selectedAddress?.name || user?.name || ''
                    },
                    readonly: {
                        contact: true,
                        email: true
                    },
                    theme: { color: '#6366f1', hide_topbar: true }
                };

                RazorpayCheckout.open(options).then(async (data: any) => {
                    // Success
                    // Verify payment
                    await api.post(`/api/orders/${orderId}/verify`, {
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_signature: data.razorpay_signature
                    });

                    // Navigate to success screen
                    router.push('/checkout/success');
                }).catch((error: any) => {
                    // Failure
                    console.log("Razorpay Error", error);
                    Alert.alert("Payment Failed", "Transaction was cancelled or failed. Please try again.");
                });
            }

        } catch (error: any) {
            console.error("Payment Flow Error", error);
            Alert.alert("Error", error.response?.data?.error || "Failed to process order/payment");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!product && !isCartCheckout) {
        return (
            <View style={styles.center}>
                <Text>Product not found</Text>
            </View>
        );
    }

    // --- Derived Values for Render ---
    // We can iterate cart items to find total MRP if we want to show savings.
    const cartMrp = isCartCheckout && cart?.items
        ? cart.items.reduce((sum: number, item: any) => {
            const p = item.productId || {};
            const m = p.mrp || (p.price * 1.3);
            return sum + (m * item.quantity);
        }, 0)
        : 0;

    const total = isCartCheckout ? cartTotal : calculateTotal();
    const discount = isCartCheckout ? (cartMrp - cartTotal) : calculateDiscount();
    const mrp = isCartCheckout ? cartMrp : (product?.mrp || 0);
    const discountPercent = isCartCheckout
        ? (cartMrp > 0 ? Math.round(((cartMrp - total) / cartMrp) * 100) : 0)
        : calculateDiscountPercent();

    // Render Payment Section for Step 3
    if (currentStep === 3) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <StatusBar style="dark" />
                <Stack.Screen options={{ headerShown: false }} />
                <PaymentSection
                    totalAmount={total}
                    discount={discount}
                    offers={product?.offers || []}
                    onPaymentSelect={handlePaymentSelect}
                    onBack={handleBack}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="dark" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
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
                            <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
                                <Text style={styles.changeButton}>{selectedAddress ? 'Change' : 'Add Address'}</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedAddress ? (
                            <View style={styles.addressCard}>
                                <View style={styles.addressHeader}>
                                    <Text style={styles.addressName}>{selectedAddress.name}</Text>
                                    <View style={styles.homeTag}>
                                        <Text style={styles.homeTagText}>{selectedAddress.type || 'HOME'}</Text>
                                    </View>
                                </View>
                                <Text style={styles.addressText}>
                                    {selectedAddress.addressLine1}, {selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}
                                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                                </Text>
                                <Text style={styles.phoneText}>{selectedAddress.phone}</Text>
                            </View>
                        ) : (
                            <View style={styles.addressCard}>
                                <Text style={{ color: '#6B7280' }}>No address selected. Please add one.</Text>
                                <TouchableOpacity style={[styles.continueButton, { marginTop: 10, height: 40 }]} onPress={() => router.push('/address/new?returnTo=/checkout')}>
                                    <Text style={styles.continueButtonText}>Add New Address</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Product Card */}
                    {/* Product Card(s) */}
                    {isCartCheckout ? (
                        <View>
                            {cart?.items.map((item: any, index: number) => {
                                const p = item.productId || {};
                                const itemPrice = (p.price || 0) * item.quantity;
                                const itemMrp = (p.mrp || (p.price * 1.3)) * item.quantity;
                                const itemDiscount = itemMrp - itemPrice;
                                const itemDiscountPercent = Math.round((itemDiscount / itemMrp) * 100);

                                return (
                                    <View key={item._id || index} style={[styles.productCard, { marginBottom: 12 }]}>
                                        <View style={styles.productRow}>
                                            <Image source={{ uri: p.image || p.primaryImage }} style={styles.productImage} resizeMode="contain" />
                                            <View style={styles.productInfo}>
                                                <Text style={styles.productTitle} numberOfLines={2}>{p.title}</Text>
                                                <View style={styles.ratingRow}>
                                                    <View style={styles.ratingBadge}>
                                                        <Ionicons name="star" size={12} color="#16A34A" />
                                                        <Text style={{ color: '#fff', fontSize: 10, marginLeft: 2 }}>4.7</Text>
                                                    </View>
                                                    <Text style={styles.ratingText}>(12k)</Text>
                                                </View>
                                                <View style={styles.priceRow}>
                                                    <View style={styles.discountBadge}>
                                                        <Ionicons name="arrow-down" size={12} color="#16A34A" />
                                                        <Text style={styles.discountText}>{itemDiscountPercent}%</Text>
                                                    </View>
                                                    <Text style={styles.mrpText}>₹{Math.round(p.mrp || (p.price * 1.3)).toLocaleString()}</Text>
                                                    <Text style={styles.priceText}>₹{p.price.toLocaleString()}</Text>
                                                </View>
                                                <View style={styles.qtyRow}>
                                                    <Text style={styles.qtyLabel}>Qty: {item.quantity}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        product && (
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
                        )
                    )}

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

                        <Image source={{ uri: (isCartCheckout ? ((cart?.items[0]?.productId as any)?.image || (cart?.items[0]?.productId as any)?.primaryImage || 'https://via.placeholder.com/150') : product?.image) }} style={styles.restAssuredImage} resizeMode="contain" />

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
                            <Text style={styles.priceValueCompact}>₹{(mrp || 0).toLocaleString()}</Text>
                        </View>

                        <View style={styles.dottedSeparator} />

                        <TouchableOpacity style={styles.priceRowCompact}>
                            <View style={styles.priceRowLeft}>
                                <Text style={styles.priceLabelCompact}>Fees</Text>
                                <Ionicons name="chevron-down" size={14} color="#6B7280" />
                            </View>
                            <Text style={styles.priceValueCompact}>₹{(isCartCheckout ? 0 : (product?.protectPromiseFee || 0))}</Text>
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
                        <Text style={styles.totalStrike}>₹{(mrp || 0).toLocaleString()}</Text>
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

                                {(product?.protectPromiseFee || 0) > 0 && (
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

                                {(selectedDonation || 0) > 0 && (
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

            {/* Address Selection Modal */}
            <Modal
                visible={isAddressModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setAddressModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { height: '60%' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Address</Text>
                            <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            {addresses.map((addr) => (
                                <TouchableOpacity
                                    key={addr._id}
                                    style={[
                                        styles.addressCard,
                                        { borderWidth: 1, borderColor: selectedAddress?._id === addr._id ? '#2563EB' : '#E5E7EB', marginBottom: 12 }
                                    ]}
                                    onPress={() => {
                                        setSelectedAddress(addr);
                                        setAddressId(addr._id);
                                        setAddressModalVisible(false);
                                    }}
                                >
                                    <View style={styles.addressHeader}>
                                        <Text style={styles.addressName}>{addr.name}</Text>
                                        {addr.isDefault && <View style={styles.homeTag}><Text style={styles.homeTagText}>DEFAULT</Text></View>}
                                    </View>
                                    <Text style={styles.addressText}>
                                        {addr.addressLine1}, {addr.city} - {addr.pincode}
                                    </Text>
                                    <Text style={styles.phoneText}>{addr.phone}</Text>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                style={[styles.continueButton, { marginTop: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#2563EB' }]}
                                onPress={() => {
                                    setAddressModalVisible(false);
                                    router.push('/address/new');
                                }}
                            >
                                <Text style={[styles.continueButtonText, { color: '#2563EB' }]}>+ Add New Address</Text>
                            </TouchableOpacity>
                        </ScrollView>
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
