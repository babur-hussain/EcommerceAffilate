import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import CachedImage from '../shared/CachedImage';

import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

interface Banner {
    imageUrl: string;
    actionUrl?: string;
}

interface CategoryBannerSliderProps {
    banners: (string | Banner)[];
}

const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/category/')) {
        return url.replace('/category/', '/common-category/');
    }
    return url;
};

export default function CategoryBannerSlider({ banners }: CategoryBannerSliderProps) {
    const router = useRouter();
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const bannerScrollViewRef = useRef<ScrollView>(null);

    // Auto-slide logic
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            const nextIndex = (activeBannerIndex + 1) % banners.length;

            if (bannerScrollViewRef.current) {
                bannerScrollViewRef.current.scrollTo({
                    x: nextIndex * width,
                    animated: true,
                });
            }
        }, 3000); // Slide every 3 seconds

        return () => clearInterval(interval);
    }, [activeBannerIndex, banners]);

    const onBannerScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveBannerIndex(roundIndex);
    };

    // Filter out invalid banners to prevent crashes/empty renders
    const validBanners = banners.filter(b => {
        if (typeof b === 'string') return !!b;
        return !!b && !!b.imageUrl;
    });

    if (validBanners.length === 0) {
        return null;
    }

    return (
        <View style={styles.bannerWrapper}>
            <ScrollView
                ref={bannerScrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onBannerScroll}
                scrollEventThrottle={16}
                style={styles.bannerContainer}
            >
                {validBanners.map((banner, index) => {
                    const imageUrl = typeof banner === 'string' ? banner : banner.imageUrl;
                    const actionUrl = typeof banner === 'string' ? undefined : banner.actionUrl;

                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={actionUrl ? 0.9 : 1}
                            onPress={() => actionUrl && router.push(normalizeUrl(actionUrl) as any)}
                        >
                            <CachedImage
                                source={{ uri: imageUrl }}
                                style={styles.bannerImage}
                            />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            {/* Pagination Dots */}
            <View style={styles.paginationDots}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === activeBannerIndex ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bannerWrapper: {
        marginTop: 12,
        marginBottom: 8,
    },
    bannerContainer: {
        width: width,
        height: 200, // Adjust height as needed (aspect ratio)
    },
    bannerImage: {
        width: width - 32, // Full width with some padding
        height: 200,
        marginHorizontal: 16,
        borderRadius: 12,
        resizeMode: 'cover',
        backgroundColor: '#eee',
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        height: 4,
        borderRadius: 2,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 20,
        backgroundColor: '#111827',
    },
    inactiveDot: {
        width: 6,
        backgroundColor: '#D1D5DB',
    },
});
