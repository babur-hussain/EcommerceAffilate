import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CyberFlashDealProps {
    data: {
        end_time: string;
    };
}

export default function CyberFlashDeal({ data }: CyberFlashDealProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            <View style={styles.banner}>
                {/* Background Icon */}
                <View style={styles.iconBg}>
                    <MaterialIcons name="shopping-cart" size={120} color="rgba(255,255,255,0.2)" />
                </View>

                <View style={styles.content}>
                    <View>
                        <Text style={styles.title}>FLASH DEAL</Text>
                        <Text style={styles.timer}>Ends in {data.end_time}</Text>
                    </View>

                    <TouchableOpacity style={styles.viewBtn}>
                        <Text style={styles.viewBtnText}>VIEW</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        backgroundColor: '#F8FAFC',
    },
    banner: {
        backgroundColor: '#2A7FFF', // Accent Blue
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        padding: 16,
        overflow: 'hidden',
        // Hard Pop Shadow
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    iconBg: {
        position: 'absolute',
        top: -20,
        right: -20,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
    },
    title: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 24,
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
        letterSpacing: 1,
    },
    timer: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        opacity: 0.9,
    },
    viewBtn: {
        backgroundColor: '#FFCB05', // Secondary
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'black',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    viewBtnText: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12,
    }
});
