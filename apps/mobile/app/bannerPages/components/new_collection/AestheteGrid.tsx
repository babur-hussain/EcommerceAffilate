import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 16;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface ProductItem {
    id: string;
    title: string;
    description: string;
    price: string;
    image_url: string;
    label?: string;
    label_color?: string;
}

interface AestheteGridProps {
    data: {
        items: ProductItem[];
    };
}

export default function AestheteGrid({ data }: AestheteGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {data.items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || index}
                        style={styles.card}
                        onPress={() => router.push(`/product/${item.id}`)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />

                            <TouchableOpacity style={styles.favButton}>
                                <MaterialIcons name="favorite-border" size={16} color="#1F2937" />
                            </TouchableOpacity>

                            {item.label && (
                                <View style={[styles.label, { backgroundColor: item.label_color || '#1A1A1A' }]}>
                                    <Text style={styles.labelText}>{item.label}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <View style={styles.row}>
                                <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                                <Text style={styles.price}>{item.price}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: PADDING,
        backgroundColor: '#F3F4F6', // background-light
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: GAP,
    },
    card: {
        width: COLUMN_WIDTH,
        marginBottom: 16,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: 'white',
        position: 'relative',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.95,
    },
    favButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 6,
        borderRadius: 20,
    },
    label: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    labelText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    details: {
        gap: 2,
    },
    title: {
        fontSize: 14,
        fontFamily: 'Cinzel_600SemiBold',
        color: '#1F2937',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    desc: {
        fontSize: 12,
        fontFamily: 'Jost_400Regular',
        color: '#6B7280',
        flex: 1,
        marginRight: 4,
    },
    price: {
        fontSize: 14,
        fontFamily: 'Jost_500Medium',
        color: '#1F2937',
    }
});
