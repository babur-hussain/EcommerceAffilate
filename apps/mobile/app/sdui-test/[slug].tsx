import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import api from '../../src/lib/api';
import AdvancedRenderer from '../../src/components/sdui/AdvancedRenderer';
import { StatusBar } from 'expo-status-bar';

export default function SDUITestPage() {
    const { slug } = useLocalSearchParams();
    const [layout, setLayout] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (slug) {
            fetchLayout();
        }
    }, [slug]);

    const fetchLayout = async () => {
        try {
            // In a real app, you might want to pass the userId here
            const res = await api.get(`/advanced-layout/${slug}`);
            setLayout(res.data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to load layout');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#a03028" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-4">
                <Text className="text-red-500 text-center text-lg mb-2">Error Loading Layout</Text>
                <Text className="text-gray-500 text-center">{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ title: layout.name || 'SDUI Test' }} />
            <StatusBar style="dark" />

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {layout.components.map((component: any, index: number) => (
                    <AdvancedRenderer key={component.id || index} component={component} />
                ))}
            </ScrollView>
        </View>
    );
}
