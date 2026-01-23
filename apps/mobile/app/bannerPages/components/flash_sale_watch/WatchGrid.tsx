
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const WatchGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#D32F2F",
        gold400: "#FFEE58",
        gold900: "#B8860B",
        bgWhite: "#FFFFFF",
        cardDark: "#121212",
        textGray: "#111827", // gray-900
        textWhite: "#F3F4F6", // gray-100
        textSub: "#6B7280", // gray-500
        textSubDark: "#9CA3AF", // gray-400
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Oyster Perpetual Silver",
            collection: "Automatic, 41mm",
            originalPrice: "$8,500",
            price: "$5,100",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGlfMSUQlZdcPKE-8mNNy2pXcSAuVU7prDDB2CIR2t0CsKm-h8XvgHSro4r9ZE3kKE1EZiWDfHgEUrsbJ0lmxOafa44j-UhDLOl0oI1CIEuvR2RIxfIlRLYytFakedc_rDgCFeS_5dfIuvcbxZnLkUV9YunBpoPFM0lEaQfYl0ai2-ttlykXpX8CBt-Pn3kpR4khMbk3rXo9HMjF0WtZZKG5WCHERu1TFy0BX8Ku6Un5l4Rz-lQEOBv2z8cY_etd7bQPjmPVu7hjHc",
            discount: "-40%"
        },
        {
            id: '2',
            title: "Royal Oak Gold Leather",
            collection: "Mechanical, 39mm",
            originalPrice: "$12,000",
            price: "$9,000",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAHgN5Z5aq7rKH6jJn4LdSeiZvnoA1Y74C6lHMKUsgi8DlQXXpII0j_izfoFPn4IZc28BCh3rtBob3DiP0IgrdTKj-cEonF1-J9GdmqgWBObvl5o89OG9h6cyzhCpVfc4lbOJ2FOw_5T9E5wAUbQOkNOCEWaQN1TPIEgPsEzZ1Q8qTmKxavlzZyCwRyFgMVdO1E95k0fB7zBpmikd1xf5cO9iGq4KJ1yLOYAIU3VEJRhEiaEfdYwJr4fd-WveN7mD1LfZqPZxZ0Ys",
            discount: "-25%"
        },
        {
            id: '3',
            title: "Cosmograph Black Dial",
            collection: "Chronograph, Steel",
            originalPrice: "$24,000",
            price: "$12,000",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCllc5_JUgN8gnyYzBoJQCZVRfjJTV_iJN3bBNpLDy4MsAcFhmKDW55RrKwlB0YY6zxYLgkVcsbZKlIYjZW7SdclPhmh6_QPTI49MT-alJgMjg9aB2I6kdT6wg0J7UcUVUKE9p83GokaJv6meYqy5li5RIjAnM7ETJ6rXS36ee-l_ZenDVi61ix_eO8eiJH5Eqa3AtImXYXlumUr9JvK6_jR6NiQsnSzc9XTM5V4RmviqokB5SbrH75ZE64DMsGTYl5uM4uF4oVq54z",
            discount: "-50%"
        },
        {
            id: '4',
            title: "Nautilus Blue Horizon",
            collection: "Stainless Steel",
            originalPrice: "$32,000",
            price: "$28,500",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNK-HkUkBZDX2EJnyPSjbeRvEbTPNebYkB7Y5RtEWmZTTtOi0ShoAmh6_VAEV8p3ccsLviCLw92MtA1tsy71f5fPrZUu5qSFAYI51r51-7X-tUatWw5PZDKRP_6KLn6Rx0-lvItZtNkrbAzq8lsfr4907rkzB512Hqa1SWTKji1Wf7L06kud__jhDX6EBT6EODaKt2NhvOKCwUUd8S-0d27I5ql--8jHLp9wKInqlt_L62MG_-XGvgX2unkFPY5_CJIC-9KZEEwHtM"
        }
    ];

    const products = data?.products || defaultProducts;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.gold400 : colors.textGray }]}>Featured Deals</Text>
                <TouchableOpacity>
                    <Text style={[styles.viewAll, { color: isDarkMode ? colors.gold400 : colors.textSub }]}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {products.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.cardDark : colors.bgWhite,
                                borderColor: isDarkMode ? 'rgba(184, 134, 11, 0.5)' : '#F3F4F6', // gold-900/50 : gray-100
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {/* Image Section */}
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#F9FAFB' }]}>
                            {item.discount && (
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{item.discount}</Text>
                                </View>
                            )}
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? colors.textWhite : colors.textGray }]}
                            >
                                {item.title}
                            </Text>
                            <Text style={[styles.collection, { color: isDarkMode ? colors.textSubDark : colors.textSub }]}>
                                {item.collection}
                            </Text>

                            <View style={styles.footer}>
                                <View style={styles.priceRow}>
                                    <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    <Text style={[styles.price, { color: isDarkMode ? colors.gold400 : colors.primary }]}>{item.price}</Text>
                                </View>

                                <TouchableOpacity style={styles.shopBtn}>
                                    <Text style={styles.shopBtnText}>SHOP NOW</Text>
                                    <MaterialIcons name="shopping-cart" size={12} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PADDING,
        paddingBottom: 100,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold', // serif font weight often bold
        // fontFamily: 'Playfair Display' - sticking to system bold for now
    },
    viewAll: {
        fontSize: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16, // rounded-2xl
        padding: 12,
        borderWidth: 1,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    imageContainer: {
        height: 128, // h-32
        borderRadius: 12,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#D32F2F', // primary
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        zIndex: 10,
    },
    discountText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 112, // h-28
    },
    content: {
        // flex: 1, // needed?
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        lineHeight: 18,
    },
    collection: {
        fontSize: 10,
        marginBottom: 8,
    },
    footer: {
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF', // gray-400
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    shopBtn: {
        width: '100%',
        backgroundColor: '#D32F2F', // primary
        paddingVertical: 8,
        borderRadius: 999, // rounded-full
        flexDirection: 'row', // gap-1
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    shopBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10, // text-xs
    },
});

export default WatchGrid;
