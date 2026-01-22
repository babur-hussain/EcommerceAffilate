import React from 'react';
import { ScrollView, View, ActivityIndicator, Text, StatusBar, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BigPromoElectronicsPage() {
    const { layout, loading, error } = usePageLayout('big_promo_electronics');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#E0F2FE]">
                <ActivityIndicator size="large" color="#F59E0B" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#E0F2FE]">
                <Text className="text-red-500">Failed to load Big Promo Electronics Page</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#E0F2FE' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" backgroundColor="#E0F2FE" />

            {/* Background Gradients/Blobs */}
            <View style={styles.bgBlobLeft} />
            <View style={styles.bgBlobRight} />

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
        </View>
    );
}

const styles = StyleSheet.create({
    bgBlobLeft: {
        position: 'absolute',
        top: -80,
        left: -80,
        width: 384, // 96 * 4
        height: 384,
        borderRadius: 192,
        backgroundColor: 'rgba(191, 219, 254, 0.5)', // blue-200/50
        zIndex: 0,
    },
    bgBlobRight: {
        position: 'absolute',
        top: 160,
        right: -80,
        width: 288, // 72 * 4
        height: 288,
        borderRadius: 144,
        backgroundColor: 'rgba(254, 215, 170, 0.5)', // orange-200/50
        zIndex: 0,
    }
});
