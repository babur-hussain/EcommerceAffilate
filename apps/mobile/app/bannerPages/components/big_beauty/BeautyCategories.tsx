import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface BeautyCategoriesProps {
    data: {
        tabs: string[];
    };
}

export default function BeautyCategories({ data }: BeautyCategoriesProps) {
    if (!data || !data.tabs) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {data.tabs.map((tab, index) => {
                    const isActive = index === 0;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.tab,
                                isActive ? styles.activeTab : styles.inactiveTab
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                isActive ? styles.activeText : styles.inactiveText
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3E2723',
        marginBottom: 12,
        paddingHorizontal: 8,
        fontFamily: 'Poppins_600SemiBold',
    },
    scrollContent: {
        gap: 12,
        paddingHorizontal: 8,
        paddingBottom: 8, // space for shadow
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
    },
    activeTab: {
        backgroundColor: '#3E2723', // Primary
    },
    inactiveTab: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Poppins_500Medium',
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#4B5563', // gray-600
    }
});
