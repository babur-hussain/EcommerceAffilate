import React from 'react';
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
                <ActivityIndicator size="large" color="#a03028" />
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
            <View className="flex-row justify-between items-center px-4 py-3 pt-12 bg-white/90 border-b border-gray-100 z-50">
                <View className="p-2 -ml-2">
                    <MaterialIcons name="menu" size={24} color="#1F2937" />
                </View>
                <Text className="text-xl font-bold text-[#a03028] font-[PlayfairDisplay_700Bold] tracking-wide">LUMINOUS</Text>
                <View className="flex-row gap-2">
                    <MaterialIcons name="search" size={24} color="#1F2937" />
                    <View className="p-2 -mr-2 relative">
                        <MaterialIcons name="shopping-bag" size={24} color="#1F2937" />
                        <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#a03028] rounded-full border-2 border-white" />
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
