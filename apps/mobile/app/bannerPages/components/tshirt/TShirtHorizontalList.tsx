import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface ProductItem {
    id: string;
    title: string;
    subtitle?: string;
    price: string;
    image_url: string;
    badge?: string;
    badge_color?: string; // We might ignore custom color props if enforcing design
}

interface TShirtHorizontalListProps {
    data: {
        title: string;
        header_icon?: any;
        view_all_link?: string;
        items: ProductItem[];
    };
}

export default function TShirtHorizontalList({ data }: TShirtHorizontalListProps) {
    const router = useRouter();
    if (!data || !data.items) return null;

    // Design Colors
    const PRIMARY_COLOR = '#0f5e36'; // Deep Green

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    {/* Material Icon */}
                    <MaterialIcons name="new-releases" size={24} color={PRIMARY_COLOR} style={{ marginRight: 8 }} />
                    <Text style={styles.title}>{data.title}</Text>
                </View>
                <TouchableOpacity onPress={() => data.view_all_link && router.push(data.view_all_link as any)}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {data.items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || index}
                        style={styles.group} // flex flex-col group
                        onPress={() => router.push(`/product/${item.id}`)}
                        activeOpacity={0.9}
                    >
                        {/* Image Container */}
                        <View style={styles.cardContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />

                            {/* NEW/HOT Badge */}
                            {item.badge && (
                                <View style={styles.absoluteBadge}>
                                    <Text style={styles.absoluteBadgeText}>{item.badge}</Text>
                                </View>
                            )}
                        </View>

                        {/* Text Content */}
                        <View style={styles.textContainer}>
                            <Text style={styles.subtitle}>{item.subtitle || 'Series'}</Text>
                            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.price}>{item.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20, // mt-8
        paddingLeft: 16, // pl-4
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end', // items-end
        paddingRight: 16, // pr-4
        marginBottom: 12, // mb-3
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20, // text-xl
        fontFamily: 'Poppins_700Bold',
        color: '#111827', // text-gray-900
    },
    seeAll: {
        fontSize: 14, // text-sm
        fontFamily: 'Poppins_600SemiBold',
        color: '#0f5e36', // text-primary
    },
    listContent: {
        paddingRight: 16,
        gap: 16, // gap-4 (handled by margin on items mostly in ScrollView)
        paddingBottom: 24, // pb-6
    },
    group: {
        width: 144, // min-w-[140px] ~ 144
        marginRight: 16,
    },
    cardContainer: {
        width: 144, // w-36 (144px)
        height: 192, // h-48 (192px)
        borderRadius: 12, // rounded-xl
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 }, // shadow-md
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    absoluteBadge: {
        position: 'absolute',
        top: 8, // top-2
        left: 8, // left-2
        backgroundColor: '#0f5e36', // bg-primary
        paddingHorizontal: 8, // px-2
        paddingVertical: 2, // py-0.5
        borderRadius: 4, // rounded
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    absoluteBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold', // font-bold
    },
    textContainer: {
        marginTop: 8, // mt-2
        paddingHorizontal: 4, // px-1
    },
    subtitle: {
        fontSize: 12, // text-xs
        color: '#6B7280', // text-gray-500
        fontFamily: 'Poppins_400Regular',
    },
    itemTitle: {
        fontSize: 14, // text-sm
        fontFamily: 'Poppins_600SemiBold',
        color: '#111827',
        marginTop: 0,
    },
    price: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#0f5e36', // text-primary
        marginTop: 2,
    }
});
