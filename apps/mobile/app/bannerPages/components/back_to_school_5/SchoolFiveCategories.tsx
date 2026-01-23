
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const SchoolFiveCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#DC2626", // Bright Red
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textGray: "#4B5563",
        textGrayDark: "#D1D5DB",
    };

    const categories = [
        "🔥 All Items",
        "🖊️ Pens & Pencils",
        "📓 Notebooks",
        "🎒 Bags",
        "🎨 Art"
    ];

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
                                    shadowColor: isSelected ? '#DC2626' : '#000',
                                    shadowOpacity: isSelected ? 0.3 : 0.05,
                                    shadowOffset: isSelected ? { width: 0, height: 0 } : { width: 0, height: 4 },
                                    shadowRadius: isSelected ? 10 : 8,
                                    elevation: isSelected ? 8 : 2,
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
        marginBottom: 24, // Matches reference padding/margins loosely
        paddingHorizontal: 20,
    },
    scrollContent: {
        gap: 16,
        paddingBottom: 8,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default SchoolFiveCategories;
