import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import CategoryPulseLoader from '../../../shared/CategoryPulseLoader';
import { usePageLayout } from '../../../../hooks/usePageLayout';
import SectionRenderer from '../../SectionRenderer';

interface SportsPageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function SportsPage({ staticHeader, renderStickyHeader }: SportsPageProps) {
    const { layout, loading, refresh } = usePageLayout('sports');
    const [headerHeight, setHeaderHeight] = useState(0);
    const [isSticky, setIsSticky] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
            stickyHeaderIndices={[1]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >
            <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
                {staticHeader}
            </View>
            <View>{renderStickyHeader ? renderStickyHeader(isSticky) : null}</View>

            <View style={styles.contentContainer}>
                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <CategoryPulseLoader />
                    </View>
                ) : (
                    <>
                        {layout?.sections
                            .sort((a, b) => a.priority - b.priority)
                            .map((section) => (
                                <SectionRenderer key={section.id} section={section} />
                            ))}
                    </>
                )}
                <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: '#F9FAFB' }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6F00',
    },
    contentContainer: {
        backgroundColor: '#F9FAFB',
        flex: 1,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingBottom: 20
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
});
