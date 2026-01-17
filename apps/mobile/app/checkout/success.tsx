import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withDelay,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen() {
    const router = useRouter();

    // Animation Values
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        // 1. Circle pops in
        scale.value = withSpring(1, { damping: 10, stiffness: 100 });

        // 2. Icon fades in
        opacity.value = withDelay(300, withTiming(1, { duration: 500 }));

        // 3. Text slides up
        textOpacity.value = withDelay(800, withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }));

        // 4. Redirect after 3.5 seconds
        const timer = setTimeout(() => {
            // Replace removes the success screen from history so user can't go back
            router.replace('/orders'); // Assuming /orders exists or will exist
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    const circleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const iconStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: withTiming(textOpacity.value === 1 ? 0 : 20) }]
    }));

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.content}>
                <Animated.View style={[styles.circle, circleStyle]}>
                    <Animated.View style={iconStyle}>
                        <Ionicons name="checkmark" size={60} color="white" />
                    </Animated.View>
                </Animated.View>

                <Animated.View style={[styles.textContainer, textStyle]}>
                    <Text style={styles.title}>Order Placed!</Text>
                    <Text style={styles.subtitle}>
                        Your order has been successfully placed. We are redirecting you to your orders...
                    </Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#10B981', // Emerald Green
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#10B981',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
});
