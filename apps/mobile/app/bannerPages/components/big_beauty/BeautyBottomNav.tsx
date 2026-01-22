import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BeautyBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color="#3E2723" />
                    <Text style={[styles.label, { color: '#3E2723' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Search</Text>
                </TouchableOpacity>

                {/* Floating Center Button */}
                <View style={styles.floatingButtonWrapper}>
                    <TouchableOpacity style={styles.floatingButton}>
                        <MaterialIcons name="shopping-bag" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite-border" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person-outline" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 100,
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 10,
        elevation: 20,
        paddingBottom: 24, // Safe area padding simulation
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        fontFamily: 'Poppins_500Medium',
        color: '#9CA3AF',
    },
    floatingButtonWrapper: {
        position: 'relative',
        top: -24,
        elevation: 5,
        shadowColor: '#3E2723',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    floatingButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3E2723',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
