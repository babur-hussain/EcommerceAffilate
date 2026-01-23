import React from 'react';
import { ScrollView, View, ActivityIndicator, Text, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { MaterialIcons } from '@expo/vector-icons';

export default function MegaDealPage() {
    const { layout, loading, error } = usePageLayout('mega_deal');
    const router = useRouter();

    // Extract section data helper
    const getSectionData = (sectionId: string) => {
        return layout?.sections.find(s => s.id === sectionId)?.content || {};
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F3F4F6]">
                <ActivityIndicator size="large" color="#D70018" />
            </View>
        );
    }

    if (error || !layout) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F3F4F6]">
                <Text className="text-red-500">Failed to load Mega Deal Page</Text>
            </View>
        );
    }

    // Map specific sections
    const headerData = getSectionData('mega_header');
    const flashSaleData = getSectionData('mega_flash_sale');
    const gridData = getSectionData('mega_grid');
    // Bottom nav usually doesn't need dynamic data unless configured, but we can check if it exists in layout to optionally render
    const showBottomNav = layout.sections.some(s => s.id === 'mega_bottom_nav');

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Simple Navbar overlay */}
            <View style={styles.navOverlay}>
                <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
                    <MaterialIcons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>ELECTRONICS</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.navBtn}>
                    <MaterialIcons name="shopping-cart" size={20} color="white" />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* 
                  Usage of specific components directly for specific layout control 
                  OR continue using SectionRenderer if we want full SDUI flexibility.
                  Given the requirement to "fix hardcoded data", sticking to the layout's sections order is best.
                */}
                {layout.sections
                    .filter(s => s.id !== 'mega_bottom_nav')
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                        <SectionRenderer key={section.id} section={section} />
                    ))}
            </ScrollView>

            {layout.sections.find(s => s.id === 'mega_bottom_nav') && (
                <SectionRenderer section={layout.sections.find(s => s.id === 'mega_bottom_nav')!} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    navOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 48,
    },
    navBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    navTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        backgroundColor: '#FACC15',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'red',
    }
});
