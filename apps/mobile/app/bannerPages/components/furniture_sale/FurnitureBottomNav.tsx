import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function FurnitureBottomNav() {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="home" size={24} color="#9F6B08" />
                    <Text style={[styles.label, { color: '#9F6B08', fontWeight: '500' }]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="grid-view" size={24} color="#A8A29E" />
                    <Text style={styles.label}>Catalog</Text>
                </TouchableOpacity>

                <View style={styles.centerWrapper}>
                    <TouchableOpacity style={styles.centerBtn}>
                        <MaterialIcons name="search" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="favorite-border" size={24} color="#A8A29E" />
                    <Text style={styles.label}>Saved</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="person-outline" size={24} color="#A8A29E" />
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
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        paddingBottom: 24, // Safe Area
        shadowColor: 'black',
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 10,
    },
    navItem: {
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        color: '#A8A29E', // stone-400
        fontWeight: '500',
    },
    centerWrapper: {
        position: 'relative',
        top: -24,
    },
    centerBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#9F6B08', // primary
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#9F6B08',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    }
});
