import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface GirlsFashionHeaderProps {
    data: {
        logo_text_part1: string;
        logo_text_part2: string;
    };
}

export default function GirlsFashionHeader({ data }: GirlsFashionHeaderProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity>
                    <MaterialIcons name="menu" size={24} color="#1F2937" />
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                    <Text style={styles.logoMain}>{data.logo_text_part1}</Text>
                    <Text style={styles.logoSub}>{data.logo_text_part2}</Text>
                </View>

                <View style={styles.rightIcons}>
                    <TouchableOpacity>
                        <MaterialIcons name="search" size={24} color="#1F2937" style={{ marginRight: 16 }} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="shopping-bag" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(253, 251, 247, 0.95)', // bg-background-light/90
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        zIndex: 50,
        paddingTop: Platform.OS === 'android' ? 40 : 50, // simple safe area padding
        paddingBottom: 16,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    logoMain: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay_700Bold',
        color: '#8B0000', // Primary Deep Red
        letterSpacing: 3, // tracking-widest
    },
    logoSub: {
        fontSize: 16,
        fontFamily: 'Lato_300Light',
        color: '#111827',
        marginLeft: 4,
    },
    rightIcons: {
        flexDirection: 'row',
    }
});
