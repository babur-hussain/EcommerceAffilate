import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ProductImageCarouselProps {
    images: string[];
}

export default function ProductImageCarousel({ images }: ProductImageCarouselProps) {
    const [activeSlide, setActiveSlide] = useState(0);

    const onScroll = (event: any) => {
        const slide = Math.ceil(
            event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
        );
        if (slide !== activeSlide) {
            setActiveSlide(slide);
        }
    };

    // Fallback if no images
    const displayImages = images && images.length > 0 ? images : ['https://via.placeholder.com/400'];

    return (
        <View style={styles.container}>
            <View style={styles.topActions}>
                {/* Placeholder for top absolute actions if any, like share/heart */}
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="heart-outline" size={24} color="#374151" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconButton, { marginTop: 12 }]}>
                    <Ionicons name="share-social-outline" size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {displayImages.map((img, index) => (
                    <View key={index} style={styles.slide}>
                        <Image source={{ uri: img }} style={styles.image} resizeMode="contain" />
                    </View>
                ))}
            </ScrollView>

            <View style={styles.pagination}>
                {displayImages.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === activeSlide ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 400,
        backgroundColor: '#FFFFFF',
        position: 'relative',
    },
    topActions: {
        position: 'absolute',
        right: 16,
        top: 16,
        zIndex: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scrollView: {
        flex: 1,
    },
    slide: {
        width: width,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#2563EB', // Blue
    },
    inactiveDot: {
        backgroundColor: '#D1D5DB', // Gray
    },
});
