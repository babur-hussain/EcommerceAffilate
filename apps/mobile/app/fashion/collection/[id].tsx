import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import SectionPage from '../../../src/components/homepage/categories/shared/SectionPage';
import { getSectionById } from '../../../src/components/homepage/categories/fashion/shared/sectionConfig';
import { View, Text } from 'react-native';

// ============================================================
// UNIVERSAL ROUTE HANDLER
// This single file handles the navigation for ALL fashion collection pages.
// It looks at the URL ID (e.g. 'women', 'early-bird-deals') 
// and loads the correct configuration from sectionConfig.ts
// ============================================================
export default function FashionCollectionRoute() {
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
