import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

const { width } = Dimensions.get('window');
const TIMER_DURATION = 30;

export default function AlarmScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    // Params from FCM data
    const { orderId, amount, address } = params;

    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [status, setStatus] = useState<'RINGING' | 'ACCEPTED' | 'REJECTED'>('RINGING');

    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleTimeout = () => {
        if (status === 'RINGING') {
            setStatus('REJECTED');
            // Auto-reject or just navigate back
            router.back();
        }
    };

    const handleAccept = async () => {
        try {
            // Call API to accept
            await axios.post(`http://192.168.29.193:4000/api/partner/orders/${orderId}/accept`, {
                userId: '696bfd26b425297a480a92e1' // Hardcoded TEST_PARTNER_ID
            });
            setStatus('ACCEPTED');
            alert('Order Accepted! Navigate to map...');
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Accept failed', error);
            alert('Failed to accept order. It may have been taken.');
            router.back();
        }
    };

    const handleDecline = () => {
        setStatus('REJECTED');
        router.back();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>New Delivery Request!</Text>
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{timeLeft}s</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Earnings</Text>
                        <Text style={styles.amountValue}>₹{amount || '0'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.locationContainer}>
                        <View style={styles.locationRow}>
                            <FontAwesome5 name="store" size={20} color={Colors.primary} style={styles.icon} />
                            <View>
                                <Text style={styles.locationLabel}>Pickup</Text>
                                <Text style={styles.locationText}>Seller Location</Text>
                            </View>
                        </View>
                        <View style={styles.locationLine} />
                        <View style={styles.locationRow}>
                            <FontAwesome5 name="map-marker-alt" size={20} color={Colors.secondary} style={styles.icon} />
                            <View>
                                <Text style={styles.locationLabel}>Dropoff</Text>
                                <Text style={styles.locationText}>{address || 'Customer Address'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={handleDecline}>
                        <Ionicons name="close" size={30} color="#FFF" />
                        <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
                        <Ionicons name="checkmark" size={30} color="#FFF" />
                        <Text style={styles.buttonText}>Accept Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background for alarm
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    timerContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    timerText: {
        color: Colors.secondary,
        fontSize: 32,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        marginVertical: 40,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    amountLabel: {
        color: Colors.textSecondary,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    amountValue: {
        color: Colors.primary,
        fontSize: 36,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 20,
    },
    locationContainer: {
        // Simple timeline style
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        textAlign: 'center',
        marginRight: 12,
    },
    locationLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    locationText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    locationLine: {
        height: 30,
        borderLeftWidth: 2,
        borderLeftColor: '#EEE',
        marginLeft: 15,
        marginVertical: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        height: 60,
        flex: 0.48,
    },
    declineButton: {
        backgroundColor: '#FF3B30',
    },
    acceptButton: {
        backgroundColor: '#34C759',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 8,
    },
});
