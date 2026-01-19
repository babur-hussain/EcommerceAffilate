import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CategoryPulseLoaderProps {
    color?: string;
}

const AnimatedIcon = ({ index, children }: { index: number; children: React.ReactNode }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.3);
    const translateY = useSharedValue(0);

    useEffect(() => {
        const delay = index * 150;

        // Pulse effect
        scale.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(1.2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        ));

        // Opacity effect
        opacity.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(1, { duration: 500 }),
                withTiming(0.3, { duration: 500 })
            ),
            -1,
            true
        ));

        // Bounce effect
        translateY.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(-5, { duration: 500 }),
                withTiming(0, { duration: 500 })
            ),
            -1,
            true
        ));

    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { translateY: translateY.value }
            ],
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
            {children}
        </Animated.View>
    );
};

const CategoryPulseLoader: React.FC<CategoryPulseLoaderProps> = () => {
    // Icons matching the user's image as closely as possible
    // Chair, Bottle, Shirt, Phone, Lipstick, Washer, Jug

    // Using a soft blue-ish palette to mimic the 3D look
    const iconColor = "#60A5FA"; // light blue
    const accentColor = "#FCD34D"; // yellow accent for some

    return (
        <View style={styles.container}>
            {/* Chair */}
            <AnimatedIcon index={0}>
                <MaterialCommunityIcons name="chair-rolling" size={24} color={iconColor} />
            </AnimatedIcon>

            {/* Lotion/Bottle */}
            <AnimatedIcon index={1}>
                <FontAwesome5 name="pump-soap" size={22} color={iconColor} />
            </AnimatedIcon>

            {/* Shirt */}
            <AnimatedIcon index={2}>
                <Ionicons name="shirt" size={24} color="#3B82F6" />
            </AnimatedIcon>

            {/* Phone */}
            <AnimatedIcon index={3}>
                <Ionicons name="phone-portrait-outline" size={24} color={iconColor} />
            </AnimatedIcon>

            {/* Lipstick */}
            <AnimatedIcon index={4}>
                <MaterialCommunityIcons name="lipstick" size={24} color="#F472B6" />
            </AnimatedIcon>

            {/* Washing Machine */}
            <AnimatedIcon index={5}>
                <MaterialCommunityIcons name="washing-machine" size={24} color={iconColor} />
            </AnimatedIcon>

            {/* Jug/Cleaner */}
            <AnimatedIcon index={6}>
                <MaterialCommunityIcons name="bottle-tonic-plus" size={26} color={iconColor} />
            </AnimatedIcon>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        gap: 12,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CategoryPulseLoader;
