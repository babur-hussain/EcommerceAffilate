import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface CyberCategoriesProps {
    data: {
        items: string[];
    };
}

export default function CyberCategories({ data }: CyberCategoriesProps) {
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <TouchableOpacity style={[styles.btn, styles.btnActive]}>
                    <Text style={[styles.text, styles.textActive]}>All Items</Text>
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
        backgroundColor: '#F8FAFC',
    },
    scroll: {
        paddingHorizontal: 16,
        gap: 12,
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'black',
        // Hard shadow effect
        shadowColor: '#0F172A',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    btnActive: {
        backgroundColor: 'black',
    },
    btnInactive: {
        backgroundColor: 'white',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Inter_700Bold',
    },
    textActive: {
        color: 'white',
    }
});
