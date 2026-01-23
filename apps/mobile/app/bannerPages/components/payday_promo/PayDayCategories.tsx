
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const PayDayCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#4FA960", // Vibrant Green
        bgLight: "#F3F4F6",
        bgDark: "#111827",
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textMainLight: "#1F2937",
        textMainDark: "#F3F4F6",
    };

    const categories = [
        "All Sports",
        "Tennis",
        "Badminton",
        "Running"
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
                                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
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
                                        : (isDarkMode ? '#D1D5DB' : '#4B5563')
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
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default PayDayCategories;
