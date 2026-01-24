import React from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

import { StatusBar } from 'expo-status-bar';

export default function BigBeautySalePage() {
    const { layout, loading, error } = usePageLayout('big_beauty_sale');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FFF0E5] dark:bg-[#1C1917]">
                <GlobalLoader />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FFF0E5] dark:bg-[#1C1917]">
                <Text className="text-red-500">Failed to load Big Beauty Sale</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF0E5' }}>
            <StatusBar style="dark" />
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
