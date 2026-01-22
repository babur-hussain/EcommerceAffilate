import React from 'react';
import { ScrollView, View, ActivityIndicator, Text, StatusBar, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { MaterialIcons } from '@expo/vector-icons';

export default function MegaDealPage() {
    const { layout, loading, error } = usePageLayout('mega_deal');

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

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Simple Navbar overlay */}
            <View style={styles.navOverlay}>
                <View style={styles.navBtn}>
                    <MaterialIcons name="menu" size={20} color="white" />
                </View>
                <Text style={styles.navTitle}>ELECTRONICS</Text>
                <View style={styles.navBtn}>
                    <MaterialIcons name="shopping-cart" size={20} color="white" />
                    <View style={styles.badge} />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {layout.sections
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                        <SectionRenderer key={section.id} section={section} />
                    ))}
            </ScrollView>
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
