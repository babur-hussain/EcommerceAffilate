
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const GameDayCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "#D4FF3E", // Lime
        bgLight: "#F3F4F6",
        bgDark: "#111827",
        cardLight: "#FFFFFF",
        cardDark: "#1F2937",
        textGray: "#4B5563",
        textGrayDark: "#D1D5DB",
    };

    const categories = [
        { label: "New Season", icon: "bolt" },
        { label: "Boots", icon: "" },
        { label: "Kits", icon: "" },
        { label: "Gloves", icon: "" },
        { label: "Accessories", icon: "" }
    ];

    const [selected, setSelected] = useState("New Season");

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.title, { color: isDarkMode ? 'white' : '#111827' }]}>
                    New Arrivals
                </Text>
                <TouchableOpacity>
                    <Text style={[styles.seeAll, { color: isDarkMode ? '#22D3EE' : '#00B4D8' }]}>
                        See All
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((cat, index) => {
                    const isSelected = selected === cat.label;
                    const isNewSeason = cat.label === "New Season";

                    // Specific styling logic mimicking the HTML
                    let btnBg = isDarkMode ? colors.cardDark : colors.cardLight;
                    let btnText = isDarkMode ? colors.textGrayDark : colors.textGray;
                    let btnBorder = isDarkMode ? '#374151' : '#E5E7EB';

                    if (isNewSeason) {
                        btnBg = isDarkMode ? 'white' : '#111827';
                        btnText = isDarkMode ? '#111827' : 'white';
                        btnBorder = isDarkMode ? 'white' : '#111827';
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: btnBg,
                                    borderColor: btnBorder,
                                    borderWidth: 1,
                                }
                            ]}
                            onPress={() => setSelected(cat.label)}
                        >
                            {cat.icon ? <MaterialIcons name={cat.icon as any} size={16} color={btnText} style={{ marginRight: 4 }} /> : null}
                            <Text style={[styles.text, { color: btnText }]}>
                                {cat.label}
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
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    scrollContent: {
        gap: 12,
        paddingBottom: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default GameDayCategories;
