import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../lib/api';

interface Category {
    _id: string;
    name: string;
    icon?: string;
    slug: string;
}

const COLORS = ['#EEF2FF', '#ECFDF5', '#FFFBEB', '#FDF2F8', '#EFF6FF', '#F5F3FF'];

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4F46E5" />
            </View>
        );
    }

    if (categories.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Categories</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity key={category._id} style={styles.categoryItem}>
                        <View style={[styles.iconContainer, { backgroundColor: COLORS[index % COLORS.length] }]}>
                            {category.icon?.startsWith('http') ? (
                                <Image
                                    source={{ uri: category.icon }}
                                    style={styles.iconImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <MaterialIcons
                                    name={(category.icon as any) || 'category'}
                                    size={24}
                                    color="#3730A3"
                                />
                            )}
                        </View>
                        <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    loadingContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    seeAll: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#4B5563',
    },
    iconImage: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
});
