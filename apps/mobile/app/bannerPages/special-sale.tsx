import React, { useEffect } from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { ScrollView, View, ActivityIndicator, Text, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function SpecialSalePage() {
    const { layout, loading, error } = usePageLayout('special_sale');

    // Bounce animation for FAB
    const translateY = useSharedValue(0);
    useEffect(() => {
        translateY.value = withRepeat(withTiming(-10, { duration: 800 }), -1, true);
    }, []);
    const fabAnimStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FAFAFA]">
                <GlobalLoader />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FAFAFA]">
                <Text className="text-red-500">Failed to load Special Sale Page</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {layout.sections
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                        <SectionRenderer key={section.id} section={section} />
                    ))}
            </ScrollView>

            {/* Floating Action Button */}
            <Animated.View style={[styles.fabContainer, fabAnimStyle]}>
                <TouchableOpacity style={styles.fab}>
                    <LinearGradient
                        colors={['#FFD700', '#FDE047']}
                        style={styles.fabGradient}
                    >
                        <MaterialIcons name="percent" size={24} color="#D32F2F" style={{ fontWeight: 'bold' }} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        bottom: 100, // Above bottom nav roughly
        right: 16,
        zIndex: 50,
    },
    fab: {
        width: 48,
        height: 48,
        borderRadius: 24,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    fabGradient: {
        flex: 1,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
