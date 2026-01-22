import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LuxBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home-filled" size={24} color="#8B5E55" />
                    <Text style={[styles.label, { color: '#8B5E55', fontWeight: 'bold' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Search</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <View style={styles.cartIconWrapper}>
                        <MaterialIcons name="shopping-bag" size={24} color="#9CA3AF" />
                        <View style={styles.cartDot} />
                    </View>
                    <Text style={styles.label}>Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person" size={24} color="#9CA3AF" />
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
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32, // rounded-t-3xl
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -5 },
        shadowRadius: 20,
        elevation: 20,
        paddingBottom: 24,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    label: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
    cartIconWrapper: {
        position: 'relative',
    },
    cartDot: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        backgroundColor: '#8B5E55', // Primary
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
    }
});
