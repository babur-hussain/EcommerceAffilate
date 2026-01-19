import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import SectionPage from '../../src/components/homepage/categories/beauty/shared/SectionPage';
import { getSectionById } from '../../src/components/homepage/categories/beauty/shared/sectionConfig';

export default function BeautySectionRoute() {
    const { id } = useLocalSearchParams();
    const config = getSectionById(Array.isArray(id) ? id[0] : id);

    if (!config) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Beauty', headerBackTitle: 'Back' }} />
                <Text>Section not found: {id}</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: config.title,
                    headerBackTitle: 'Beauty',
                    headerTintColor: config.theme.headerTextColor,
                    headerStyle: { backgroundColor: config.theme.backgroundColor }
                }}
            />
            <SectionPage config={config} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    }
});
