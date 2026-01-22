import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SpecialBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color="#D32F2F" />
                    <Text style={[styles.label, { color: '#D32F2F', fontWeight: 'bold' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="category" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Categories</Text>
                </TouchableOpacity>

                <View style={styles.centerButtonWrapper}>
                    <View style={styles.centerButton}>
                        <MaterialIcons name="local-mall" size={28} color="#D32F2F" />
                    </View>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Wishlist</Text>
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
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 24,
        paddingBottom: 24, // Safe area
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    navItem: {
        alignItems: 'center',
        padding: 4,
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    centerButtonWrapper: {
        width: 56,
        alignItems: 'center',
    },
    centerButton: {
        position: 'absolute',
        top: -48,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFD700', // Gold
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#FAFAFA', // background-light
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
    }
});
