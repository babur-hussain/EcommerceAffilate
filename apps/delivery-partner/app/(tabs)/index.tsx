import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import axios from 'axios';
import { Styles } from '../../constants/Styles';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { getMessaging, getToken, requestPermission, AuthorizationStatus, registerDeviceForRemoteMessages } from '@react-native-firebase/messaging';

// Hardcoded for MVP dev - Replace with actual auth UID later
const TEST_PARTNER_ID = '696bfd26b425297a480a92e1';
const API_URL = 'http://192.168.29.193:4000/api'; // Use local IP for mobile dev

export default function HomeScreen() {
    const [isOnline, setIsOnline] = useState(false);
    const insets = useSafeAreaInsets();
    const [stats, setStats] = useState({ earnings: 0, completedOrders: 0 });
    const [history, setHistory] = useState<any[]>([]);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Fetch Stats
            const statsRes = await axios.get(`${API_URL}/partner/stats?userId=${TEST_PARTNER_ID}`);
            setStats(statsRes.data);

            // 2. Fetch History
            const histRes = await axios.get(`${API_URL}/partner/history?userId=${TEST_PARTNER_ID}`);
            setHistory(histRes.data);
        } catch (err) {
            console.log('Error fetching partner nav data:', err);
        }
    };

    const toggleOnlineStatus = async (value: boolean) => {
        // Optimistic update
        setIsOnline(value);
        try {
            // Get FCM Token to update backend
            let fcmToken = '';
            try {
                const messaging = getMessaging();
                const authStatus = await requestPermission(messaging);
                const enabled =
                    authStatus === AuthorizationStatus.AUTHORIZED ||
                    authStatus === AuthorizationStatus.PROVISIONAL;

                if (enabled) {
                    if (Platform.OS === 'ios') {
                        await registerDeviceForRemoteMessages(messaging);
                    }
                    fcmToken = await getToken(messaging);
                    console.log('FCM Token:', fcmToken);
                }
            } catch (error) {
                console.log('Error getting FCM token:', error);
            }

            await axios.post(`${API_URL}/partner/toggle-status`, {
                userId: TEST_PARTNER_ID,
                isOnline: value,
                fcmToken // Send token to backend
            });
        } catch (err) {
            console.error('Failed to update status', err);
            // Revert on failure
            setIsOnline(!value);
            alert('Failed to update status. Please try again.');
        }
    };

    return (
        <View style={Styles.container}>
            {/* Custom Header */}
            <View style={[styles.headerContainer, { backgroundColor: isOnline ? Colors.primary : Colors.surface, paddingTop: insets.top }]}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={[styles.greeting, { color: isOnline ? '#FFF' : Colors.text }]}>Hello, Partner 👋</Text>
                        <Text style={[styles.statusText, { color: isOnline ? '#FFF' : Colors.textSecondary }]}>
                            {isOnline ? 'You are Online' : 'You are Offline'}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#34C759' }}
                        thumbColor={'#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleOnlineStatus}
                        value={isOnline}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]}>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={[Styles.card, styles.statCard]}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="wallet" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.statValue}>₹{stats.earnings}</Text>
                        <Text style={styles.statLabel}>Today's Earnings</Text>
                    </View>
                    <View style={[Styles.card, styles.statCard]}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <FontAwesome5 name="check-circle" size={24} color={Colors.secondary} />
                        </View>
                        <Text style={styles.statValue}>{stats.completedOrders}</Text>
                        <Text style={styles.statLabel}>Completed Orders</Text>
                    </View>
                </View>

                {/* Active Order / Status */}
                {isOnline ? (
                    <View style={[Styles.card, styles.waitingCard]}>
                        <View style={styles.radarContainer}>
                            <View style={styles.radarRing} />
                            <FontAwesome5 name="search-location" size={40} color={Colors.primary} />
                        </View>
                        <Text style={styles.waitingText}>Finding nearby orders...</Text>
                        <Text style={styles.waitingSubtext}>Stay in high demand areas for more requests.</Text>
                    </View>
                ) : (
                    <View style={[Styles.card, styles.offlineCard]}>
                        <Ionicons name="moon" size={48} color={Colors.textSecondary} />
                        <Text style={styles.offlineText}>You are currently offline</Text>
                        <Text style={styles.offlineSubtext}>Go online to start receiving delivery requests.</Text>
                    </View>
                )}

                {/* Recent Activity / Announcements */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                {history.length === 0 ? (
                    <Text style={{ color: Colors.textSecondary }}>No recent activity</Text>
                ) : (
                    history.map((item, index) => (
                        <View key={index} style={[Styles.card, styles.activityItem]}>
                            <View style={styles.activityIcon}>
                                <FontAwesome5 name="box" size={16} color={Colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.activityTitle}>Order #{item._id.slice(-4)} Delivered</Text>
                                <Text style={styles.activityTime}>{new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </View>
                            <Text style={styles.activityAmount}>+₹{item.shippingCharges || 0}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 14,
        marginTop: 4,
    },
    content: {
        padding: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        flex: 0.48,
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    waitingCard: {
        alignItems: 'center',
        paddingVertical: 40,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#E3F2FD',
        backgroundColor: '#F8FDFF',
    },
    radarContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radarRing: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#E3F2FD',
        opacity: 0.5,
    },
    waitingText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 8,
    },
    waitingSubtext: {
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    offlineCard: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#F5F5F5',
    },
    offlineText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    offlineSubtext: {
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: 20,
        marginBottom: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    activityIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    activityTime: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    activityAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
});
