import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Styles } from '../../constants/Styles';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();

    const handleLogout = () => {
        // Basic logout simulation
        router.replace('/auth/login');
    };

    return (
        <SafeAreaView style={Styles.container}>
            <View style={Styles.header}>
                <Text style={Styles.title}>Profile</Text>
            </View>
            <View style={{ padding: 20 }}>
                <TouchableOpacity
                    style={[Styles.card, { marginTop: 20, alignItems: 'center' }]}
                    onPress={handleLogout}
                >
                    <Text style={{ color: Colors.error, fontWeight: 'bold', fontSize: 16 }}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
