// Winter card - for Winter Collection with snowflake decorations
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { CardProps } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function WinterCard({ product, theme, onPress }: CardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            <View style={[styles.footer, { backgroundColor: theme.accentColor || '#B3E5FC' }]}>
                <View style={styles.snowflakeLeft}>
                    <FontAwesome5 name="snowflake" size={16} color="#B3E5FC" />
                </View>
                <View style={styles.snowflakeRight}>
                    <FontAwesome5 name="snowflake" size={16} color="#B3E5FC" />
                </View>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.offerText}>Min. {product.discount}% Off</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: ITEM_WIDTH,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    productImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
    },
    footer: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        position: 'relative',
    },
    snowflakeLeft: {
        position: 'absolute',
        top: 8,
        left: 8,
    },
    snowflakeRight: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    productName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#01579B',
        textAlign: 'center',
        marginBottom: 2,
    },
    offerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0277BD',
        textAlign: 'center',
    },
});
