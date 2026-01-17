import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RecentItem {
    id: string;
    label: string;
    image: string;
}

// Hardcoded data as requested
const RECENT_ITEMS: RecentItem[] = [
    {
        id: '1',
        label: 'Mobiles',
        image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/3/5/l/-original-imaghx9qmgqsk9s4.jpeg?q=70',
    },
    {
        id: '2',
        label: 'Blankets',
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/blanket/z/n/e/soft-warm-blanket-for-winter-double-bed-mink-blanket-for-heavy-original-imah7xz6h7z6z5zz.jpeg?q=70',
    },
    {
        id: '3',
        label: "Men's Casual Shoes",
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/1/8/p/-original-imaghvb7kkpy73vn.jpeg?q=70',
    },
    {
        id: '4',
        label: 'T-Shirts',
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/t/e/0/l-st-theboys-black-smartees-original-imagnqszzzzyuzru.jpeg?q=70',
    },
];

interface RecentHistorySectionProps {
    userName?: string;
}

export default function RecentHistorySection({ userName = 'User' }: RecentHistorySectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.background}>
                {/* Background Pattern Image could go here if needed, utilizing a flat color for now matching reference */}
                <Image
                    source={{ uri: 'https://rukminim2.flixcart.com/fk-p-flap/200/200/image/d3450917223b2044.jpg?q=70' }}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />
            </View>

            {/* Decorative Stamp Mock */}
            <View style={styles.stampContainer}>
                <MaterialCommunityIcons name="stamper" size={80} color="#1B5E20" />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{userName}, still looking for these?</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {RECENT_ITEMS.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                            </View>
                            <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12, // Increased margin
        position: 'relative',
        minHeight: 200, // Increased height
        borderRadius: 16, // Rounded corners for the whole section
        overflow: 'hidden',
        marginHorizontal: 16, // Add side margins to match the card look in the screenshot
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#C8E6C9', // Soft mint green match
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        opacity: 0.15, // Reduced opacity for subtle texture
    },
    // Decorative stamp simulation
    stampContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        opacity: 0.1,
        transform: [{ rotate: '-15deg' }],
    },
    content: {
        paddingVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700', // Bolder
        color: '#1B5E20', // Dark green text
        marginLeft: 16,
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    scrollContent: {
        paddingHorizontal: 16, // Match title margin
        paddingBottom: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // More rounded
        width: 130, // Slightly wider
        height: 150,
        marginRight: 12, // Spacing between cards
        padding: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // Subtle shadow
    },
    imageContainer: {
        width: '100%',
        height: 105,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    label: {
        fontSize: 13, // Slightly larger
        color: '#4B5563', // Gray 600
        textAlign: 'center',
        width: '100%',
        fontWeight: '500',
        marginTop: 4,
    },
});
