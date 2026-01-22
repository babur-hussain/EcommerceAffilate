import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface LuxeTabsProps {
    data: {
        tabs: string[];
    };
}

export default function LuxeTabs({ data }: LuxeTabsProps) {
    if (!data || !data.tabs) return null;

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {data.tabs.map((tab, index) => {
                    const isActive = index === 0; // First one 'All' is active
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
        paddingVertical: 24,
        paddingLeft: 24,
        backgroundColor: '#F3F3F5',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    scrollContent: {
        flexDirection: 'row',
        paddingRight: 24,
        gap: 16,
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderWidth: 1,
    },
    activeTab: {
        backgroundColor: 'black',
        borderColor: 'black',
    },
    inactiveTab: {
        backgroundColor: 'transparent',
        borderColor: '#D1D5DB', // gray-300
    },
    tabText: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#6B7280', // gray-500
    }
});
