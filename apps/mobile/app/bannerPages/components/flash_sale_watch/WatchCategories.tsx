
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const WatchCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#D32F2F", // Red
        bgLight: "#FAFAFA",
        bgDark: "#050505",
        cardDark: "#121212",
        textGray: "#374151", // gray-700
        textGrayLight: "#D1D5DB", // gray-300
    };

    const categories = data?.categories || ["All Watches", "Chronograph", "Automatic", "Gold"];
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
                                        : (isDarkMode ? colors.cardDark : 'white'),
                                    borderColor: isSelected
                                        ? colors.primary
                                        : (isDarkMode ? '#374151' : '#E5E7EB'), // gray-700 : gray-200
                                    shadowColor: isSelected ? '#7F1D1D' : '#000', // red-900 : black
                                    shadowOpacity: isSelected ? 0.3 : 0.05,
                                },
                                isSelected && styles.shadowActive
                            ]}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.pillText,
                                {
                                    color: isSelected
                                        ? 'white'
                                        : (isDarkMode ? colors.textGrayLight : colors.textGray)
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
        marginTop: 0,
        marginBottom: 24,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 8, // slight padding for shadow clipping
        gap: 12,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        marginRight: 0,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 2,
    },
    shadowActive: {
        elevation: 6,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '700', // bold
    },
});

export default WatchCategories;
