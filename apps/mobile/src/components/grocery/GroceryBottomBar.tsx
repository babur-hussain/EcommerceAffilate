import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useBasket } from '../../context/BasketContext';

// Get screen width to calculate tab width
const { width } = Dimensions.get('window');

interface GroceryBottomBarProps {
    currentTab?: string;
    onTabPress?: (tabId: string) => void;
}

export function GroceryBottomBar({ currentTab = 'grocery', onTabPress }: GroceryBottomBarProps) {
    const router = useRouter();
    const { basketCount } = useBasket();

    const handlePress = (tabId: string) => {
        if (onTabPress) {
            onTabPress(tabId);
        }
    };

    const activeTab = currentTab;

    return (
        <View style={styles.container}>
            {/* Top Border Line */}
            <View style={styles.borderLine} />

            <View style={styles.content}>
                {/* 1. Grocery (Home) */}
                <TouchableOpacity
                    style={styles.tabItem}
                    activeOpacity={0.7}
                    onPress={() => handlePress('grocery')}
                >
                    <Feather
                        name="home"
                        size={24}
                        color={activeTab === 'grocery' ? '#333333' : '#666666'}
                    />
                    <Text style={[
                        styles.tabLabel,
                        { color: activeTab === 'grocery' ? '#333333' : '#666666', fontWeight: activeTab === 'grocery' ? '600' : '500' }
                    ]}>
                        Grocery
                    </Text>
                </TouchableOpacity>

                {/* 2. Categories */}
                <TouchableOpacity
                    style={styles.tabItem}
                    activeOpacity={0.7}
                    onPress={() => handlePress('categories')}
                >
                    <Ionicons
                        name={activeTab === 'categories' ? "grid" : "grid-outline"}
                        size={24}
                        color={activeTab === 'categories' ? '#333333' : '#666666'}
                    />
                    <Text style={[
                        styles.tabLabel,
                        { color: activeTab === 'categories' ? '#333333' : '#666666', fontWeight: activeTab === 'categories' ? '600' : '500' }
                    ]}>
                        Categories
                    </Text>
                </TouchableOpacity>

                {/* 3. Top Picks */}
                <TouchableOpacity
                    style={styles.tabItem}
                    activeOpacity={0.7}
                    onPress={() => handlePress('top-picks')}
                >
                    <MaterialCommunityIcons
                        name={activeTab === 'top-picks' ? "star" : "star-outline"}
                        size={26} // Slightly larger for star
                        color={activeTab === 'top-picks' ? '#333333' : '#666666'}
                    />
                    <Text style={[
                        styles.tabLabel,
                        { color: activeTab === 'top-picks' ? '#333333' : '#666666', fontWeight: activeTab === 'top-picks' ? '600' : '500' }
                    ]}>
                        Top Picks
                    </Text>
                </TouchableOpacity>

                {/* 4. Basket */}
                <TouchableOpacity
                    style={styles.tabItem}
                    activeOpacity={0.7}
                    onPress={() => handlePress('basket')}
                >
                    <View>
                        <SimpleLineIcons
                            name="handbag"
                            size={22}
                            color={activeTab === 'basket' ? '#333333' : '#666666'}
                        />
                        {basketCount > 0 && (
                            <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>
                                    {basketCount > 99 ? '99+' : basketCount}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text style={[
                        styles.tabLabel,
                        { color: activeTab === 'basket' ? '#333333' : '#666666', fontWeight: activeTab === 'basket' ? '600' : '500' }
                    ]}>
                        Basket
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90, // Increased height
        paddingBottom: 25, // Increased bottom spacing for safety/aesthetics
        elevation: 8, // Shadow for Android
        zIndex: 100,
    },
    borderLine: {
        height: 1,
        backgroundColor: '#E0E0E0',
        width: '100%',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        width: width / 4,
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 4,
    },
    badgeContainer: {
        position: 'absolute',
        top: -8,
        right: -10,
        backgroundColor: '#DC2626',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
