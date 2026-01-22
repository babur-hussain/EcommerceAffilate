import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

interface CategoryItem {
    name: string;
    image_url: string;
}

interface LuminousCategoriesProps {
    data: {
        section_title: string;
        link_text: string;
        items: CategoryItem[];
    };
}

export default function LuminousCategories({ data }: LuminousCategoriesProps) {
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{data.section_title}</Text>
                <TouchableOpacity>
                    <Text style={styles.link}>{data.link_text}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {data.items.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.item}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                        </View>
                        <Text style={styles.name}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#111827',
    },
    link: {
        fontSize: 14,
        fontWeight: '600',
        color: '#a03028', // primary
    },
    scrollContent: {
        gap: 16,
    },
    item: {
        alignItems: 'center',
        width: 80,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fdf2ee', // secondary-light
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
        resizeMode: 'cover',
    },
    name: {
        fontSize: 12,
        fontWeight: '500',
        color: '#4B5563', // gray-600
        textAlign: 'center',
    }
});
