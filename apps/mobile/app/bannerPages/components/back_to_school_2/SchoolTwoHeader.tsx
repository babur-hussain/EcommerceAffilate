
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SchoolTwoHeader = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme Colors
    const colors = {
        primary: "#FACC15", // Chalk Yellow
        bgLight: "#155e48", // Chalkboard Green
        bgDark: "#0f382a",
        cardLight: "#ffffff",
        cardDark: "#1f2937",
        textWhite: "#f3f4f6", // Chalk white
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerImageWrapper}>
                <Image
                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAalVn-6jNXwxbl_nzvbQ21tHvnvozO9MeNdXHP0GXaTNmzbOwNWIHLfZ38ACLgPQiQsTM2f4JM8cTDBMMnwAKgXnOIgO-7cL_Xt3FNwWrTeQt7I3kKBCg3U6YBo4fhQkZYBOtYEWjnrqgC5D-l5J2Erl-fuLp8WcHtHYPf1onJaZGOaIXj_LnJxU1WKFvIfoFFhxvkw8UxqvRP2PIvbdPsZqsIMdjJaaKl5HVyTv0HOVRYn4ThOGKzNpH3BU7MvrNMQQC3RQ3wGP9u" }}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent']}
                    style={styles.gradient}
                />

                {/* Navbar Overlay */}
                <View style={styles.navbar}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.brandTitle}>The School Shop</Text>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="shopping-cart" size={24} color="white" />
                        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.badgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Floating Search Bar */}
            <View style={styles.searchWrapper}>
                <View style={[
                    styles.searchBox,
                    {
                        backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                        borderColor: isDarkMode ? '#4B5563' : '#D1D5DB'
                    }
                ]}>
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search for books, pencils..."
                        placeholderTextColor="#9CA3AF"
                        style={[styles.input, { color: isDarkMode ? 'white' : '#374151' }]}
                    />
                    <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.primary }]}>
                        <MaterialIcons name="tune" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    headerImageWrapper: {
        height: 256, // h-64
        borderBottomLeftRadius: 24, // rounded-b-3xl
        borderBottomRightRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        transform: [{ scale: 1.05 }],
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    navbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 48,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    brandTitle: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        // fontFamily: 'Display'
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'black',
    },
    searchWrapper: {
        marginTop: -32, // Overlap
        paddingHorizontal: 16,
        zIndex: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed', // dashed border as per design concept
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    filterBtn: {
        padding: 6,
        borderRadius: 8,
    },
});

export default SchoolTwoHeader;
