import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image as RNImage, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import api from '../../src/lib/api';

export default function EditProfile() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: (user as any)?.phoneNumber || '',
        bio: (user as any)?.bio || '',
    });

    const handleChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (loading) return;
        setLoading(true);

        try {
            await api.put('/api/me', {
                name: form.name,
                phoneNumber: form.phone,
                bio: form.bio
            });
            await refreshUser();
            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error) {
            console.error('Update failed:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#2563EB" />
                    ) : (
                        <Text style={styles.saveText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Profile Image Section */}
                    <View style={styles.imageSection}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={user?.profileImage || { uri: 'https://via.placeholder.com/150' }}
                                style={styles.profileImage}
                                contentFit="cover"
                            />
                            <TouchableOpacity style={styles.cameraButton}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={form.name}
                            onChangeText={(t) => handleChange('name', t)}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={user?.email}
                            editable={false}
                            selectTextOnFocus={false}
                        />
                        <Text style={styles.helperText}>Email cannot be changed</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={form.phone}
                            onChangeText={(t) => handleChange('phone', t)}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={form.bio}
                            onChangeText={(t) => handleChange('bio', t)}
                            placeholder="Tell something about yourself"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
    },
    cancelButton: {
        padding: 4,
    },
    cancelText: {
        fontSize: 16,
        color: '#6B7280',
    },
    saveButton: {
        padding: 4,
    },
    saveText: {
        fontSize: 16,
        color: '#2563EB',
        fontWeight: '600',
    },
    content: {
        padding: 24,
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2563EB',
        padding: 8,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#fff',
    },
    changePhotoText: {
        color: '#2563EB',
        fontSize: 15,
        fontWeight: '500',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#111827',
        backgroundColor: '#fff',
    },
    disabledInput: {
        backgroundColor: '#F9FAFB',
        color: '#9CA3AF',
        borderColor: '#F3F4F6',
    },
    textArea: {
        minHeight: 100,
        paddingVertical: 12,
    },
    helperText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
});
