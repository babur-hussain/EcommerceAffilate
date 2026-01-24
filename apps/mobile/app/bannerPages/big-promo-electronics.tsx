
import React from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { View, ScrollView, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout, Section } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function BigPromoElectronicsPage() {
    const { layout: pageData, loading, error } = usePageLayout('big-promo-electronics');

    if (loading) {
        return (
            <View style={styles.center}>
                <GlobalLoader />
            </View>
        );
    }

    if (error || !pageData) {
        return (
            <View style={styles.center}>
                {/* Fallback */}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {pageData.sections.map((section: Section) => (
                    <SectionRenderer key={section.id} section={section} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE', // background-light from design
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 0,
    },
});
