import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface CosmeticCategoriesProps {
    data: {
        tabs: string[];
    };
}

export default function CosmeticCategories({ data }: CosmeticCategoriesProps) {
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
        marginBottom: 24,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    activeTab: {
        backgroundColor: '#112D4E', // Primary
    },
    inactiveTab: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F1F5F9', // slate-100
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular', // font-medium equivalent roughly
        fontWeight: '600',
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#475569', // text-gray-600
    }
});
