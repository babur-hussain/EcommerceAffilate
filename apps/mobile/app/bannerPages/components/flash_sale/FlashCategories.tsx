import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface FlashCategoriesProps {
    data: {
        items: string[];
    };
}

export default function FlashCategories({ data }: FlashCategoriesProps) {
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <TouchableOpacity style={[styles.btn, styles.btnActive]}>
                    <Text style={[styles.text, styles.textActive]}>All Watches</Text>
                </TouchableOpacity>

                {data.items.map((item, index) => (
                    <TouchableOpacity key={index} style={[styles.btn, styles.btnInactive]}>
                        <Text style={styles.text}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        marginTop: -24,
        zIndex: 50,
        backgroundColor: 'transparent',
    },
    scroll: {
        paddingHorizontal: 16,
        gap: 12,
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 24,
        shadowColor: '#7F1D1D', // red-900
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    btnActive: {
        backgroundColor: '#D32F2F', // primary
    },
    btnInactive: {
        backgroundColor: 'white', // or dark bg based on theme
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Lato_700Bold',
    },
    textActive: {
        color: 'white',
    }
});
