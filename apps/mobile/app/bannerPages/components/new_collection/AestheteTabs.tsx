import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface AestheteTabsProps {
    data: {
        tabs: string[];
    };
}

export default function AestheteTabs({ data }: AestheteTabsProps) {
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
        paddingVertical: 16,
        paddingLeft: 16,
        backgroundColor: '#F3F4F6', // background-light
    },
    scrollContent: {
        gap: 24,
        paddingRight: 16,
    },
    tab: {
        paddingBottom: 4,
        borderBottomWidth: 2,
    },
    activeTab: {
        borderBottomColor: '#1A1A1A', // Primary
    },
    inactiveTab: {
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Jost_500Medium',
    },
    activeText: {
        color: '#1F2937', // text-main
    },
    inactiveText: {
        color: '#6B7280', // text-sub
    }
});
