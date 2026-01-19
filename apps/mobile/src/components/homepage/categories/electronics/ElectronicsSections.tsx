import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SectionProps } from '../../SectionRenderer';
import api from '../../../../lib/api';

const { width } = Dimensions.get('window');

// Helper to normalize URLs
const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/category/')) {
        return url.replace('/category/', '/common-category/');
    }
    return url;
};

// 1. Electronics Subcategories (Same style as Fashion)
export const ElectronicsSubcategories = ({ data }: SectionProps) => {
    const router = useRouter();
    const [subcategories, setSubcategories] = React.useState<any[]>(data?.items || []);

    React.useEffect(() => {
        if (data?.dataSource) {
            const fetchSubcats = async () => {
                try {
                    const res = await api.get(data.dataSource.endpoint, { params: data.dataSource.params });
                    if (Array.isArray(res.data)) {
                        setSubcategories(res.data);
                    }
                } catch (e) {
                    console.error("Failed to fetch electronics subcats", e);
                }
            };
            fetchSubcats();
        }
    }, [data]);

    if (!subcategories.length) return null;

    return (
        <View style={styles.subcategoriesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {Array.from({ length: Math.ceil(subcategories.length / 2) }).map((_, colIndex) => {
                    const pair = subcategories.slice(colIndex * 2, colIndex * 2 + 2);
                    return (
                        <View key={colIndex} style={styles.columnWrapper}>
                            {pair.map((sub: any) => (
                                <TouchableOpacity
                                    key={sub._id || sub.id}
                                    style={styles.subcategoryItem}
                                    onPress={() => router.push((sub.actionUrl ? normalizeUrl(sub.actionUrl) : `/common-category/${sub.slug}`) as any)}
                                >
                                    <View style={styles.subcategoryIconContainer}>
                                        <Image source={{ uri: sub.image || sub.icon }} style={styles.subcategoryImage} />
                                    </View>
                                    <Text style={styles.subcategoryName} numberOfLines={2}>{sub.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    subcategoriesSection: { paddingVertical: 12, backgroundColor: '#FFFFFF' },
    horizontalScrollContent: { paddingHorizontal: 16 },
    columnWrapper: { marginRight: 12, justifyContent: 'flex-start' },
    subcategoryItem: { width: (width - 60) / 4, maxWidth: 85, alignItems: 'center', marginBottom: 16 },
    subcategoryIconContainer: { width: 70, height: 70, borderRadius: 35, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 6, borderWidth: 1, borderColor: '#F3F4F6' },
    subcategoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    subcategoryName: { fontSize: 12, lineHeight: 16, height: 32, color: '#374151', textAlign: 'center', fontWeight: '500' },
});
