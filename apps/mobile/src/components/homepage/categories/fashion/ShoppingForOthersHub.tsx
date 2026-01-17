import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

const CATEGORIES = [
    { name: 'Women', slug: 'women', image: 'https://loremflickr.com/400/400/woman,fashion?lock=1' },
    { name: 'Men', slug: 'men', image: 'https://loremflickr.com/400/400/man,fashion?lock=4' },
    { name: 'Kids', slug: 'kids', image: 'https://loremflickr.com/400/400/kids,fashion?lock=3' },
    { name: 'Gen Z Drips', slug: 'gen-z-drips', image: 'https://loremflickr.com/400/400/couple,fashion?lock=2' },
    { name: 'Luxe', slug: 'luxe', image: 'https://loremflickr.com/400/400/luxury,fashion?lock=5' },
];

export default function ShoppingForOthersHub() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Shopping for others?</Text>
                <Text style={styles.subtitle}>Choose a category to start exploring</Text>
            </View>

            <View style={styles.grid}>
                {CATEGORIES.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => router.push(`/fashion/collection/${item.slug}`)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                        </View>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: ITEM_WIDTH,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#F3F4F6',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
});
