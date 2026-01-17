import React from 'react';
import { Stack } from 'expo-router';
import SearchResults from '../../src/components/search/SearchResults';

export default function SearchResultsRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <SearchResults />
        </>
    );
}
