import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AestheteFooterProps {
    data: {
        title: string;
        button_text: string;
    };
}

export default function AestheteFooter({ data }: AestheteFooterProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{data.title}</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>{data.button_text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 48,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    title: {
        fontSize: 12,
        fontFamily: 'Cinzel_500Medium',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    button: {
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
        paddingBottom: 2,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: 'Jost_500Medium',
        color: '#1F2937',
    }
});
