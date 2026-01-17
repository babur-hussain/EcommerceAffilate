import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Basic validation / auth simulation
        router.replace('/(tabs)');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.header, { marginTop: insets.top + 20 }]}>
                    {/* Placeholder for Logo */}
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>🚚</Text>
                    </View>
                    <Text style={styles.title}>Partner App</Text>
                    <Text style={styles.subtitle}>Sign in to start earning</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotButton}>
                        <Text style={styles.forgotButtonText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 60,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    formContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        paddingTop: 50,
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    loginButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotButton: {
        alignItems: 'center',
        marginTop: 20,
    },
    forgotButtonText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
});
