import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ElegantBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color="#F26985" />
                    <Text style={[styles.label, { color: '#F26985', fontWeight: 'bold' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite-border" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Wishlist</Text>
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
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingVertical: 12,
        borderTopColor: '#E5E7EB',
        borderTopWidth: 1,
        paddingBottom: 24,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        fontFamily: 'Lato_400Regular',
        color: '#9CA3AF',
    },
});
