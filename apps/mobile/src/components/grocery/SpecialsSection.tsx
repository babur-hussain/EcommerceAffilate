import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ==================== Configuration Data ====================
const SUBCATEGORY_DATA = [
    {
        id: '6966996881e3721fae838d09',
        title: 'Winter Essential',
        discount: 'Up to 70% off',
        iconUrl: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768339003/products/z9nxbc93hgfkkogpflbk.png',
        badgeColor: '#1B5E20'
    },
    {
        id: 'snacks-beverages',
        title: 'Snack & Sip',
        discount: 'Up to 50% off',
        iconUrl: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768339123/products/nn8po2g34ud2irlriuxl.png',
        badgeColor: '#1B5E20'
    },
    {
        id: 'cooking-essentials',
        title: 'Cooking Corner',
        discount: 'Up to 40% off',
        iconUrl: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768339216/products/kxl5ejlw3jyuxicbdimo.png',
        badgeColor: '#1B5E20'
    }
];

export function SpecialsSection() {
    const router = useRouter();

    return (
        <View style={styles.mainBannerCard}>
            <Image
                source={{ uri: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768383925/IMG_1812_jdvudv.jpg' }}
                style={styles.bannerBackground}
                resizeMode="cover"
            />
            {/* 
            <View style={styles.subcategoryRow}>
                {SUBCATEGORY_DATA.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.subcategoryCard}
                        onPress={() => router.push(`/common-category/${item.id}`)}
                    >
                        <View style={[styles.discountBadge, { backgroundColor: item.badgeColor }]}>
                            <Text style={styles.discountText}>{item.discount}</Text>
                        </View>
                        <Text style={styles.subcategoryTitle}>{item.title}</Text>
                        <View style={styles.iconContainer}>
                            <Image
                                source={{ uri: item.iconUrl }}
                                style={styles.productIcon}
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.deliveryBanner}>
                <MaterialCommunityIcons name="timer-outline" size={20} color="#FF9800" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>
                    Get delivered in 30 Minutes
                </Text>
            </View>
            */}
        </View >
    );
}

const styles = StyleSheet.create({
    mainBannerCard: {
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 20,
        overflow: 'hidden',
    },
    bannerBackground: {
        width: '100%',
        height: 300, // Increased height to show full vertical image
    },
    titleWrapper: {
        marginTop: 20,
        alignItems: 'center',
        zIndex: 10,
        height: 55,
        justifyContent: 'center',
        marginBottom: 8,
    },
    staticTitle: {
        fontSize: 38,
        fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    subcategoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginTop: 10,
    },
    subcategoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: (Dimensions.get('window').width - 64) / 3,
        paddingVertical: 8,
        paddingHorizontal: 6,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    deliveryBanner: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
        marginTop: 20,
        marginBottom: 8,
        paddingVertical: 10,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    discountBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        marginBottom: 6,
    },
    discountText: {
        fontSize: 8,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    subcategoryTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 6,
    },
    iconContainer: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        overflow: 'hidden',
    },
    productIcon: {
        width: '85%',
        height: '85%',
    },
});
