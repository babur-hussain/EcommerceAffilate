
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const BigPromoFilter = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#F59E0B", // Amber-500
        backgroundLight: "#E0F2FE", // Sky-100
        backgroundDark: "#0F172A", // Slate-900
        cardLight: "#FFFFFF",
        cardDark: "#1E293B",
        textLight: "#475569", // Slate-600
        textDark: "#CBD5E1", // Slate-300
    };

    const categories = data?.categories || ["All Items", "Kitchen", "Laundry", "Cooling"];
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
                                }
                            ]}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.pillText,
                                { color: isSelected ? 'white' : (isDarkMode ? colors.textDark : colors.textLight) }
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
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12, // rounded-xl
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default BigPromoFilter;
