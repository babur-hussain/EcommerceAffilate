
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const SchoolTwoCategories = ({ data }: { data: any }) => {
    // Theme colors
    const colors = {
        primary: "#FACC15",
        bgLight: "#155e48", // Chalkboard Green
    };

    const categories = [
        "All Items",
        "Notebooks 📓",
        "Pens & Pencils ✏️",
        "Textbooks 📚",
        "Art Supplies 🎨"
    ];

    const [selected, setSelected] = useState(categories[0]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Categories</Text>
                <TouchableOpacity>
                    <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
                </TouchableOpacity>
            </View>

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
                                isSelected ? styles.pillActive : styles.pillInactive
                            ]}
                            onPress={() => setSelected(cat)}
                        >
                            <Text style={[
                                styles.pillText,
                                isSelected ? styles.textActive : styles.textInactive
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
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 0.5,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    scrollContent: {
        gap: 12,
        paddingBottom: 8,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
    },
    pillActive: {
        backgroundColor: 'white', // or theme dependent
        borderWidth: 2,
        borderColor: 'white',
        transform: [{ scale: 1.05 }],
    },
    pillInactive: {
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
    },
    pillText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    textActive: {
        color: '#155e48', // chalkboard green
    },
    textInactive: {
        color: 'white',
    },
});

export default SchoolTwoCategories;
