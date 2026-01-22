import React from 'react';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function NewCollectionShopPage() {
    const { layout, loading, error } = usePageLayout('new_collection_shop');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F3F4F6] dark:bg-[#121212]">
                <ActivityIndicator size="large" color="#1A1A1A" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F3F4F6] dark:bg-[#121212]">
                <Text className="text-red-500">Failed to load New Collection</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
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
