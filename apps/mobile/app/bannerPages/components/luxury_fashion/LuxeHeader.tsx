import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LuxeHeaderProps {
    data: {
        logo_text: string;
    };
}

export default function LuxeHeader({ data }: LuxeHeaderProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            {/* Status Bar Mock */}
            <View style={styles.statusBar}>
                <Text style={styles.statusText}>9:41</Text>
                <View style={styles.statusIcons}>
                    <MaterialIcons name="signal-cellular-alt" size={14} color="black" />
                    <MaterialIcons name="wifi" size={14} color="black" />
                    <MaterialIcons name="battery-full" size={14} color="black" />
                </View>
            </View>

            <View style={styles.navBar}>
                <Text style={styles.logo}>{data.logo_text}</Text>
                <TouchableOpacity>
                    <MaterialIcons name="menu" size={32} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#F3F3F5', // bg-background-light
        zIndex: 50,
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 8,
        backgroundColor: 'rgba(243, 243, 245, 0.8)',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    statusIcons: {
        flexDirection: 'row',
        gap: 4,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    logo: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 4, // tracking-widest
        textTransform: 'uppercase',
        fontFamily: 'Montserrat_700Bold',
        color: 'black',
    }
});
