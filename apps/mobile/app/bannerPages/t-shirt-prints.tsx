import React from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TShirtPrintsPage() {
    const { layout, loading, error } = usePageLayout('t_shirt_prints');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FEFCE8] dark:bg-[#18181b]">
                <ActivityIndicator size="large" color="#0f5e36" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FEFCE8] dark:bg-[#18181b]">
                <Text className="text-red-500">Failed to load T-Shirt Prints Shop</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#FEFCE8] dark:bg-[#18181b]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                {layout.sections
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                        <SectionRenderer key={section.id} section={section} />
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
}
