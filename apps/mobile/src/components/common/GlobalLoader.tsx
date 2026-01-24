import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

interface GlobalLoaderProps {
    size?: number; // Scale factor, default 1
    color?: string; // Ignored in favor of custom colors, but kept for compatibility
}

const ICONS = [
    { name: 'chair-rolling', lib: MaterialCommunityIcons, color: '#60A5FA' }, // Light Blue
    { name: 'bottle-tonic', lib: MaterialCommunityIcons, color: '#60A5FA' },
    { name: 'tshirt-crew', lib: MaterialCommunityIcons, color: '#60A5FA' },
    { name: 'cellphone', lib: MaterialCommunityIcons, color: '#F472B6' }, // Light Pink (center-ish)
    { name: 'lipstick', lib: MaterialCommunityIcons, color: '#F472B6' },
    { name: 'washing-machine', lib: MaterialCommunityIcons, color: '#60A5FA' },
    { name: 'bottle-tonic-plus', lib: MaterialCommunityIcons, color: '#60A5FA' },
];

const GlobalLoader = ({ size = 1 }: GlobalLoaderProps) => {
    // Create animated values for each icon
    const animations = useRef(ICONS.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const createAnimation = (index: number) => {
            return Animated.sequence([
                Animated.timing(animations[index], {
                    toValue: 1, // Move up
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.ease,
                }),
                Animated.timing(animations[index], {
                    toValue: 0, // Move down
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.ease,
                }),
            ]);
        };

        // Staggered loop
        const sequence = ICONS.map((_, i) => createAnimation(i));

        // We want a wave effect: 0 starts, then 1, then 2...
        // Animated.stagger(100, sequence) runs them once. We need to loop.
        // Actually, distinct loops with delays are easier for infinite wave.

        // Let's try a continuous wave logic
        const runWave = () => {
            const parallelAnimations = ICONS.map((_, i) => {
                return Animated.sequence([
                    Animated.delay(i * 100), // Stagger delay
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(animations[i], {
                                toValue: 1,
                                duration: 400,
                                useNativeDriver: true,
                                easing: Easing.inOut(Easing.ease)
                            }),
                            Animated.timing(animations[i], {
                                toValue: 0,
                                duration: 400,
                                useNativeDriver: true,
                                easing: Easing.inOut(Easing.ease)
                            }),
                            Animated.delay(1000) // Pause before next bounce
                        ])
                    )
                ]);
            });

            // This approach with loop inside map might be tricky to synchronize perfectly. 
            // Simpler approach: Recursive stagger.
        };

        // Simpler sequence:
        const loop = Animated.loop(
            Animated.stagger(100,
                ICONS.map((_, i) =>
                    Animated.sequence([
                        Animated.timing(animations[i], {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animations[i], {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ])
                )
            )
        );
        // STAGGER doesn't loop correctly as a block usually.

        // Robust independent loops:
        ICONS.forEach((_, i) => {
            const delay = i * 150;
            setTimeout(() => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(animations[i], {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animations[i], {
                            toValue: 0,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.delay(1500) // Wait for other icons
                    ])
                ).start();
            }, delay);
        });

    }, []);

    return (
        <View style={[styles.container, { transform: [{ scale: size }] }]}>
            {ICONS.map((icon, index) => {
                const IconLib = icon.lib;
                const translateY = animations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10]
                });
                const opacity = animations[index].interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1, 1] // Fade in slightly as it jumps
                });

                return (
                    <Animated.View key={index} style={{ transform: [{ translateY }], opacity, marginHorizontal: 4 }}>
                        <IconLib name={icon.name as any} size={24} color={icon.color} />
                    </Animated.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        height: 60, // Ensure bounded height
    },
});

export default GlobalLoader;
