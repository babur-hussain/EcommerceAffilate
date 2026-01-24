import React from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MenFashionCollectionPage() {
    const { layout, loading, error } = usePageLayout('men_fashion_collection');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F3F4F6] dark:bg-[#0f0f0f]">
                <GlobalLoader />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F3F4F6] dark:bg-[#0f0f0f]">
                <Text className="text-red-500">Failed to load Men's Collection</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
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
