import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface PromoCategoriesProps {
    data: {
        tabs: string[];
    };
}

export default function PromoCategories({ data }: PromoCategoriesProps) {
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
        gap: 8,
        paddingBottom: 8, // space for shadow
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16, // rounded-xl
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
    },
    activeTab: {
        backgroundColor: '#F59E0B', // Primary
    },
    inactiveTab: {
        backgroundColor: 'white',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
    },
    activeText: {
        color: 'white',
    },
    inactiveText: {
        color: '#475569', // slate-600
    }
});
