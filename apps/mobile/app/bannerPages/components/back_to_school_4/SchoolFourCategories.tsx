
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SchoolFourCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#1565C0", // Deep Blue
        secondary: "#FF8F00", // Orange
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textMainLight: "#1F2937",
        textMainDark: "#F3F4F6",
        textGray: "#4B5563",
        textGrayDark: "#D1D5DB",
    };

    const categories = [
        "All Items",
        "Girls Uniforms",
        "Boys Uniforms",
        "Sportswear",
        "Accessories"
    ];

    const [selected, setSelected] = useState(categories[0]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <MaterialIcons name="category" size={20} color={colors.secondary} />
                <Text style={[styles.title, { color: isDarkMode ? 'white' : colors.textMainLight }]}>
                    Categories
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((cat, index) => {
                    const isSelected = selected === cat;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: isSelected
                                        ? colors.primary
                                        : (isDarkMode ? colors.cardDark : colors.cardLight),
                                    borderColor: isDarkMode ? '#374151' : '#F3F4F6',
                                    borderWidth: isSelected ? 0 : 1,
                                    shadowColor: isSelected ? '#3B82F6' : '#000',
                                    shadowOpacity: isSelected ? 0.3 : 0.05,
                                }
                            ]}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.text,
                                {
                                    color: isSelected
                                        ? 'white'
                                        : (isDarkMode ? colors.textGrayDark : colors.textGray)
                                }
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
        marginTop: 24,
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        gap: 12,
        paddingBottom: 8,
    },
    pill: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default SchoolFourCategories;
