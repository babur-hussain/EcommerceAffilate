import React from 'react';
import { ScrollView, View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function FlashSalePage() {
    const { layout, loading, error } = usePageLayout('flash_sale');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FAFAFA]">
                <ActivityIndicator size="large" color="#D32F2F" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FAFAFA]">
                <Text className="text-red-500">Failed to load Flash Sale Page</Text>
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
                bounces={false}
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
