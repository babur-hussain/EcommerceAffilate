import React from 'react';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function LuxuryFashionSalePage() {
    const { layout, loading, error } = usePageLayout('luxury_fashion_sale');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F3F3F5] dark:bg-[#0F0F0F]">
                <ActivityIndicator size="large" color="#E60023" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F3F3F5] dark:bg-[#0F0F0F]">
                <Text className="text-red-500">Failed to load Luxury Fashion Sale</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F3F5' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 0 }}
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
