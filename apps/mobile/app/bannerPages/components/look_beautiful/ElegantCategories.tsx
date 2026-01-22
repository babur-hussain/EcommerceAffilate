import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface ElegantCategoriesProps {
    data: {
        tabs: string[];
    };
}

export default function ElegantCategories({ data }: ElegantCategoriesProps) {
    if (!data || !data.tabs) return null;

    return (
        <View style={styles.container}>
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
        marginTop: -32, // Overlap header
        paddingBottom: 24,
        zIndex: 20,
    },
    scrollContent: {
        paddingHorizontal: 24,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 999,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    activeTab: {
        backgroundColor: '#111111', // Secondary/Black
    },
    inactiveTab: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#4B5563',
    }
});
