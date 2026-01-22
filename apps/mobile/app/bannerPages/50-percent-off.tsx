import React from 'react';
import { ScrollView, View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { MaterialIcons } from '@expo/vector-icons';

export default function FiftyPercentOffPage() {
    const { layout, loading, error } = usePageLayout('50_percent_off');

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FAFAFA] dark:bg-[#121212]">
                <ActivityIndicator size="large" color="#6D28D9" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FAFAFA] dark:bg-[#121212]">
                <Text className="text-red-500">Failed to load 50% Off Page</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            {/* Navbar */}
            <View className="flex-row justify-between items-center px-6 py-4 pt-12 bg-[#FAFAFA]/90 border-b border-gray-100 z-50">
                <MaterialIcons name="menu" size={24} color="#1F2937" />
                <Text className="text-2xl font-bold text-[#6D28D9] font-[PlayfairDisplay_700Bold]">LUMIÈRE</Text>
                <View className="flex-row gap-3">
                    <MaterialIcons name="search" size={24} color="#1F2937" />
                    <View>
                        <MaterialIcons name="shopping-bag" size={24} color="#1F2937" />
                        <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </View>
                </View>
            </View>

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
