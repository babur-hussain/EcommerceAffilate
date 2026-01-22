import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface LuxTabsProps {
    data: {
        tabs: string[];
    };
}

export default function LuxTabs({ data }: LuxTabsProps) {
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
        marginTop: -24, // Overlap header slightly
        paddingBottom: 8,
        zIndex: 20,
    },
    scrollContent: {
        paddingHorizontal: 24,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 999,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },
    activeTab: {
        backgroundColor: '#8B5E55', // Primary
    },
    inactiveTab: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    tabText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#6B7280',
    }
});
