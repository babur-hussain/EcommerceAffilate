import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 4; // 4 items with padding

export interface CuratedItem {
    name: string;
    image: any;
    bgColor?: string; // Optional custom bg for item circle
}

interface CuratedTopicSectionProps {
    title: string;
    subtitle: string;
    backgroundColor: string;
    headerImage: any;
    items: CuratedItem[];
}

export default function CuratedTopicSection({
    title,
    subtitle,
    backgroundColor,
    headerImage,
    items,
}: CuratedTopicSectionProps) {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                <Image source={headerImage} style={styles.headerImage} resizeMode="contain" />
            </View>

            <View style={styles.grid}>
                {items.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.itemContainer}>
                        <View style={[styles.imageWrapper, { backgroundColor: item.bgColor || '#F3F4F6' }]}>
                            <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                        </View>
                        <Text style={styles.itemName} numberOfLines={2}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        marginBottom: 0, // Continuous flow
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '800', // Extra bold
        color: '#1F2937',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        fontWeight: '400',
    },
    headerImage: {
        width: 80,
        height: 60,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemContainer: {
        width: ITEM_WIDTH,
        alignItems: 'center',
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1, // Square
        borderRadius: 16,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    itemImage: {
        width: '80%',
        height: '80%',
    },
    itemName: {
        fontSize: 11,
        textAlign: 'center',
        color: '#374151',
        fontWeight: '600',
        lineHeight: 14,
    },
});
