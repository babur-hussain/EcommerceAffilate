import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CategoryItem {
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    color_bg: string;
    color_icon: string;
    color_border: string;
}

interface SpecialCategoriesProps {
    data: {
        items: CategoryItem[];
    };
}

export default function SpecialCategories({ data }: SpecialCategoriesProps) {
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {data.items.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.item}>
                        <View style={[styles.iconCircle, { backgroundColor: item.color_bg, borderColor: item.color_border }]}>
                            <MaterialIcons name={item.icon} size={24} color={item.color_icon} />
                        </View>
                        <Text style={styles.label}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    scroll: {
        paddingHorizontal: 16,
        gap: 16,
    },
    item: {
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333333',
    }
});
