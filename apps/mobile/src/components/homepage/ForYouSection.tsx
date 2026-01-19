import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { usePageLayout } from '../../hooks/usePageLayout';
import SectionRenderer from './SectionRenderer';

interface ForYouSectionProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

import { useAuth } from '../../context/AuthContext';
import CategoryPulseLoader from '../shared/CategoryPulseLoader';

export default function ForYouSection({ staticHeader, renderStickyHeader }: ForYouSectionProps) {
    const router = useRouter();
    const { user } = useAuth();

    // SDUI Hook
    const { layout, loading, refresh } = usePageLayout('home');
    const [refreshing, setRefreshing] = useState(false);

    // Scroll tracking for sticky header
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const onRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        if (headerHeight > 0) {
            setIsSticky(scrollY > headerHeight - 10);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
            }
            stickyHeaderIndices={[1]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
                {staticHeader}
            </View>
            <View>{renderStickyHeader ? renderStickyHeader(isSticky) : null}</View>

            <View style={{ backgroundColor: '#F9FAFB', flex: 1, paddingBottom: 100 }}>
                {loading && !layout ? (
                    <View style={styles.loadingContainer}>
                        <CategoryPulseLoader />
                    </View>
                ) : (
                    layout?.sections?.map((section) => (
                        <SectionRenderer
                            key={section.id}
                            section={section}
                            user={user}
                        />
                    ))
                )}

                {/* Bottom spacer already included via paddingBottom, removing absolute spacer */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6B00',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },
    seeAll: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
});
