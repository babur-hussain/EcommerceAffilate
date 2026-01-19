import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import api from '../../lib/api';
import CachedImage from '../shared/CachedImage';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

import { HERO_BANNERS, BannerData } from '../../data/heroBanners';

/**
 * HeroBanner Component
 * 
 * Displays a rotating carousel of feature banners at the top of the home screen.
 * - Auto-scrolls every 5 seconds
 * - Supports manual swipe
 * - Clicking a banner navigates to a detailed view
 * - Fetches configuration from API, falls back to local data if unavailable
 */

export default function HeroBanner() {
    const [banners, setBanners] = useState<BannerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const router = useRouter();

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await api.get('/api/homepage');
            const sections = response.data.sections || [];
            const heroSection = sections.find((s: any) => s.type === 'HERO_BANNER');

            if (heroSection && heroSection.config && heroSection.config.banners && heroSection.config.banners.length > 0) {
                // Map API banner format to component format
                const mappedBanners = heroSection.config.banners.map((b: any, index: number) => ({
                    id: b.id || String(index),
                    title: b.title || heroSection.title || '',
                    subtitle: b.subtitle || heroSection.subtitle || '',
                    image: b.imageUrl || b.image || 'https://via.placeholder.com/800x400',
                    backgroundColor: b.backgroundColor || '#4F46E5',
                }));
                setBanners(mappedBanners);
            } else {
                // Fallback if no hero banner configured
                setBanners(HERO_BANNERS);
            }
        } catch (error) {
            console.error('Error fetching banners, using fallback:', error);
            setBanners(HERO_BANNERS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            if (activeIndex < banners.length - 1) {
                scrollViewRef.current?.scrollTo({ x: (activeIndex + 1) * (width - 32), animated: true });
                setActiveIndex(activeIndex + 1);
            } else {
                scrollViewRef.current?.scrollTo({ x: 0, animated: true });
                setActiveIndex(0);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [activeIndex, banners]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    if (loading) {
        return (
            <View style={[styles.mainContainer, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (banners.length === 0) return null;

    return (
        <View style={styles.mainContainer}>
            <View style={styles.imageContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={styles.scrollView}
                >
                    {banners.map((banner) => (
                        <TouchableOpacity
                            key={banner.id}
                            style={styles.slide}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/home/hero-banner/${banner.id}`)}
                        >
                            <CachedImage source={{ uri: banner.image }} style={styles.image} contentFit="cover" />
                            <View style={styles.gradient}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.subtitle}>{banner.subtitle}</Text>
                                    <Text style={styles.title}>{banner.title}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.pagination}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeIndex ? styles.paginationDotActive : null,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        marginBottom: 20,
        marginHorizontal: 16,
        marginTop: 16,
    },
    imageContainer: {
        height: BANNER_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        height: BANNER_HEIGHT,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
    },
    scrollView: {
        width: width - 32, // Adjust for margin
        height: BANNER_HEIGHT,
    },
    slide: {
        width: width - 32, // Adjust for margin
        height: BANNER_HEIGHT,
        justifyContent: 'flex-end',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        resizeMode: 'cover',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 16,
    },
    textContainer: {
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#E0E7FF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    pagination: {
        marginTop: 12,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    paginationDot: {
        width: 12,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#F97316',
        width: 24,
    },
});
