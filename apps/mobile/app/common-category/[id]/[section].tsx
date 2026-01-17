import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Imports
import KBeautyPage from '../../../src/components/homepage/categories/beauty/KBeautyPage';
import LaunchPartyPage from '../../../src/components/homepage/categories/beauty/LaunchPartyPage';

// Shared Beauty Components
import SectionPage from '../../../src/components/homepage/categories/beauty/shared/SectionPage';
import { getSectionById } from '../../../src/components/homepage/categories/beauty/shared/sectionConfig';

export default function CategorySectionPage() {
    const { id, section } = useLocalSearchParams<{ id: string; section: string }>();

    if (id === 'beauty') {
        // 1. Check for specific overrides first (if you want to keep custom pages)
        if (section === 'k-beauty') {
            return <KBeautyPage />;
        }
        if (section === 'launch-party') {
            return <LaunchPartyPage />;
        }

        // 2. Check shared config
        const config = getSectionById(section);
        if (config) {
            return <SectionPage config={config} />;
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 18, color: '#333' }}>Section not found</Text>
            <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>{id} / {section}</Text>
        </View>
    );
}
