import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useData } from '../../src/hooks/useData';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Address {
    _id: string;
    name: string;
    phone: string;
    pincode: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    isDefault?: boolean;
    type?: string;
}

export default function AddressListScreen() {
    const router = useRouter();
    const { data: addresses, refetch, isRefetching, error } = useData<Address[]>('/api/addresses');

    const handleAddNew = () => {
        router.push('/address/new');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Addresses</Text>
                <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#2563EB" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
            >
                {addresses && addresses.length > 0 ? (
                    addresses.map((addr) => (
                        <View key={addr._id} style={styles.addressCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.name}>{addr.name}</Text>
                                <View style={styles.tagRow}>
                                    {addr.type && (
                                        <View style={styles.typeTag}>
                                            <Text style={styles.typeText}>{addr.type}</Text>
                                        </View>
                                    )}
                                    {addr.isDefault && (
                                        <View style={styles.defaultTag}>
                                            <Text style={styles.defaultText}>DEFAULT</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <Text style={styles.addressText}>
                                {addr.addressLine1}, {addr.addressLine2}
                            </Text>
                            <Text style={styles.addressText}>
                                {addr.city}, {addr.state} - {addr.pincode}
                            </Text>
                            <Text style={styles.phoneText}>Phone: {addr.phone}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="location-outline" size={64} color="#9CA3AF" />
                        <Text style={styles.emptyTitle}>No Addresses Found</Text>
                        <Text style={styles.emptySubtitle}>Add a new address to manage your deliveries</Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
                            <Text style={styles.emptyButtonText}>Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    addButton: {
        padding: 4,
    },
    content: {
        padding: 16,
        flexGrow: 1,
    },
    addressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    tagRow: {
        flexDirection: 'row',
    },
    typeTag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4B5563',
        textTransform: 'uppercase',
    },
    defaultTag: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#2563EB',
    },
    addressText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 2,
        lineHeight: 20,
    },
    phoneText: {
        fontSize: 14,
        color: '#111827',
        marginTop: 8,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
});
