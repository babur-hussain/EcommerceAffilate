import React from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { ScrollView, View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function LuxuriousNewCollectionPage() {
    const { layout, loading, error } = usePageLayout('luxurious_new_collection');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FDFBF9] dark:bg-[#1C1917]">
                <GlobalLoader />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FDFBF9] dark:bg-[#1C1917]">
                <Text className="text-red-500">Failed to load Luxurious Collection</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FDFBF9' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
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
