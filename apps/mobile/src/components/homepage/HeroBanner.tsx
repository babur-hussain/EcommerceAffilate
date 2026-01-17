import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../lib/api';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

interface BannerData {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    backgroundColor: string;
}

const FALLBACK_BANNERS: BannerData[] = [
    {
        id: '1',
        title: 'Summer Collection',
        subtitle: 'Up to 50% Off',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        backgroundColor: '#4F46E5',
    },
    {
        id: '2',
        title: 'New Arrivals',
        subtitle: 'Check out the latest trends',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        backgroundColor: '#10B981',
    },
    {
        id: '3',
        title: 'Exclusive Deals',
        subtitle: 'Limited time offers',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        backgroundColor: '#F59E0B',
    },
];

export default function HeroBanner() {
    const [banners, setBanners] = useState<BannerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

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
                setBanners(FALLBACK_BANNERS);
            }
        } catch (error) {
            console.error('Error fetching banners, using fallback:', error);
            setBanners(FALLBACK_BANNERS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            if (activeIndex < banners.length - 1) {
                scrollViewRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
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
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (banners.length === 0) return null;

    return (
        <View style={styles.container}>
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
                    <View key={banner.id} style={styles.slide}>
                        <Image source={{ uri: banner.image }} style={styles.image} />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.gradient}
                        >
                            <View style={styles.textContainer}>
                                <Text style={styles.subtitle}>{banner.subtitle}</Text>
                                <Text style={styles.title}>{banner.title}</Text>
                            </View>
                        </LinearGradient>
                    </View>
                ))}
            </ScrollView>
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
    container: {
        height: BANNER_HEIGHT,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    loadingContainer: {
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
        position: 'absolute',
        bottom: 16,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 20,
    },
});
