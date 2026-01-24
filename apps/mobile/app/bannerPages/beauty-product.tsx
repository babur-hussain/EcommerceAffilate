import React from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { ScrollView, View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { MaterialIcons } from '@expo/vector-icons';

export default function BeautyProductPage() {
    const { layout, loading, error } = usePageLayout('beauty_product');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-[#1a1a1a]">
                <GlobalLoader />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-[#1a1a1a]">
                <Text className="text-red-500">Failed to load Beauty Product Page</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            {/* Navbar */}
            {/* Navbar removed as it is now inside LuminousHeader component */}

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
