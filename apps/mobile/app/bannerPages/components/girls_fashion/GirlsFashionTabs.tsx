import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface GirlsFashionTabsProps {
    data: {
        tabs: string[];
    };
}

export default function GirlsFashionTabs({ data }: GirlsFashionTabsProps) {
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
        paddingLeft: 12,
    },
    scrollContent: {
        gap: 12,
        paddingRight: 16,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
    },
    activeTab: {
        backgroundColor: '#8B0000', // Primary
        borderColor: '#8B0000',
    },
    inactiveTab: {
        backgroundColor: '#FAF9F6', // card-light
        borderColor: '#E5E7EB',
    },
    tabText: {
        fontSize: 12, // text-xs
        fontFamily: 'Lato_400Regular',
        letterSpacing: 0.5, // tracking-wide
        textTransform: 'uppercase',
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#4B5563', // text-gray-600
    }
});
