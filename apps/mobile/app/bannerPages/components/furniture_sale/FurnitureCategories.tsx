import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface FurnitureCategoriesProps {
    data: {
        items: string[];
    };
}

export default function FurnitureCategories({ data }: FurnitureCategoriesProps) {
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <TouchableOpacity style={[styles.btn, styles.btnActive]}>
                    <Text style={[styles.text, styles.textActive]}>All Items</Text>
                </TouchableOpacity>

                {data.items.map((item, index) => (
                    <TouchableOpacity key={index} style={[styles.btn, styles.btnInactive]}>
                        <Text style={styles.textInactive}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },
    scroll: {
        paddingHorizontal: 24,
        gap: 16,
    },
    btn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 24,
    },
    btnActive: {
        backgroundColor: '#9F6B08', // primary
        shadowColor: '#9F6B08',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    btnInactive: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E7E5E4', // stone-200
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
    textActive: {
        color: 'white',
    },
    textInactive: {
        color: '#8D7B6F', // text-sub-light
    }
});
