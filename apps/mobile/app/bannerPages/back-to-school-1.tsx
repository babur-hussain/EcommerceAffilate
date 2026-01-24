
import React from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout, Section } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';

export default function BackToSchoolOnePage() {
    const { layout: pageData, loading, error } = usePageLayout('back-to-school-1');

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
        backgroundColor: '#F9F7F2',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F7F2',
    },
    scrollContent: {
        paddingBottom: 0,
    },
});
