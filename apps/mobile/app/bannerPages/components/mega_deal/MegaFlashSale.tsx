import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MegaFlashSaleProps {
    data: {
        tabs?: string[];
        targetDate?: string; // ISO string 
    };
}

export default function MegaFlashSale({ data }: MegaFlashSaleProps) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Default to 24 hours from now if no targetDate is provided
        const target = data?.targetDate ? new Date(data.targetDate).getTime() : new Date().getTime() + 24 * 60 * 60 * 1000;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                const hours = Math.floor((difference / (1000 * 60 * 60)));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [data?.targetDate]);

    const formatTime = (time: number) => time < 10 ? `0${time}` : time;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <MaterialIcons name="local-fire-department" size={24} color="#EF4444" />
                    <Text style={styles.title}>Flash Sale</Text>
                </View>
                <View style={styles.timerRow}>
                    <Text style={styles.endingText}>Ending in</Text>
                    <View style={styles.timeBox}><Text style={styles.timeText}>{formatTime(timeLeft.hours)}</Text></View>
                    <Text>:</Text>
                    <View style={styles.timeBox}><Text style={styles.timeText}>{formatTime(timeLeft.minutes)}</Text></View>
                    <Text>:</Text>
                    <View style={styles.timeBox}><Text style={styles.timeText}>{formatTime(timeLeft.seconds)}</Text></View>
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
