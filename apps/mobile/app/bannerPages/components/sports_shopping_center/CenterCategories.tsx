
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 24;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const CenterCategories = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#314CB6", // Royal Blue
        surfaceLight: "#FFFFFF",
        surfaceDark: "#1E293B",
        textMainLight: "#1E293B",
        textMainDark: "#FFFFFF",
    };

    const defaultCategories = [
        {
            id: 'football',
            label: "Football",
            count: "120+ Items",
            icon: "sports-soccer",
            iconColor: "#314CB6", // primary
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhL5Hxeahb_E7VrTUIHvJSfScV0JW9oC6Hg0re8gkOlOYZ6td4Dwmz4Q11UoNbewj4gJh2Y6uNvEg8XqhkUHJK6uJi4ZSZUqUjg0nBC9Zh9xggyACeEkOnxmv-tBNuTixtkb_Nrwm-4uezp_BmqIZRY6pBDG9YQzYPK5rwQi--ELhkp_8YkxAaUINaHZZ_zfDmeGE9pkWmd9LVFCczwg7EsMrKf68okH8ftAHMRbqUwcEDNQ9XcqspLPHRgCQf1bxdN1J8I_XK4xZB"
        },
        {
            id: 'basketball',
            label: "Basketball",
            count: "85 Items",
            icon: "sports-basketball",
            iconColor: "#F97316", // orange-500
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCbPDdgp70baJEQcMfPe76biOpJZstkf7tkTPROeuLXZdjbv65v-6y9-4fJAiIb7esBWaoPccStYr-Hkm9JrLe11yuLP1qFaUYgIw7kUtZxKC1wt_uWktWfhPUJLz8YoeI9QfovthBDlWGtQWzAA7xN7CvvcAY-o8dO3_4NqDT4e9BTzbtZVdyFFtmEIOrlEjM6NQLsJR69IKdoB29VX5EftvRg5D6VyvCb2lzzCrGMKAyBoYKQ3Av4-DJUH1kDS7egf6CpKIDpN33"
        },
        {
            id: 'tennis',
            label: "Tennis",
            count: "64 Items",
            icon: "sports-tennis",
            iconColor: "#FACC15", // yellow-400
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMgbSRyU05wtkorR7yJ6pQg78RW8gwUJRDAo0zFt-CVQk0nfkSZ6tb9Da6u1_fRLaFh07pTuzJcXXt1ul8dJPBhbEFLe7yB7_7TKp8HDdKI9pdi_UaDCX1Gyk_gqAE3jvypPzEXV7j33AJ93qzTdh6spnHmo5VjZgGhlwa0eHFigwBbOGqV6YZqp3G84vhgjZrq6GV0TGHVQXE1b6FAHsphqg63OZIPjCFVGjGLNq7W6LRgGMFQsnydbbayrUn0rQIFESa8xJAvrsY"
        },
        {
            id: 'golf',
            label: "Golf",
            count: "42 Items",
            icon: "sports-golf",
            iconColor: "#22C55E", // green-500
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiZWKM_xqlvWGsmY7npjp6QjPBF31cPhNctxZt_Sq-8AByK5fjEmYIyh5WIzVaE-Mb0KIKRbPYycLNEya8YTp0OIBD7KKUuJU_B52Y5X1-tsXxfgD8WL24jSZKgCc58Bu8MNNZlzRC4f8R9AD6UcvnizvYKlhjm91uEqsj-q-bK4hcCP4FhZZXkbZMQTsspxg1Q-x14Cu0cZCxbWAOLn7QfC6pvcVhDy__nGOZzODJ4kEy5JSaf1JIqNqmS7tGVwikjFuMyjIhOy5X"
        }
    ];

    const categories = data?.categories || defaultCategories;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={[styles.title, { color: isDarkMode ? 'white' : colors.textMainLight }]}>Categories</Text>
                    <Text style={styles.subtitle}>Pick your favorite sport</Text>
                </View>
                <TouchableOpacity style={styles.seeAllBtn}>
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
                    <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {categories.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.surfaceDark : colors.surfaceLight,
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push({ pathname: `/category/${item.id}` } as any)}
                    >
                        {/* Background Icon Opacity */}
                        <MaterialIcons
                            name={item.icon as any}
                            size={64}
                            color={item.iconColor}
                            style={styles.bgIcon}
                        />

                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.content}>
                            <Text style={[styles.cardTitle, { color: isDarkMode ? 'white' : colors.textMainLight }]}>
                                {item.label}
                            </Text>
                            <Text style={styles.countText}>{item.count}</Text>

                            <TouchableOpacity style={[
                                styles.shopBtn,
                                { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }
                            ]}>
                                <Text style={[styles.shopBtnText, { color: isDarkMode ? 'white' : colors.primary }]}>
                                    Shop Now
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: -24, // Pull up to overlap with header spacing
        paddingHorizontal: PADDING,
        paddingTop: 32, // compensate overlap
        backgroundColor: 'rgba(255,255,255,0.0)', // Transparent, background handled by page wrapper
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    seeAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 24,
        padding: 16,
        marginBottom: 20,
        shadowColor: 'rgba(49, 76, 182, 0.1)', // primary/10 approx
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    bgIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        opacity: 0.1,
        transform: [{ translateX: 10 }, { translateY: -10 }],
    },
    imageWrapper: {
        height: 112, // h-28
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    countText: {
        fontSize: 12, // xs
        color: '#64748B',
        marginBottom: 12,
    },
    shopBtn: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    shopBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default CenterCategories;
