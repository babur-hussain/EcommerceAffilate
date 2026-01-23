
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const ModernCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#ECC646", // Yellow
        secondary: "#111111", // Black
        bgLight: "#F5F5F5",
        bgDark: "#121212",
        cardDark: "#1E1E1E",
        textGray: "#4B5563",
        textLight: "#E5E7EB",
    };

    const categories = data?.categories || ["All Items", "Chairs", "Lighting", "Tables"];
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
                                        ? colors.secondary
                                        : (isDarkMode ? colors.cardDark : 'white'),
                                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                                    borderWidth: isSelected ? 0 : 1,
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.pillText,
                                {
                                    color: isSelected
                                        ? 'white'
                                        : (isDarkMode ? colors.textLight : colors.textGray)
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
        marginBottom: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        marginRight: 0,
    },
    pillText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ModernCategories;
