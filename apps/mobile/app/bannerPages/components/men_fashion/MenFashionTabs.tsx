import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface MenFashionTabsProps {
    data: {
        tabs: string[];
    };
}

export default function MenFashionTabs({ data }: MenFashionTabsProps) {
    if (!data || !data.tabs) return null;

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {data.tabs.map((tab, index) => {
                    const isActive = index === 0; // First is active for visual demo
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
        backgroundColor: 'rgba(243, 244, 246, 0.95)', // bg-background-light/95
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // border-gray-200
        paddingVertical: 12,
        zIndex: 30, // sticky-ish
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999, // rounded-full
    },
    activeTab: {
        backgroundColor: 'black',
    },
    inactiveTab: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tabText: {
        fontSize: 12, // text-xs
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontFamily: 'Inter_700Bold',
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#1F2937', // text-gray-800
    }
});
