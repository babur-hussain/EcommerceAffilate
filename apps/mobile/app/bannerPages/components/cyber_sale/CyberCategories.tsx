
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const CyberCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#D9242C",
        secondary: "#FFCB05",
        backgroundLight: "#F8FAFC",
        backgroundDark: "#0B0B0B",
        textLight: "#000000",
        textDark: "#FFFFFF",
    };

    const categories = data?.categories || ["All Items", "Bags", "Shoes", "Accessories"];
    const [selected, setSelected] = useState(categories[0]);

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? colors.backgroundDark : colors.backgroundLight }]}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((cat: string, index: number) => {
                    const isSelected = selected === cat;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: isSelected ? 'black' : 'white',
                                    borderColor: 'black',
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.pillText,
                                { color: isSelected ? 'white' : 'black' }
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 2,
        marginRight: 12,
        // Pop shadow simulation
        shadowColor: '#0F172A',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default CyberCategories;
