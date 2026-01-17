import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

interface ProductTimerProps {
    targetDate?: string;
}

export default function ProductTimer({ targetDate }: ProductTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!targetDate) return;

        const calculateTimeLeft = () => {
            const difference = new Date(targetDate).getTime() - new Date().getTime();

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60))),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
                setIsExpired(false);
            } else {
                setIsExpired(true);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!targetDate || isExpired) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Sale ends in</Text>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText}>{String(timeLeft.hours).padStart(2, '0')}</Text>
            </View>
            <Text style={styles.separator}>Hrs :</Text>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
            </View>
            <Text style={styles.separator}>Min :</Text>
            <View style={styles.timeBlock}>
                <Text style={styles.timeText}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
            </View>
            <Text style={styles.separator}>Sec</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF', // Light blue bg
        paddingVertical: 12,
        marginHorizontal: 16,
        borderRadius: 8,
        marginTop: 0,
        marginBottom: 10,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
        marginRight: 8,
    },
    timeBlock: {
        backgroundColor: '#2563EB', // Blue
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
        minWidth: 28,
        alignItems: 'center',
    },
    timeText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
    separator: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
        marginHorizontal: 4,
    },
});
