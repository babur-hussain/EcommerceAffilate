import React from 'react';
import { Stack } from 'expo-router';
import WomensPage from '../../../src/components/pages/fashion/WomensPage';

export default function WomenCollectionPage() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <WomensPage />
        </>
    );
}
