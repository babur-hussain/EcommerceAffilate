import React from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { ScrollView, View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { MaterialIcons } from '@expo/vector-icons';

export default function CosmeticSalePage() {
    const { layout, loading, error } = usePageLayout('cosmetic_sale');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F0F9FB] dark:bg-[#0F172A]">
                <GlobalLoader />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F0F9FB] dark:bg-[#0F172A]">
                <Text className="text-red-500">Failed to load Cosmetic Sale Page</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F0F9FB' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            {/* Navbar removed as it is now inside CosmeticHeader */}

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
