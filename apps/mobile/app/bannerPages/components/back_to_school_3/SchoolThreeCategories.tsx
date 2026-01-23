
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const SchoolThreeCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#FF8C42", // Bright Orange
        secondary: "#007ea7", // Teal
        cardLight: "#FFFFFF",
        cardDark: "#1E1E1E",
        textLight: "#333333",
        textDark: "#E5E5E5",
    };

    const categories = ["All", "Pencils", "Notebooks", "Backpacks", "Art"];
    const [selected, setSelected] = useState(categories[0]);

    return (
        <View style={styles.container}>
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
                                    borderColor: isDarkMode ? '#333' : '#F3F4F6',
                                    borderWidth: isSelected ? 0 : 1,
                                }
                            ]}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.text,
                                {
                                    color: isSelected
                                        ? 'white'
                                        : (isDarkMode ? colors.textDark : colors.textLight)
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
        marginBottom: 24, // mt-6 implies spacing
        paddingHorizontal: 16,
    },
    scrollContent: {
        gap: 12,
        paddingBottom: 4,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default SchoolThreeCategories;
