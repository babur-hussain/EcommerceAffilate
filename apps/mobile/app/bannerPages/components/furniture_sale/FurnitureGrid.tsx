import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 20;
const PADDING = 24;
const COLUMN_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface FurnitureProduct {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    image_url: string;
}

interface FurnitureGridProps {
    data: {
        title: string;
        items: FurnitureProduct[];
    };
}

export default function FurnitureGrid({ data }: FurnitureGridProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{data.title}</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>VIEW ALL</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {data.items.map((item, index) => (
                    <View key={item.id || index} style={[styles.column, { marginTop: index % 2 === 1 ? 24 : 0 }]}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push(`/product/${item.id}`)}
                            activeOpacity={0.95}
                        >
                            <TouchableOpacity style={styles.favBtn}>
                                <MaterialIcons name="favorite" size={14} color="#A8A29E" />
                            </TouchableOpacity>

                            <View style={styles.imageBox}>
                                <Image source={{ uri: item.image_url }} style={styles.image} />
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.prodTitle}>{item.title}</Text>
                        <Text style={styles.prodSubtitle}>{item.subtitle}</Text>
                        <Text style={styles.prodPrice}>{item.price}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    title: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 24,
        color: '#4A3B32',
    },
    viewAll: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9F6B08',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    column: {
        width: COLUMN_WIDTH,
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 3,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
        aspectRatio: 0.8,
    },
    favBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    imageBox: {
        flex: 1,
        backgroundColor: '#F5F5F4', // stone-100
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    prodTitle: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 18,
        color: '#4A3B32',
        lineHeight: 22,
    },
    prodSubtitle: {
        fontSize: 12,
        color: '#8D7B6F',
        marginBottom: 4,
    },
    prodPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#9F6B08',
    }
});
