import React from 'react';
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
                <ActivityIndicator size="large" color="#112D4E" />
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

            {/* Navbar */}
            <View className="flex-row justify-between items-center px-6 py-4 pt-12 bg-white/70 border-b border-white/20 z-50">
                <View className="p-2 rounded-full bg-transparent">
                    <MaterialIcons name="menu" size={24} color="#112D4E" />
                </View>
                <Text className="text-xl font-bold text-[#112D4E] font-[PlayfairDisplay_700Bold] tracking-widest">LUXE.</Text>
                <View className="p-2 rounded-full relative">
                    <MaterialIcons name="shopping-bag" size={24} color="#112D4E" />
                    <View className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
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
