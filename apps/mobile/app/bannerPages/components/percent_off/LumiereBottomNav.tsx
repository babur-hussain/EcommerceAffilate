import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LumiereBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color="#6D28D9" />
                    <Text style={[styles.label, { color: '#6D28D9', fontWeight: 'bold' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="grid-view" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Catalog</Text>
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
        paddingBottom: 24, // Safe area
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    label: {
        fontSize: 10,
        marginTop: 2,
        color: '#9CA3AF',
    },
});
