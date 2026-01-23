
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const SaleFeedFilter = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#52665F", // Deep Green
        secondary: "#8DA866", // Light Green
        bgLight: "#F2F4F3",
        bgDark: "#121816",
        cardLight: "#FFFFFF",
        cardDark: "#1E2623",
        textSubLight: "#6B7280",
        textSubDark: "#9CA3AF",
    };

    const categories = data?.categories || ["All Items", "Sofas", "Armchairs", "Tables", "Lighting"];
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
                                        ? colors.primary
                                        : (isDarkMode ? colors.cardDark : colors.cardLight),
                                    borderWidth: isSelected ? 0 : 1,
                                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
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
                                        : (isDarkMode ? colors.textSubDark : colors.textSubLight)
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
        paddingLeft: 24,
    },
    scrollContent: {
        paddingRight: 24,
        gap: 12,
    },
    pill: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 999,
        marginRight: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default SaleFeedFilter;
