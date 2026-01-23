
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BackToSchoolCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        accentBlue: "#6B9EE6",
        accentRed: "#E66B6B",
        accentYellow: "#F4D35E",
        accentGreen: "#4ADE80", // green-400
        accentPurple: "#C084FC", // purple-400
        textGray: "#4B5563", // gray-600
        textGrayDark: "#D1D5DB", // gray-300
    };

    const categories = [
        { label: "Bags", icon: "backpack", color: colors.accentBlue, bg: "rgba(107, 158, 230, 0.2)" },
        { label: "Books", icon: "menu-book", color: colors.accentRed, bg: "rgba(230, 107, 107, 0.2)" },
        { label: "Uniforms", icon: "checkroom", color: colors.accentYellow, bg: "rgba(244, 211, 94, 0.2)" },
        { label: "Art", icon: "palette", color: colors.accentGreen, bg: "rgba(74, 222, 128, 0.2)" },
        { label: "Lunch", icon: "lunch-dining", color: colors.accentPurple, bg: "rgba(192, 132, 252, 0.2)" },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.title, { color: isDarkMode ? 'white' : '#1F2937' }]}>Essentials</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.catItem}>
                        <View style={[styles.iconCircle, { backgroundColor: cat.bg }]}>
                            <MaterialIcons name={cat.icon as any} size={28} color={cat.color} />
                        </View>
                        <Text style={[styles.label, { color: isDarkMode ? colors.textGrayDark : colors.textGray }]}>
                            {cat.label}
                        </Text>
                    </TouchableOpacity>
                ))}
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F4B060', // Primary orange
    },
    scrollContent: {
        gap: 16,
        paddingBottom: 8,
    },
    catItem: {
        alignItems: 'center',
        gap: 8,
        minWidth: 70,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default BackToSchoolCategories;
