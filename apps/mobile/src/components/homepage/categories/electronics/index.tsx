import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import CategoryPulseLoader from '../../../shared/CategoryPulseLoader';
import SectionRenderer from '../../SectionRenderer';
import { Section } from '../../../../hooks/usePageLayout';

const { width } = Dimensions.get('window');

interface ElectronicsPageProps {
    staticHeader?: React.ReactNode;
    renderStickyHeader?: (isSticky: boolean) => React.ReactNode;
}

// Local layout definition for Electronics
// This mocks what the API would return for /api/layout/electronics
const ELECTRONICS_LAYOUT: { sections: Section[] } = {
    sections: [
        {
            id: 'elec_banners',
            type: 'electronics_banners',
            priority: 10,
            content: {
                banners: [
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&w=1200&q=80',
                        actionUrl: '/category/laptops-electronics'
                    },
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
                        actionUrl: '/category/smartphones-electronics'
                    },
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80',
                        actionUrl: '/category/desktop-pcs-electronics'
                    }
                ]
            }
        },
        {
            id: 'elec_subcats',
            type: 'electronics_subcategories',
            priority: 20,
            content: {
                // Use the generic endpoint or specific logic
                // The ElectronicsSubcategories component uses dataSource if provided
                dataSource: {
                    endpoint: '/api/categories/695ff7de3f61939001a0637c/subcategories',
                    params: {}
                }
            }
        },
        {
            id: 'elec_latest_products',
            type: 'electronics_product_grid', // Maps to DynamicProductGrid/HomeProductGrid via SectionRenderer
            title: 'Latest in Electronics',
            priority: 30,
            content: {
                dataSource: {
                    endpoint: '/api/products',
                    params: { category: '695ff7de3f61939001a0637c', limit: 10 }
                }
            }
        }
    ]
};

export default function ElectronicsPage({ staticHeader, renderStickyHeader }: ElectronicsPageProps) {
    // For now, use local static layout. Ideally use usePageLayout('electronics')
    const layout = ELECTRONICS_LAYOUT;
    const loading = false;

    // Scroll tracking
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
                {layout.sections.map((section) => (
                    <SectionRenderer key={section.id} section={section} />
                ))}
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
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    subcategoriesSection: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    subcategoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    subcategoryItem: {
        width: (width - 32) / 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    subcategoryIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    subcategoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    subcategoryName: {
        fontSize: 12,
        color: '#374151',
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: 2,
    },
    productsSection: {
        marginTop: 8,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    emptyState: {
        width: '100%',
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
});
