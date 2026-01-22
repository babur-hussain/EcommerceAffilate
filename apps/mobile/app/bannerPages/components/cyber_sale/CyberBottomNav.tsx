import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CyberBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={28} color="#D9242C" />
                    <Text style={[styles.label, { color: '#D9242C', fontWeight: 'bold' }]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="search" size={28} color="#9CA3AF" />
                    <Text style={styles.label}>Search</Text>
                </TouchableOpacity>

                <View style={styles.centerWrapper}>
                    <TouchableOpacity style={styles.centerBtn}>
                        <MaterialIcons name="local-offer" size={32} color="black" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite-border" size={28} color="#9CA3AF" />
                    <Text style={styles.label}>Saved</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person-outline" size={28} color="#9CA3AF" />
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
        borderTopWidth: 2,
        borderTopColor: 'black',
        paddingVertical: 12,
        paddingBottom: 24, // Safe Area
    },
    navItem: {
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: 'bold',
        color: '#9CA3AF',
    },
    centerWrapper: {
        position: 'relative',
        top: -30,
    },
    centerBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFCB05', // Secondary
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        // Hard Pop Shadow
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    }
});
