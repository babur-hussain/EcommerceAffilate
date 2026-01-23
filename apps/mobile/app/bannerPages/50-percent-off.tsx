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
            {/* Navbar removed as it is now inside LumiereHeader component */}

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
