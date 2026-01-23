
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const ModernCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors (LUSSO)
    const colors = {
        primary: "#9F6B08",
        bgLight: "#FDFBF7",
        bgDark: "#1C1917",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#292524",
        textSubLight: "#8D7B6F",
        textSubDark: "#A8A29E",
    };

    const categories = [
        "All Items",
        "Armchairs",
        "Lighting",
        "Tables"
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

                    let bg = isDarkMode ? colors.surfaceDark : colors.surfaceLight;
                    let text = isDarkMode ? colors.textSubDark : colors.textSubLight;
                    let border = isDarkMode ? '#44403C' : '#E7E5E4'; // stone-700 / 200

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
        marginBottom: 32, // larger gap
        paddingHorizontal: 24,
    },
    scrollContent: {
        gap: 16, // gap-4
        paddingBottom: 8,
    },
    pill: {
        paddingHorizontal: 24, // px-6
        paddingVertical: 10, // py-2.5
        borderRadius: 999,
        shadowOffset: { width: 0, height: 4 },
    },
    text: {
        fontWeight: '500', // font-medium
        fontSize: 14,
    },
});

export default ModernCategories;
