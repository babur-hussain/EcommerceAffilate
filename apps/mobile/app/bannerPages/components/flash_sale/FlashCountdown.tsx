import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

interface FlashCountdownProps {
    data: {
        end_time: string;
    };
}

export default function FlashCountdown({ data }: FlashCountdownProps) {
    if (!data) return null;
    const [hours, minutes, seconds] = data.end_time.split(':');

    const opacity = useSharedValue(0.5);
    React.useEffect(() => {
        opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }, []);
    const pulseAnim = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.left}>
                    <Animated.View style={pulseAnim}>
                        <MaterialIcons name="timer" size={20} color="#D32F2F" />
                    </Animated.View>
                    <Text style={styles.label}>ENDING SOON</Text>
                </View>

                <View style={styles.timer}>
                    <View style={styles.box}><Text style={styles.timeText}>{hours}</Text></View>
                    <Text style={styles.colon}>:</Text>
                    <View style={styles.box}><Text style={styles.timeText}>{minutes}</Text></View>
                    <Text style={styles.colon}>:</Text>
                    <View style={styles.box}><Text style={[styles.timeText, { color: '#D32F2F' }]}>{seconds}</Text></View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#F3F4F6', // gray-100
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        borderLeftColor: '#D32F2F',
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        color: '#D32F2F', // red-600
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    timer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    box: {
        backgroundColor: 'white',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        minWidth: 28,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    timeText: {
        fontFamily: 'Anton_400Regular',
        fontSize: 16,
        color: '#1F2937', // gray-800
    },
    colon: {
        fontWeight: 'bold',
        color: '#1F2937',
    }
});
