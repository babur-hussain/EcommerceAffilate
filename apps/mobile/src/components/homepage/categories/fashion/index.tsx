import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import CategoryPulseLoader from '../../../shared/CategoryPulseLoader';
import { usePageLayout } from '../../../../hooks/usePageLayout';
import SectionRenderer from '../../SectionRenderer';

interface FashionPageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

export default function FashionPage({ staticHeader, renderStickyHeader }: FashionPageProps) {
    const { layout, loading, error } = usePageLayout('fashion'); // generic slug 'fashion'

    // Scroll tracking for sticky header
    const [isSticky, setIsSticky] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        if (headerHeight > 0) {
            setIsSticky(scrollY > headerHeight - 10);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
                    {staticHeader}
                </View>
                <View style={styles.contentContainer}>
                    <CategoryPulseLoader />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
                    {staticHeader}
                </View>
                <View style={styles.errorContainer}>
                    <Text>Unable to load Fashion Page</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
                {staticHeader}
            </View>
            <View>{renderStickyHeader ? renderStickyHeader(isSticky) : null}</View>

            <View style={styles.contentContainer}>
                {layout?.sections.map((section) => (
                    <SectionRenderer key={section.id} section={section} />
                ))}

                {/* Bottom overscroll cover */}
                <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 1000, backgroundColor: '#F9FAFB' }} />
            </View>
        </ScrollView >
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
        marginTop: 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 20,
    }
});
