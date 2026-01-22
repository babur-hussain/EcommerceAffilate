import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

interface SpecialFlashSaleProps {
    data: {
        title: string;
        end_time: string; // Format like 02:14:45
    };
}

export default function SpecialFlashSale({ data }: SpecialFlashSaleProps) {
    if (!data) return null;

    // Parse time if needed, but for now assuming static or passed formatted
    const [hours, minutes, seconds] = data.end_time.split(':');

    const opacity = useSharedValue(0.5);
    React.useEffect(() => {
        opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }, []);
    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Animated.View style={animStyle}>
                        <MaterialIcons name="bolt" size={24} color="#D32F2F" />
                    </Animated.View>
                    <Text style={styles.title}>{data.title}</Text>
                </View>

                <View style={styles.timer}>
                    <View style={styles.timeBox}><Text style={styles.timeText}>{hours}</Text></View>
                    <Text style={styles.colon}>:</Text>
                    <View style={styles.timeBox}><Text style={styles.timeText}>{minutes}</Text></View>
                    <Text style={styles.colon}>:</Text>
                    <View style={[styles.timeBox, styles.timeBoxActive]}><Text style={styles.timeText}>{seconds}</Text></View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 24,
        marginTop: -24, // overlap header slightly
        zIndex: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.3)', // gold/30
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#333333',
    },
    timer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeBox: {
        backgroundColor: '#1F2937', // gray-800
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    timeBoxActive: {
        backgroundColor: '#D32F2F', // primary
    },
    timeText: {
        color: 'white',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: 14,
    },
    colon: {
        color: '#1F2937',
        fontWeight: 'bold',
    }
});
