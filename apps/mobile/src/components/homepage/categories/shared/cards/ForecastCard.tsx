// Forecast card - full-width trend cards with text overlay
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CardProps } from '../types';

const { width } = Dimensions.get('window');

const FORECAST_ITEMS = [
    { title: 'TEXTURED\nSWEATERS', sub: 'From ₹249', align: 'left' },
    { title: 'BAGGY\nJEANS', sub: 'Min. 60% Off', align: 'right' },
    { title: 'PLAID\nSHIRTS', sub: '', align: 'bottomLeft' },
    { title: 'OVERSIZED\nTEES', sub: 'Under ₹399', align: 'right' },
];

export default function ForecastCard({ product, theme, onPress, index = 0 }: CardProps) {
    const forecastItem = FORECAST_ITEMS[index % FORECAST_ITEMS.length];

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <Image source={{ uri: product.images[0] }} style={styles.forecastImage} />
            <View style={[
                styles.forecastOverlay,
                forecastItem.align === 'left' ? styles.alignLeft :
                    forecastItem.align === 'right' ? styles.alignRight :
                        styles.alignBottomLeft
            ]}>
                <Text style={styles.forecastTitle}>{forecastItem.title}</Text>
                {forecastItem.sub ? <Text style={styles.forecastSub}>{forecastItem.sub}</Text> : null}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: width - 32,
        height: 200,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    forecastImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    forecastOverlay: {
        position: 'absolute',
        padding: 16,
    },
    alignLeft: {
        top: 16,
        left: 16,
    },
    alignRight: {
        top: 16,
        right: 16,
        alignItems: 'flex-end',
    },
    alignBottomLeft: {
        bottom: 16,
        left: 16,
    },
    forecastTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        lineHeight: 28,
    },
    forecastSub: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
