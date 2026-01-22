import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function FlashBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color="#D32F2F" />
                    <Text style={[styles.label, { color: '#D32F2F', fontWeight: 'bold' }]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Search</Text>
                </TouchableOpacity>

                <View style={styles.centerWrapper}>
                    <TouchableOpacity style={styles.centerBtn}>
                        <MaterialIcons name="local-offer" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite" size={24} color="#9CA3AF" />
                    <Text style={styles.label}>Saved</Text>
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
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingVertical: 12,
        paddingBottom: 24, // Safe Area
    },
    navItem: {
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        color: '#9CA3AF', // gray-400
    },
    centerWrapper: {
        position: 'relative',
        top: -24,
    },
    centerBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFD700', // Gold
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EAB308', // yellow-500
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
        borderWidth: 4,
        borderColor: 'white',
    }
});
