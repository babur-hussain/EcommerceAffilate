import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useWishlist } from '../../src/context/WishlistContext';

export default function WishlistScreen() {
    const router = useRouter();
    const { wishlist, loading, refreshWishlist, removeFromWishlist } = useWishlist();
    const insets = useSafeAreaInsets();

    const renderItem = ({ item }: { item: any }) => {
        // Handle cases where item might be null or unpopulated if backend data is messy
        if (!item || !item._id) return null;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/product/${item._id}`)}
                activeOpacity={0.7}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.images?.[0] }} style={styles.image} contentFit="cover" />
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFromWishlist(item._id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>
                <View style={styles.details}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.price}>₹{item.price?.toLocaleString()}</Text>

                    {/* Optional: Add "Move to Cart" button here later */}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wishlist ({wishlist.length})</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={wishlist}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refreshWishlist} tintColor="#2874F0" />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                            <Text style={styles.emptySubtitle}>Save items you love to view them here later</Text>
                            <TouchableOpacity style={styles.shopNowButton} onPress={() => router.push('/')}>
                                <Text style={styles.shopNowText}>Start Shopping</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    listContent: {
        padding: 12,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        // Shadow
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        position: 'relative',
        backgroundColor: '#F3F4F6',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
    },
    details: {
        padding: 10,
    },
    title: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
        height: 36, // Force exactly 2 lines height approx
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
    },
    shopNowButton: {
        backgroundColor: '#2874F0',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopNowText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
});
