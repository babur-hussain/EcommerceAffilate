import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProductHighlightsProps {
    highlights?: string[];
    description?: string;
}

export default function ProductHighlights({ highlights, description }: ProductHighlightsProps) {
    // Use provided highlights or fallback to parsing/displaying description if structured data isn't available
    const displaySpecs = highlights && highlights.length > 0
        ? highlights
        : (description ? [description] : []);

    if (displaySpecs.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Product highlights</Text>
                <TouchableOpacity style={styles.expandButton}>
                    <Ionicons name="chevron-up" size={20} color="#4B5563" />
                </TouchableOpacity>
            </View>

            <View style={styles.specsList}>
                {displaySpecs.map((spec, index) => (
                    <View key={index} style={styles.specItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="information-circle-outline" size={20} color="#374151" />
                        </View>
                        <Text style={styles.specText}>{spec}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.allDetails}>
                <Text style={styles.title}>All details</Text>
                <View style={styles.tabs}>
                    <View style={[styles.tab, styles.activeTab]}><Text style={[styles.tabText, styles.activeTabText]}>Showcase</Text></View>
                    <View style={styles.tab}><Text style={styles.tabText}>Specifications</Text></View>
                    <View style={styles.tab}><Text style={styles.tabText}>Warranty</Text></View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        paddingBottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    expandButton: {
        padding: 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
    },
    specsList: {
        marginBottom: 24,
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    specText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    allDetails: {
        borderTopWidth: 8,
        borderTopColor: '#F3F4F6',
        marginHorizontal: -16,
        padding: 16,
    },
    tabs: {
        flexDirection: 'row',
        marginTop: 16,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 8,
    },
    activeTab: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    tabText: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#FFFFFF',
    }
});
