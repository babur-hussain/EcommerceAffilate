import React from 'react';
import { ImageStyle, StyleProp, View, StyleSheet } from 'react-native';
import { Image as ExpoImage, ImageContentFit } from 'expo-image';

interface CachedImageProps {
    source: string | { uri: string };
    style?: StyleProp<ImageStyle>;
    contentFit?: ImageContentFit;
    placeholder?: string; // blurhash or local image
    cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk';
}

/**
 * A wrapper around expo-image that enforces caching.
 * Use this instead of React Native's <Image /> for remote URLs.
 */
export default function CachedImage({
    source,
    style,
    contentFit = 'cover',
    placeholder,
    cachePolicy = 'memory-disk' // Default to aggressive caching
}: CachedImageProps) {
    // Normalize source
    const imageSource = typeof source === 'string' ? { uri: source } : source;

    return (
        <View style={[styles.container, style]}>
            <ExpoImage
                style={[styles.image, StyleSheet.absoluteFill]} // absoluteFill ensures it fills the container logic if style is width/height
                source={imageSource}
                contentFit={contentFit}
                placeholder={placeholder}
                cachePolicy={cachePolicy}
                transition={300} // Smooth fade in
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        // Default background to avoid "blank" look while loading
        backgroundColor: '#F3F4F6',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6'
    }
});
