import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');
// Card width is screen width minus margins (16 * 2)
const CARD_WIDTH = width - 32;
const SPACING = 12;
const STRIDE = CARD_WIDTH + SPACING;
const BANNER_HEIGHT = 160;

const BANNERS = [
    {
        id: 1,
        // Using a bright yellow/green gradient or image to match the reference style
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        title: "LOWEST PRICES",
        subtitle: "Up to 80% off",
        color: "#FFD700"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1588964895597-a51e21d827cf?auto=format&fit=crop&w=800&q=80",
        title: "FRESH ARRIVALS",
        subtitle: "Farm to Table",
        color: "#4CAF50"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1604719312566-b7cb977119e7?auto=format&fit=crop&w=800&q=80",
        title: "DAILY ESSENTIALS",
        subtitle: "Starting @ ₹1",
        color: "#2196F3"
    },
];

export function ContinuousBannerSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= BANNERS.length) {
                nextIndex = 0;
            }
            scrollViewRef.current?.scrollTo({ x: nextIndex * STRIDE, animated: true });
            setActiveIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled={false}
                decelerationRate="fast"
                snapToInterval={STRIDE}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / STRIDE);
                    setActiveIndex(newIndex);
                }}
                contentContainerStyle={styles.scrollContent}
            >
                {BANNERS.map((banner, index) => (
                    <View key={banner.id} style={styles.slide}>
                        <Image
                            source={{ uri: banner.image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        {/* Overlay Gradient/Text */}
                        <View style={[styles.textOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                            <Text style={styles.bannerTitle}>{banner.title}</Text>
                            <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                            <View style={styles.shopNowBtn}>
                                <Text style={styles.shopNowText}>Shop Now</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {BANNERS.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            i === activeIndex && styles.activeDot
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        marginHorizontal: 16,
    },
    scrollContent: {
        // No padding here to align correctly with paging
    },
    slide: {
        width: CARD_WIDTH,
        height: BANNER_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: SPACING,
        backgroundColor: '#f0f0f0',
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        textAlign: 'center',
        marginBottom: 4,
        // Font mimicking the "LOWEST PRICES" style
        fontStyle: 'italic',
        textTransform: 'uppercase'
    },
    bannerSubtitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: '#1B5E20', // Green pill background
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 12,
        overflow: 'hidden'
    },
    shopNowBtn: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
    },
    shopNowText: {
        color: '#1B5E20',
        fontWeight: 'bold',
        fontSize: 12,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#374151',
        width: 24,
    }
});


{/* Based on the code structure (width - 32 for width and 160 height), here are the optimal specifications for your banner images to ensure they look crisp on high-density screens (Retina/@3x) without slowing down the app.

📏 Recommended Dimensions
1200 x 500 pixels

Aspect Ratio: Approximately 2.4:1
Why: This resolution covers the width of even the largest phones (like iPhone Pro Max) at 3x pixel density while maintaining the correct height proportion defined in your code (160dp).
🖼️ Best File Format
WebP (Recommended)

Why: It offers superior compression (30% smaller than JPEG) with identical visual quality. It is fully supported by modern React Native (Expo).
Alternative: JPG (if WebP is difficult to generate). Avoid PNG unless you need transparency, as it is too heavy.
💾 Target File Size
Under 150 KB (Ideal: 80-100 KB)

Why: You have a slider with multiple images. If each image is big (e.g., 1MB), loading 5 banners = 5MB data, which will cause lag during auto-scroll and delay the initial render.
🚀 Optimization Summary for Designers
Property	Value
Dimension	1200w x 500h px
Format	WebP (Quality 85%)
Max File Size	150 KB
Safe Zone	Keep text/logos in the center 1000px to avoid cutting off on smaller screens. */}