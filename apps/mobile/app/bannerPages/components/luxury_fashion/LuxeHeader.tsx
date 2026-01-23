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
            {/* Status Bar Mock Removed */}

            <View style={styles.navBar}>
                {/* Logo and Menu removed as per request */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#F3F3F5', // bg-background-light
        zIndex: 50,
        paddingTop: 30, // Added spacing for status bar
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
