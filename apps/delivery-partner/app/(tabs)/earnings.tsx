import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Styles } from '../../constants/Styles';

export default function EarningsScreen() {
    return (
        <SafeAreaView style={Styles.container}>
            <View style={Styles.header}>
                <Text style={Styles.title}>Earnings</Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={Styles.card}>
                    <Text style={{ textAlign: 'center', color: Colors.textSecondary, padding: 20 }}>
                        Earnings Chart Placeholder
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
