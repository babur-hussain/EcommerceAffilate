import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

interface ServicesTabProps {
    onTabPress?: (tabId: string) => void;
}

const SERVICE_CATEGORIES = [
    { id: 'all', label: 'All Services', icon: 'grid-view' },
    { id: 'health', label: 'Health', icon: 'local-hospital' },
    { id: 'beauty', label: 'Beauty', icon: 'face' },
    { id: 'food', label: 'Food', icon: 'restaurant' },
    { id: 'education', label: 'Education', icon: 'school' },
];

export default function ServicesTab({ onTabPress }: ServicesTabProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const translateX = useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const { translationX: tx, velocityX } = event.nativeEvent;

            // If swiped right more than 100px or with velocity, go back to shopping tab
            if (tx > 100 || velocityX > 500) {
                Animated.timing(translateX, {
                    toValue: width,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    translateX.setValue(0);
                    onTabPress?.('shopping');
                });
            } else {
                // Reset position
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetX={10}
                failOffsetX={-10}
            >
                <Animated.View style={[{ flex: 1 }, { transform: [{ translateX }] }]}>
                    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                        {/* Hero Header */}
                        <LinearGradient
                            colors={['#2563EB', '#1D4ED8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroHeader}
                        >
                            <View style={styles.heroContent}>
                                <Text style={styles.heroTitle}>Premium Services</Text>
                                <Text style={styles.heroSubtitle}>Discover exceptional services tailored for you</Text>

                                {/* Stats Cards */}
                                <View style={styles.statsContainer}>
                                    <View style={styles.statCard}>
                                        <Text style={styles.statNumber}>0+</Text>
                                        <Text style={styles.statLabel}>Services</Text>
                                    </View>
                                    <View style={styles.statCard}>
                                        <Text style={styles.statNumber}>500+</Text>
                                        <Text style={styles.statLabel}>Happy Clients</Text>
                                    </View>
                                    <View style={styles.statCard}>
                                        <Text style={styles.statNumber}>4.8★</Text>
                                        <Text style={styles.statLabel}>Rating</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Category Pills */}
                        <View style={styles.categorySection}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.categoryScroll}
                            >
                                {SERVICE_CATEGORIES.map((category) => {
                                    const isActive = selectedCategory === category.id;
                                    return (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryPill,
                                                isActive && styles.categoryPillActive
                                            ]}
                                            onPress={() => setSelectedCategory(category.id)}
                                        >
                                            <MaterialIcons
                                                name={category.icon as any}
                                                size={18}
                                                color={isActive ? '#FFFFFF' : '#2563EB'}
                                            />
                                            <Text style={[
                                                styles.categoryPillText,
                                                isActive && styles.categoryPillTextActive
                                            ]}>
                                                {category.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Services List */}
                        <View style={styles.servicesSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Featured Services</Text>
                                <Text style={styles.sectionSubtitle}>Handpicked for excellence</Text>
                            </View>

                            <View style={styles.emptyContainer}>
                                <LinearGradient
                                    colors={['#EFF6FF', '#DBEAFE']}
                                    style={styles.emptyGradient}
                                >
                                    <View style={styles.emptyIconContainer}>
                                        <MaterialIcons name="business-center" size={64} color="#60A5FA" />
                                    </View>
                                    <Text style={styles.emptyText}>Coming Soon</Text>
                                    <Text style={styles.emptySubtext}>Amazing services are on their way!</Text>
                                </LinearGradient>
                            </View>
                        </View>

                        <View style={styles.bottomSpacer} />
                    </ScrollView>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // Hero Section
    heroHeader: {
        paddingTop: 24,
        paddingBottom: 32,
        paddingHorizontal: 20,
    },
    heroContent: {
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 15,
        color: '#DBEAFE',
        textAlign: 'center',
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 8,
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#DBEAFE',
        fontWeight: '600',
    },

    // Categories
    categorySection: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    categoryScroll: {
        paddingHorizontal: 16,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        marginRight: 10,
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
    },
    categoryPillActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    categoryPillText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    categoryPillTextActive: {
        color: '#FFFFFF',
    },

    // Services Section
    servicesSection: {
        paddingTop: 24,
        backgroundColor: '#F8FAFC',
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },

    // Empty State
    emptyContainer: {
        marginHorizontal: 20,
        marginTop: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    emptyGradient: {
        padding: 48,
        alignItems: 'center',
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 15,
        color: '#60A5FA',
        textAlign: 'center',
    },

    bottomSpacer: {
        height: 40,
    },
});
