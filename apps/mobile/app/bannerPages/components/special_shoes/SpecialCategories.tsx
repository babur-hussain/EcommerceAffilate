
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const SpecialCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#C62828", // Deep Red
        bgLight: "#F3F4F6",
        bgDark: "#0a0a0a",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#171717",
    };

    const categories = [
        "All",
        "High-Tops",
        "Chunky",
        "Running",
        "Limited"
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

                    let bg = isDarkMode ? colors.surfaceDark : 'white';
                    let text = isDarkMode ? '#D1D5DB' : '#4B5563';
                    let border = isDarkMode ? '#374151' : '#E5E7EB';

                    if (isSelected) {
                        bg = colors.primary;
                        text = 'white';
                        border = colors.primary;
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
                                    shadowColor: isSelected ? colors.primary : 'transparent',
                                    shadowOpacity: isSelected ? 0.3 : 0,
                                    shadowRadius: 8,
                                    elevation: isSelected ? 4 : 0,
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
        marginTop: 24,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    scrollContent: {
        gap: 12,
        paddingBottom: 8,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        shadowOffset: { width: 0, height: 4 },
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default SpecialCategories;
