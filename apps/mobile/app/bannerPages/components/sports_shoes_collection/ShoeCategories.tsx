
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const ShoeCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#BE3A3B",
        bgLight: "#F3F4F6",
        bgDark: "#111827",
    };

    const categories = [
        "All Shoes",
        "Running",
        "Training",
        "Outdoor",
        "Lifestyle"
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
                    // Styling logic based on HTML reference
                    // Selected: Dark bg (gray-900/white), text (white/gray-900)
                    // Unselected: White/Dark bg, Gray text, Border

                    let bg = isDarkMode ? 'rgba(31, 41, 55, 1)' : 'white';
                    let text = isDarkMode ? '#D1D5DB' : '#4B5563';
                    let border = isDarkMode ? '#374151' : '#E5E7EB';

                    if (isSelected) {
                        bg = isDarkMode ? 'white' : '#111827';
                        text = isDarkMode ? '#111827' : 'white';
                        border = isDarkMode ? 'white' : '#111827'; // Matches bg usually
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: bg,
                                    borderColor: border,
                                    borderWidth: 1,
                                    elevation: isSelected ? 4 : 1,
                                    shadowOpacity: isSelected ? 0.2 : 0.05,
                                }
                            ]}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.text,
                                { color: text }
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
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    scrollContent: {
        gap: 12,
        paddingBottom: 8,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
    },
    text: {
        fontWeight: '600',
        fontSize: 14,
    },
});

export default ShoeCategories;
