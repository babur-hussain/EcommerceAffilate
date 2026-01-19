import React from 'react';
import { Stack } from 'expo-router';
import MensPage from '../../../src/components/pages/fashion/MensPage';

export default function MenCollectionPage() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <MensPage />
        </>
    );
}
