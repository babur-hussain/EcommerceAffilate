import React from 'react';
import { Stack } from 'expo-router';
import GlobalSearch from '../../src/components/search/GlobalSearch';

export default function SearchRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    presentation: 'fullScreenModal', // or 'transparentModal'
                    animation: 'fade_from_bottom',
                }}
            />
            <GlobalSearch />
        </>
    );
}
