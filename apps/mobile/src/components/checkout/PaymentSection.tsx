
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface PaymentSectionProps {
    totalAmount: number;
    discount: number;
    offers: any[];
    onPaymentSelect: (method: string) => void;
    onBack: () => void;
}

export default function PaymentSection({ totalAmount, discount, offers, onPaymentSelect, onBack }: PaymentSectionProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>('upi');
    const [isTotalExpanded, setIsTotalExpanded] = useState(false);

    const toggleSection = (section: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSection(expandedSection === section ? null : section);
    };

    const toggleTotal = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsTotalExpanded(!isTotalExpanded);
    }

    const renderAccordionHeader = (id: string, icon: any, title: string, subtitle?: string, offers?: string) => {
        const isExpanded = expandedSection === id;

        return (
            <TouchableOpacity
                style={[styles.accordionHeader, isExpanded && styles.accordionHeaderActive]}
                onPress={() => toggleSection(id)}
                activeOpacity={0.9}
            >
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                    <View>
                        <Text style={styles.accordionTitle}>{title}</Text>
                        {subtitle && <Text style={styles.accordionSubtitle}>{subtitle}</Text>}
                        {offers && <Text style={styles.offersText}>{offers}</Text>}
                    </View>
                </View>
                <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6B7280"
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Step Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.stepText}>Step 3 of 3</Text>
                        <Text style={styles.headerTitle}>Payments</Text>
                    </View>
                </View>
                <View style={styles.secureBadge}>
                    <Ionicons name="lock-closed" size={12} color="#4B5563" />
                    <Text style={styles.secureText}>100% Secure</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                {/* Total Amount Summary */}
                <TouchableOpacity style={styles.totalSummaryCard} onPress={toggleTotal} activeOpacity={0.9}>
                    <View style={styles.totalRow}>
                        <View style={styles.totalLabelRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Ionicons name={isTotalExpanded ? "chevron-up" : "chevron-down"} size={16} color="#2563EB" />
                        </View>
                        <Text style={styles.totalValue}>₹{totalAmount.toLocaleString()}</Text>
                    </View>
                    {isTotalExpanded && (
                        <View style={styles.totalDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailText}>Price</Text>
                                <Text style={styles.detailValue}>₹{(totalAmount + discount).toLocaleString()}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailText}>Discount</Text>
                                <Text style={styles.detailValueGreen}>- ₹{discount.toLocaleString()}</Text>
                            </View>
                            <View style={styles.detailDivider} />
                        </View>
                    )}
                </TouchableOpacity>

                {/* Instant Discount Banner - Only if offers exist */}
                {offers.length > 0 && (
                    <LinearGradient
                        colors={['#ECFDF5', '#D1FAE5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.discountBanner}
                    >
                        <View>
                            <Text style={styles.discountTitle}>{offers[0].title || 'Instant Discount'}</Text>
                            <Text style={styles.discountSubtitle}>{offers[0].description || 'Claim now with payment offers'}</Text>
                        </View>
                        <View style={styles.discountIcons}>
                            <View style={styles.bankIcon}>
                                <Ionicons name="pricetag" size={12} color="#047857" />
                            </View>
                            {offers.length > 1 && (
                                <View style={[styles.bankIcon, { marginLeft: -8 }]}>
                                    <Text style={styles.moreText}>+{offers.length - 1}</Text>
                                </View>
                            )}
                        </View>
                    </LinearGradient>
                )}

                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Payment Options</Text>
                </View>

                {/* Generic Online Payment */}
                <View style={styles.flipkartUpiCard}>
                    <View style={styles.upiHeader}>
                        <View style={styles.upiLogo}>
                            <Ionicons name="shield-checkmark" size={24} color="#002E6E" />
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.upiTitle}>Pay Online</Text>
                            <Text style={{ fontSize: 12, color: '#6B7280' }}>UPI, Cards, Wallet, NetBanking</Text>
                        </View>
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>Recommended</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.upiButton} onPress={() => onPaymentSelect('RAZORPAY')}>
                        <Text style={styles.upiButtonText}>Pay Now</Text>
                    </TouchableOpacity>
                </View>


                {/* 1. Saved Payment Options */}
                <View style={styles.paymentMethodCard}>
                    {renderAccordionHeader(
                        'saved',
                        <Ionicons name="time-outline" size={24} color="#374151" />,
                        'Saved Payment Options'
                    )}
                    {expandedSection === 'saved' && (
                        <View style={styles.accordionContent}>
                            <Text style={styles.contentPlaceholder}>No saved cards found.</Text>
                        </View>
                    )}
                </View>

                {/* 6. Cash on Delivery */}
                <View style={styles.paymentMethodCard}>
                    {renderAccordionHeader(
                        'cod',
                        <Ionicons name="cash-outline" size={24} color="#374151" />,
                        'Cash on Delivery'
                    )}
                    {expandedSection === 'cod' && (
                        <View style={styles.accordionContent}>
                            <TouchableOpacity
                                style={styles.payButton}
                                onPress={() => onPaymentSelect('COD')}
                            >
                                <Text style={styles.payButtonText}>Place Order</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>


                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

// Temporary for LinearGradient
const LinearGradient = ({ colors, style, children, start, end }: any) => {
    return (
        <View style={[style, { backgroundColor: colors[0] }]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    stepText: {
        fontSize: 12,
        color: '#6B7280',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
    },
    secureText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },
    scrollView: {
        flex: 1,
    },
    totalSummaryCard: {
        backgroundColor: '#EFF6FF',
        margin: 16,
        marginBottom: 8,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    totalLabel: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
    totalValue: {
        color: '#2563EB',
        fontSize: 18,
        fontWeight: '700',
    },
    totalDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#BFDBFE',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
    },
    detailValue: {
        fontSize: 14,
        color: '#1F2937',
    },
    detailValueGreen: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '600',
    },
    detailDivider: {
        height: 0,
    },
    discountBanner: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#ECFDF5',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    discountTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#065F46',
        marginBottom: 2,
    },
    discountSubtitle: {
        fontSize: 12,
        color: '#047857',
    },
    discountIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bankIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    moreText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4B5563',
    },
    sectionTitleContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    flipkartUpiCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    upiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    upiLogo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 20,
        gap: 2,
        marginRight: 10,
    },
    blueDot: {
        width: 6,
        height: 6,
        borderRadius: 1,
    },
    upiTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 8,
    },
    newBadge: {
        backgroundColor: '#BE123C',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    upiButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    upiButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    paymentMethodCard: {
        backgroundColor: '#FFFFFF',
        marginBottom: 1,
        paddingVertical: 4,
    },
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 16,
    },
    accordionHeaderActive: {
        backgroundColor: '#F9FAFB',
    },
    headerLeft: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 24,
        alignItems: 'center',
    },
    accordionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    accordionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    offersText: {
        fontSize: 12,
        color: '#16A34A',
        fontWeight: '500',
    },
    accordionContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 4,
        paddingLeft: 52,
    },
    contentPlaceholder: {
        color: '#9CA3AF',
        fontStyle: 'italic',
        fontSize: 13,
    },
    upiIconBox: {
        borderWidth: 1.5,
        borderColor: '#374151',
        paddingHorizontal: 4,
        borderRadius: 3,
    },
    upiIconText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#374151',
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    inputBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    inputText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    verifyButton: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 4,
    },
    verifyText: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 13,
    },
    payButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    payButtonText: {
        fontWeight: '700',
        color: '#FFFFFF',
        fontSize: 14,
    },
    cardInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 12,
    },
    cardRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    inputPlaceholder: {
        color: '#9CA3AF',
        fontSize: 14,
    }
});
