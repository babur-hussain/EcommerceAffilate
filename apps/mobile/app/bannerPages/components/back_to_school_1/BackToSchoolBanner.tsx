
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BackToSchoolBanner = ({ data }: { data: any }) => {
    // Theme colors
    const colors = {
        accentBlue: "#6B9EE6",
        textWhite: "rgba(255,255,255,0.8)",
    };

    return (
        <View style={styles.container}>
            <View style={[styles.banner, { backgroundColor: colors.accentBlue }]}>
                {/* Content */}
                <View style={styles.content}>
                    <Text style={[styles.label, { color: colors.textWhite }]}>LIMITED TIME</Text>
                    <Text style={styles.title}>
                        Buy 2 Get 1{'\n'}Free on Books!
                    </Text>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={[styles.btnText, { color: colors.accentBlue }]}>View Offer</Text>
                    </TouchableOpacity>
                </View>

                {/* Decorative Icon */}
                <View style={styles.iconWrapper}>
                    <MaterialIcons name="auto-stories" size={100} color="rgba(255,255,255,0.3)" style={styles.icon} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    banner: {
        borderRadius: 16,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 140,
    },
    content: {
        zIndex: 10,
        flex: 2,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 28,
        marginBottom: 12,
    },
    btn: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    btnText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    iconWrapper: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
    },
    icon: {
        transform: [{ rotate: '12deg' }],
    },
});

export default BackToSchoolBanner;
