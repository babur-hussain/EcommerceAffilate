
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const SchoolFourHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#1565C0", // Deep Blue
        secondary: "#FF8F00", // Orange
        bgLight: "#FFF7ED",
        bgDark: "#111827",
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC30Ofu0s1bAXd0-TjcubNuCcYL2VlIKSZRge7lXbvWbEkktE7MQoizzX-vZ-hm-y5YQ11lzGNh2Q9Zjh4RLz6NJ_1_k0Y2AaSUIi6X_SkjakH4MkKTjUdFi3RSUy3e4V000xVBUSzaqhmnuwoXXvFGw7XOpxDfTZIg0R_MGFOdSA9pVd6Rzr0fdM-EGQGkLQrfSV4hC9LM0Y8iazt23XigEDE30trlEmIdsjVee3zybpCZut_fvXR0xa1jEzOz35Ukn1JF_2nvZGVq" }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Floating Search Bar Area */}
                <View style={styles.floatingHeader}>
                    <View style={styles.searchRow}>
                        {/* BlurView for Search */}
                        <BlurView intensity={20} tint="light" style={styles.searchBlur}>
                            <MaterialIcons name="search" size={24} color="#9CA3AF" />
                            <TextInput
                                placeholder="Search uniforms, supplies..."
                                placeholderTextColor="#9CA3AF"
                                style={[styles.input, { color: isDarkMode ? 'white' : '#1F2937' }]}
                            />
                        </BlurView>

                        {/* Notification Button */}
                        <BlurView intensity={20} tint="light" style={styles.iconBlur}>
                            <TouchableOpacity style={styles.iconBtn}>
                                <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </BlurView>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    imageWrapper: {
        width: '100%',
        height: 256, // h-64
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FB923C', // orange-400 fallback
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 25,
        elevation: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    floatingHeader: {
        position: 'absolute',
        top: 48, // safe area approximation
        left: 16,
        right: 16,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 12,
    },
    searchBlur: {
        flex: 1,
        height: 48,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.8)', // Fallback opacity
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
    },
    iconBlur: {
        width: 48,
        height: 48,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    iconBtn: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SchoolFourHeader;
