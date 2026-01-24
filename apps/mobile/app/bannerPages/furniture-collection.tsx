
import React from 'react';
import GlobalLoader from '../../src/components/common/GlobalLoader';
import { View, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { usePageLayout, Section } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import CategoryPulseLoader from '../../src/components/shared/CategoryPulseLoader';

export default function FurnitureCollectionPage() {
    const { layout: pageData, loading, error } = usePageLayout('furniture-collection');
    const router = useRouter();
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#9F6B08",
        bgLight: "#FDFBF7",
        bgDark: "#1C1917",
        textMainLight: "#4A3B32",
        textMainDark: "#E7E5E4",
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <CategoryPulseLoader />
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
            <StatusBar style="dark" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Fixed Header */}
            <View style={[styles.fixedHeader, {
                backgroundColor: isDarkMode ? 'rgba(28, 25, 23, 0.9)' : 'rgba(253, 251, 247, 0.9)',
                shadowColor: isDarkMode ? '#000' : 'rgba(0,0,0,0.05)',
                borderBottomColor: isDarkMode ? '#333' : '#E5E5E5',
                borderBottomWidth: 1, // Optional: for separation
            }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.circleBtn, { backgroundColor: isDarkMode ? '#333' : 'white' }]}
                >
                    <MaterialIcons name="arrow-back" size={20} color={isDarkMode ? 'white' : 'black'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="shopping-bag" size={24} color={isDarkMode ? colors.textMainDark : colors.textMainLight} />
                    <View style={[styles.badgeDot, {
                        backgroundColor: colors.primary,
                        borderColor: isDarkMode ? colors.bgDark : colors.bgLight
                    }]} />
                </TouchableOpacity>
            </View>

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
        backgroundColor: '#FDFBF7', // background-light matches design
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFBF7',
    },
    scrollContent: {
        paddingTop: 100, // Offset for the fixed header
        paddingBottom: 0,
    },
    fixedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100, // Adjust based on status bar + desired height
        paddingTop: 48,
        paddingHorizontal: 24,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    circleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconBtn: {
        padding: 4,
    },
    badgeDot: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
    },
});
