import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MegaFlashSaleProps {
    data: {
        tabs: string[];
    };
}

export default function MegaFlashSale({ data }: MegaFlashSaleProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <MaterialIcons name="local-fire-department" size={24} color="#EF4444" />
                    <Text style={styles.title}>Flash Sale</Text>
                </View>
                <View style={styles.timerRow}>
                    <Text style={styles.endingText}>Ending in</Text>
                    <View style={styles.timeBox}><Text style={styles.timeText}>04</Text></View>
                    <Text>:</Text>
                    <View style={styles.timeBox}><Text style={styles.timeText}>12</Text></View>
                    <Text>:</Text>
                    <View style={styles.timeBox}><Text style={styles.timeText}>55</Text></View>
                </View>
            </View>

            {data?.tabs && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {data.tabs.map((tab, index) => {
                        const isActive = index === 0;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.tab, isActive ? styles.activeTab : styles.inactiveTab]}
                            >
                                <Text style={[styles.tabText, isActive && { color: 'white' }]}>{tab}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 48,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827', // dark
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    endingText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    timeBox: {
        backgroundColor: '#1F2937', // gray-800
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tabsScroll: {
        gap: 12,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeTab: {
        backgroundColor: '#DC2626', // red
        borderColor: '#DC2626',
        shadowColor: 'red',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    inactiveTab: {
        backgroundColor: 'white',
        borderColor: '#E5E7EB',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    }
});
