import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HERO_BANNERS } from '../../../../src/data/heroBanners';
import { StatusBar } from 'expo-status-bar';

import MensCollectionLayout from '../../../../src/components/homepage/hero-banners/MensCollectionLayout';
import GrandMobilesSaleLayout from '../../../../src/components/homepage/hero-banners/GrandMobilesSaleLayout';
import BeautyPerfumeLayout from '../../../../src/components/homepage/hero-banners/BeautyPerfumeLayout';
import GrandRepublicSaleLayout from '../../../../src/components/homepage/hero-banners/GrandRepublicSaleLayout';
import TrendingFashionLayout from '../../../../src/components/homepage/hero-banners/TrendingFashionLayout';
import PremiumJewelryLayout from '../../../../src/components/homepage/hero-banners/PremiumJewelryLayout';
import AestheticFashionLayout from '../../../../src/components/homepage/hero-banners/AestheticFashionLayout';
import CyberMondayLayout from '../../../../src/components/homepage/hero-banners/CyberMondayLayout';
import FootwearSaleLayout from '../../../../src/components/homepage/hero-banners/FootwearSaleLayout';

export default function HeroBannerPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const renderContent = () => {
        switch (id) {
            case '1':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 1
                // Current Image: Woman with shopping bags (Shopping theme)
                // Implemented: Grand Republic Sale Layout (as requested)
                // ============================================================================
                return <GrandRepublicSaleLayout />;

            case '2':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 2
                // Current Image: Building/Cityscape (Services theme)
                // Implemented: Trending Fashion Layout (as requested)
                // ============================================================================
                return <TrendingFashionLayout />;

            case '3':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 3
                // Current Image: Grocery bag/items (Grocery theme)
                // Implemented: Beauty & Perfume Layout (as requested)
                // ============================================================================
                return <BeautyPerfumeLayout />;

            case '4':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 4
                // Current Image: Electronics/Headphones (Gadgets theme)
                // Implemented: Exclusive Men's Collection Layout (as requested)
                // ============================================================================
                return <MensCollectionLayout />;

            case '5':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 5
                // Current Image: Beauty products (Beauty theme)
                // Implemented: Grand Mobiles Sale Layout (as requested)
                // ============================================================================
                return <GrandMobilesSaleLayout />;

            case '6':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 6
                // Current Image: Furniture/Sofa (Home & Furniture theme)
                // Implemented: Aesthetic Fashion Layout (as requested)
                // ============================================================================
                return <AestheticFashionLayout />;

            case '7':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 7
                // Current Image: Man with phone (Mobile/App theme)
                // Implemented: Premium Jewelry Layout (as requested)
                // ============================================================================
                return <PremiumJewelryLayout />;

            case '8':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 8
                // Current Image: Gift box/Present (Sale theme)
                // Implemented: Cyber Monday Layout (as requested)
                // ============================================================================
                return <CyberMondayLayout />;

            case '9':
                // ============================================================================
                // LAYOUT FOR HERO BANNER ID: 9
                // Current Image: Pizza/Food (Food Delivery theme)
                // Implemented: Footwear Sale Layout (as requested)
                // ============================================================================
                return <FootwearSaleLayout />;

            default:
                // Fallback for unknown IDs
                return <GenericBannerLayout id={typeof id === 'string' ? id : 'unknown'} />;
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            {id !== '9' && id !== '8' && id !== '7' && id !== '6' && (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{id === '4' ? 'ELEGANCE' : 'Details'}</Text>
                    <View style={{ width: 40 }} />
                </View>
            )}

            {renderContent()}
        </View>
    );
}

/**
 * Generic Layout Component
 * Used as a placeholder until specific layouts are implemented for each ID.
 */
function GenericBannerLayout({ id }: { id: string }) {
    const banner = HERO_BANNERS.find((b: any) => b.id === id);

    const displayBanner = banner || {
        title: 'Special Offer',
        subtitle: 'Exclusive Deal',
        image: 'https://via.placeholder.com/800x400',
        backgroundColor: '#4F46E5',
        id: id
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.bannerContainer, { backgroundColor: displayBanner.backgroundColor }]}>
                <Image
                    source={{ uri: displayBanner.image }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gradientOverlay}
                >
                    <Text style={styles.bannerSubText}>{displayBanner.subtitle || 'Limited Time'}</Text>
                    <Text style={styles.bannerText}>{displayBanner.title || `Offer #${id}`}</Text>
                </LinearGradient>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>About Offer #{id}</Text>
                <Text style={styles.description}>
                    This is the generic layout placeholder.
                    Please implement the specific design as per the comments above in the switch statement.
                </Text>

                <View style={styles.placeholderBox} />
                <View style={styles.placeholderBox} />
                <View style={styles.placeholderBox} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
    },
    scrollContent: {
        paddingBottom: 32,
    },
    bannerContainer: {
        height: 220,
        margin: 16,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 20,
    },
    bannerText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bannerSubText: {
        color: '#E0E7FF',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#111',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4B5563',
        marginBottom: 24,
    },
    placeholderBox: {
        height: 100,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        marginBottom: 16,
    },
});
