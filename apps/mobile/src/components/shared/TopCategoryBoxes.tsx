import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// ==================== Types ====================
export type TabType = 'shopping' | 'businesses' | 'grocery' | 'influencers';

interface CategoryBox {
    id: TabType;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    iconColor: string;
}

// ==================== Category Data ====================
const CATEGORIES: CategoryBox[] = [
    {
        id: 'shopping',
        label: 'Shopping',
        icon: 'shopping-bag',
        iconColor: '#2563EB',
    },
    {
        id: 'businesses',
        label: 'Services',
        icon: 'business',
        iconColor: '#7C3AED',
    },
    {
        id: 'grocery',
        label: 'Grocery',
        icon: 'shopping-basket',
        iconColor: '#10B981',
    },
    {
        id: 'influencers',
        label: 'Influencers',
        icon: 'people',
        iconColor: '#EC4899',
    },
];

// ==================== Props ====================
interface TopCategoryBoxesProps {
    activeTab: TabType;
    onTabPress: (tabId: TabType) => void;
    backgroundColor?: string;
    activeBackgroundColor?: string;
    inactiveBackgroundColor?: string;
    borderColor?: string;
    inactiveLabelColor?: string;
}

// ==================== Component ====================
export function TopCategoryBoxes({
    activeTab,
    onTabPress,
    backgroundColor = '#FF6B00',
    activeBackgroundColor = '#FFD700',
    inactiveBackgroundColor = '#FFFFFF',
    borderColor = 'transparent',
    inactiveLabelColor = '#111827'
}: TopCategoryBoxesProps) {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            {CATEGORIES.map((category) => {
                const isActive = activeTab === category.id;
                const boxBg = isActive ? activeBackgroundColor : inactiveBackgroundColor;
                const boxBorder = !isActive ? borderColor : 'transparent';
                const labelColor = isActive ? '#111827' : inactiveLabelColor;
                // If inactiveLabelColor is white/light, we might want to override the default icon colors too
                // But the user didn't explicitly ask for icon color changes, just background and border.
                // However, blue/purple/green icons on black might look okay, or might need adjustment.
                // Let's assume original icon colors are fine unless we want to override them.
                // Actually, if background is black, we might want to tint icons white or keep them colored if they contrast well.
                // Let's use the category opacity or just keep them as is for now, 
                // but the requested "look more beautiful" implies good contrast.
                // Let's try forcing standard colors first, or we can use the label color for icons if inactive.

                return (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryBox}
                        onPress={() => onTabPress(category.id)}
                    >
                        <View style={[
                            styles.iconContainer,
                            {
                                backgroundColor: boxBg,
                                borderWidth: !isActive && borderColor !== 'transparent' ? 1 : 0,
                                borderColor: boxBorder
                            }
                        ]}>
                            <MaterialIcons
                                name={category.icon}
                                size={24}
                                color={isActive ? category.iconColor : (inactiveLabelColor !== '#111827' ? inactiveLabelColor : category.iconColor)}
                            />
                            <Text style={[styles.label, { color: labelColor }]}>{category.label}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ==================== Styles ====================
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    categoryBox: {
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 78,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
        marginTop: 3,
    },
});

export default TopCategoryBoxes;
