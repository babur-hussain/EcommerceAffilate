import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ElegantTrendingProps {
    data: {
        title: string;
        item: {
            image_url: string;
            tag: string;
            name: string;
            description: string;
        };
    };
}

export default function ElegantTrending({ data }: ElegantTrendingProps) {
    if (!data) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="auto-awesome" size={20} color="#F26985" />
                <Text style={styles.sectionTitle}>{data.title}</Text>
            </View>

            <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                <Image source={{ uri: data.item.image_url }} style={styles.image} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                />

                <View style={styles.content}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{data.item.tag}</Text>
                    </View>
                    <Text style={styles.name}>{data.item.name}</Text>

                    <View style={styles.footer}>
                        <Text style={styles.description}>{data.item.description}</Text>
                        <View style={styles.arrowButton}>
                            <MaterialIcons name="arrow-forward" size={20} color="#F26985" />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat_700Bold',
        color: '#111827',
    },
    card: {
        width: '100%',
        height: 256,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    content: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    tag: {
        backgroundColor: '#F26985',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    tagText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    name: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    description: {
        color: '#D1D5DB',
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
    },
    arrowButton: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 999,
    }
});
