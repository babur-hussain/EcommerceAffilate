import React from 'react';
import { ScrollView, View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function FurnitureBigSalePage() {
    const { layout, loading, error } = usePageLayout('furniture_big_sale');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FDFBF7]">
                <ActivityIndicator size="large" color="#9F6B08" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FDFBF7]">
                <Text className="text-red-500">Failed to load Furniture Sale Page</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FDFBF7' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

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
