
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const NewFurnitureFilter = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#593E2E", // Dark Brown
        secondary: "#CBB6A4", // Tan
        bgLight: "#F7F4F0",
        bgDark: "#1C1917",
        surfaceDark: "#292524",
        textDark: "#E7E5E4",
    };

    const categories = data?.categories || ["All", "Chairs", "Ceramics", "Textiles", "Lighting"];
    const [selected, setSelected] = useState(categories[0]);

    return (
        <View style={styles.container}>
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
                                    backgroundColor: isSelected
                                        ? (isDarkMode ? 'white' : colors.primary)
                                        : (isDarkMode ? colors.surfaceDark : 'white'),
                                    borderColor: isSelected
                                        ? 'transparent'
                                        : 'rgba(203, 182, 164, 0.3)', // secondary/30
                                    borderWidth: isSelected ? 0 : 1,
                                    shadowOpacity: isSelected ? (isDarkMode ? 0 : 0.1) : 0, // shadow-md check
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.pillText,
                                {
                                    color: isSelected
                                        ? (isDarkMode ? colors.primary : 'white')
                                        : (isDarkMode ? colors.textDark : colors.primary)
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
        marginBottom: 32,
    },
    scrollContent: {
        paddingHorizontal: 24,
        gap: 16,
    },
    pill: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 999,
        marginRight: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 2,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default NewFurnitureFilter;
