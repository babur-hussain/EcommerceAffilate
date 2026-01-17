import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../hooks/useUserLocation';
import api from '../../lib/api';
import AddressSelector from './AddressSelector';
import { TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

interface Address {
    _id: string;
    userId: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
}

interface DeliveryInfoProps {
    productId?: string;
    sellerName?: string;
    trustBadges?: {
        id: string;
        name: string;
        icon: string;
    }[];
}

export default function DeliveryInfo(props: DeliveryInfoProps) {
    const { sellerName, trustBadges, productId } = props;
    const { user } = useAuth();
    const router = useRouter();
    const { address: locationAddress, fetchLocation, loading: locationLoading } = useUserLocation();

    // State Declarations
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [deliveryLoading, setDeliveryLoading] = useState(false);

    const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const response = await api.get('/api/addresses');
            setSavedAddresses(response.data);

            // If no saved addresses, fallback to live location
            if (response.data.length === 0) {
                fetchLocation();
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            fetchLocation(); // Fallback on error
        } finally {
            setLoadingAddresses(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchAddresses();
            } else {
                fetchLocation();
            }
        }, [user])
    );

    // Countdown timer logic
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const target = new Date(now);
            target.setHours(24, 0, 0, 0);

            const diff = target.getTime() - now.getTime();

            if (diff <= 0) return "00h 00m 00s";

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
        };

        setTimeLeft(updateTimer());
        const interval = setInterval(() => setTimeLeft(updateTimer()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Calculate delivery time based on selected address/pincode
    useEffect(() => {
        const fetchDeliveryTime = async () => {
            if (!productId) return;

            // Get pincode from selected address or current location
            let pincode = '';
            let addressId = undefined; // Explicitly undefined for type safety

            if (selectedAddressId === 'current' && locationAddress) {
                pincode = locationAddress.postalCode || '';
            } else if (selectedAddressId && selectedAddressId !== 'current') {
                const addr = savedAddresses.find(a => a._id === selectedAddressId);
                pincode = addr?.pincode || '';
                addressId = addr?._id;
            } else if (savedAddresses.length > 0) {
                // Default fallback to first address
                pincode = savedAddresses[0].pincode;
                addressId = savedAddresses[0]._id;
            }

            if (!pincode && !addressId) return;

            setDeliveryLoading(true);
            try {
                const response = await api.post('/api/delivery/calculate', {
                    productId,
                    pincode,
                    addressId
                });

                if (response.data.deliveryTimeText) {
                    setDeliveryDate(response.data.deliveryTimeText);
                } else if (response.data.formattedDate) {
                    setDeliveryDate(`Delivery by ${response.data.formattedDate}`);
                }
            } catch (error) {
                console.error('Delivery calculation failed:', error);
                // Fallback
                const date = new Date();
                date.setDate(date.getDate() + 5);
                setDeliveryDate(date.toDateString());
            } finally {
                setDeliveryLoading(false);
            }
        };

        fetchDeliveryTime();
    }, [productId, selectedAddressId, savedAddresses, locationAddress]);


    // Determine which address to show
    const getDisplayAddress = () => {
        // 0. Manual selection
        if (selectedAddressId === 'current') {
            if (locationAddress) {
                return {
                    label: 'CURRENT LOCATION',
                    text: locationAddress.formattedAddress || `${locationAddress.city}, ${locationAddress.postalCode}`,
                    isLive: true
                };
            }
            return {
                label: 'LOCATING...',
                text: 'Fetching current location...',
                isLive: true
            };
        }

        if (selectedAddressId) {
            const selected = savedAddresses.find(a => a._id === selectedAddressId);
            if (selected) {
                return {
                    label: selected.isDefault ? 'HOME' : 'ADDRESS',
                    text: `${selected.addressLine1}, ${selected.city}, ${selected.pincode}`,
                    isLive: false
                };
            }
        }

        // 1. Default saved address
        const defaultAddress = savedAddresses.find(a => a.isDefault);
        if (defaultAddress) {
            return {
                label: 'HOME',
                text: `${defaultAddress.addressLine1}, ${defaultAddress.city}, ${defaultAddress.pincode}`,
                isLive: false
            };
        }

        // 2. Any saved address
        if (savedAddresses.length > 0) {
            const firstFn = savedAddresses[0];
            return {
                label: 'HOME',
                text: `${firstFn.addressLine1}, ${firstFn.city}, ${firstFn.pincode}`,
                isLive: false
            };
        }

        // 3. Live location
        if (locationAddress) {
            return {
                label: 'CURRENT LOCATION',
                text: locationAddress.formattedAddress || `${locationAddress.city}, ${locationAddress.postalCode}`,
                isLive: true
            };
        }

        // 4. Loading state
        if (loadingAddresses || locationLoading) {
            return {
                label: 'LOCATING...',
                text: 'Fetching delivery location...',
                isLive: true
            };
        }

        // 5. Fallback
        return {
            label: 'SELECT LOCATION',
            text: 'Please add an address or enable location',
            isLive: false
        };
    };

    const display = getDisplayAddress();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Delivery details</Text>

            {/* Address Row */}
            <TouchableOpacity
                style={styles.addressRow}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={display.isLive ? "location-outline" : "business-outline"}
                    size={18}
                    color="#4B5563"
                />
                <Text style={styles.addressLabel}>{display.label}</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                    {display.text}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Date Row */}
            <View style={styles.infoRow}>
                <Ionicons name="car-outline" size={18} color="#4B5563" />
                <View style={styles.textCol}>
                    <Text style={styles.dateText}>
                        {deliveryLoading ? 'Calculating...' : deliveryDate}
                    </Text>
                    <Text style={styles.subText}>Order in {timeLeft}</Text>
                </View>
            </View>

            {/* Seller Row */}
            <View style={styles.infoRow}>
                <Ionicons name="storefront-outline" size={18} color="#4B5563" />
                <View style={styles.textCol}>
                    <Text style={styles.sellerText}>Fulfilled by {sellerName || 'Seller'}</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.stars}>4.7 ★</Text>
                    </View>
                </View>
            </View>

            {/* Trust badges */}
            {trustBadges && trustBadges.length > 0 && (
                <View style={styles.trustBadges}>
                    {trustBadges.map((badge, index) => (
                        <View key={index} style={styles.trustItem}>
                            <View style={styles.trustIcon}>
                                <Ionicons name={badge.icon as any} size={20} color="#FFFFFF" />
                            </View>
                            <Text style={styles.trustLabel}>{badge.name}</Text>
                        </View>
                    ))}
                </View>
            )}

            <AddressSelector
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId || (savedAddresses.find(a => a.isDefault)?._id) || savedAddresses[0]?._id}
                onSelectAddress={(addr) => setSelectedAddressId(addr._id)}
                onUseCurrentLocation={() => {
                    fetchLocation();
                    setSelectedAddressId('current');
                }}
                onAddNewAddress={() => {
                    setModalVisible(false);
                    router.push('/address/new');
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 8,
        borderBottomColor: '#F3F4F6',
    },
    header: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    addressLabel: {
        fontWeight: '800',
        color: '#1F2937',
        marginLeft: 8,
        marginRight: 4,
    },
    addressText: {
        flex: 1,
        fontSize: 13,
        color: '#4B5563',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    textCol: {
        marginLeft: 12,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    subText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    sellerText: {
        fontSize: 14,
        color: '#1F2937',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    stars: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: '#2563EB',
        paddingHorizontal: 4,
        borderRadius: 4,
        marginRight: 4,
    },
    trustBadges: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    trustItem: {
        alignItems: 'center',
    },
    trustIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2874f0', // Solid blue
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    trustLabel: {
        fontSize: 11,
        textAlign: 'center',
        color: '#4B5563',
    }
});
