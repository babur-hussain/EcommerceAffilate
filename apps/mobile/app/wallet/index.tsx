import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useData } from '../../src/hooks/useData';

interface Transaction {
    _id: string;
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    description: string;
    referenceId?: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
}

interface WalletHistoryResponse {
    transactions: Transaction[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}

export default function WalletScreen() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [page, setPage] = useState(1);
    const insets = useSafeAreaInsets();

    const {
        data,
        error,
        loading: isLoading,
        refetch,
        isRefetching
    } = useData<WalletHistoryResponse>(`/api/wallet/history?page=${page}&limit=20`);

    const onRefresh = async () => {
        setPage(1);
        await Promise.all([refreshUser(), refetch()]);
    };

    const renderTransaction = ({ item }: { item: Transaction }) => {
        const isCredit = item.type === 'CREDIT';
        const date = new Date(item.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        return (
            <View style={styles.transactionItem}>
                <View style={[styles.iconContainer, isCredit ? styles.creditIcon : styles.debitIcon]}>
                    <Ionicons
                        name={isCredit ? "arrow-down" : "arrow-up"}
                        size={18}
                        color={isCredit ? "#059669" : "#DC2626"}
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{item.description}</Text>
                    <Text style={styles.transactionDate}>
                        {formattedDate}
                    </Text>
                </View>
                <Text style={[styles.transactionAmount, isCredit ? styles.creditAmount : styles.debitAmount]}>
                    {isCredit ? '+' : '-'} {item.amount}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header with Balance Card */}
            <View style={styles.header}>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Wallet</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.balanceCard}>
                    <View>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <View style={styles.balanceRow}>
                            <Ionicons name="flash" size={24} color="#FCD34D" />
                            <Text style={styles.balanceAmount}>{(user as any)?.coins || 0}</Text>
                        </View>
                    </View>
                    <View style={styles.coinIconLargeContainer}>
                        <Ionicons name="wallet-outline" size={48} color="rgba(255,255,255,0.2)" />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Transaction History</Text>

                {isLoading && !data ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#2874F0" />
                    </View>
                ) : error ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorText}>Failed to load history</Text>
                        <TouchableOpacity onPress={refetch} style={styles.retryButton}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={data?.transactions || []}
                        renderItem={renderTransaction}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={[
                            styles.listContent,
                            { paddingBottom: insets.bottom + 20 }
                        ]}
                        refreshControl={
                            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#2874F0" />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
                                <Text style={styles.emptyText}>No transactions yet</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2874F0', // Brand Blue
    },
    header: {
        backgroundColor: '#2874F0',
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        height: 44,
    },
    backButton: {
        padding: 8,
        // marginLeft: -8, // Removed to prevent cut-off on Android
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    balanceCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    balanceLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 8,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    balanceAmount: {
        color: 'white',
        fontSize: 32,
        fontWeight: '700',
    },
    coinIconLargeContainer: {
        // optional decorative styling
    },
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    creditIcon: {
        backgroundColor: '#ECFDF5',
    },
    debitIcon: {
        backgroundColor: '#FEF2F2',
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#6B7280',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
    creditAmount: {
        color: '#059669',
    },
    debitAmount: {
        color: '#DC2626',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    errorText: {
        color: '#6B7280',
        marginBottom: 12,
    },
    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    retryText: {
        color: '#2874F0',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#9CA3AF',
        marginTop: 12,
        fontSize: 16,
    },
});
