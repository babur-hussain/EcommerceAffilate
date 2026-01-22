import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MenFashionFooterCTAProps {
    data: {
        text: string;
    };
}

export default function MenFashionFooterCTA({ data }: MenFashionFooterCTAProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>{data.text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 32,
        marginTop: 16,
    },
    button: {
        backgroundColor: '#EF3333', // Primary Red
        borderRadius: 999,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Anton_400Regular',
        letterSpacing: 2, // tracking-widest
        textTransform: 'uppercase',
    }
});
