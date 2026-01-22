import React from 'react';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function LookBeautifulPage() {
    const { layout, loading, error } = usePageLayout('look_beautiful');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FFF5F7] dark:bg-[#18181b]">
                <ActivityIndicator size="large" color="#F26985" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FFF5F7] dark:bg-[#18181b]">
                <Text className="text-red-500">Failed to load Look Beautiful</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF5F7' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
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
