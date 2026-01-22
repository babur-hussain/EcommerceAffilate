import React from 'react';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function GirlsFashionSalePage() {
    const { layout, loading, error } = usePageLayout('girls_fashion_sale');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FDFBF7] dark:bg-[#1a1a1a]">
                <ActivityIndicator size="large" color="#8B0000" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FDFBF7] dark:bg-[#1a1a1a]">
                <Text className="text-red-500">Failed to load Girls Fashion Sale</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FDFBF7' }}>
            <Stack.Screen options={{ headerShown: false }} />
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
