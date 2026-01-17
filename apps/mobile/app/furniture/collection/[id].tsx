import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import SectionPage from '../../../src/components/homepage/categories/shared/SectionPage';
import { getSectionById } from '../../../src/components/homepage/categories/furniture/sectionConfig';
import { View, Text } from 'react-native';

// ============================================================
// FURNITURE COLLECTION ROUTE
// Handles navigation for furniture specific collections
// ============================================================
export default function FurnitureCollectionRoute() {
    const { id } = useLocalSearchParams();
    const sectionId = Array.isArray(id) ? id[0] : id;

    const config = getSectionById(sectionId);

    if (!config) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Collection not found: {sectionId}</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SectionPage config={config} />
        </>
    );
}
