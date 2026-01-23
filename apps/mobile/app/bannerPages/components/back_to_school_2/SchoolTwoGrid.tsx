
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 16;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 2) - COLUMN_GAP) / 2;

const SchoolTwoGrid = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // Theme colors
    const colors = {
        primary: "#FACC15",
        bgLight: "#155e48",
        cardLight: "#ffffff",
        cardDark: "#1f2937",
        textMainLight: "#1F2937",
        textMainDark: "#F3F4F6",
    };

    const defaultProducts = [
        {
            id: '1',
            title: "Premium Sketchbook Set",
            subtitle: "Art & Design",
            price: "$12.99",
            badge: "BEST SELLER",
            badgeColor: colors.primary,
            badgeText: "black",
            stars: 4.5,
            reviews: 42,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMKjBvZ7lHkjDIHdFD_Oymj0ODzClyEHIIVCEtjZYwky5PRHJU43KfKpmxSOTEZvn74J2jplEhOR65Zr-roVA_EqCCW0zk31YTgr1A49Bb7Mfd7Qtw7p5OkcFO1tXwrNKUqMm6jUpAC2aK12EOPAdya9B5xf4iXZB9m2QCWjWwCM0QhdXzuRtUVTjWhioNdeNrCZQbScDN9dFGlG3b3m2L_fZn635T3_u6oEHA9L-xWdshi90_FgLCQ7djJxlyTfNTpwGflbXiwdOs"
        },
        {
            id: '2',
            title: "Fineliner Pen Pack",
            subtitle: "Writing Tools",
            price: "$11.99",
            originalPrice: "$15.00",
            badge: "-20%",
            badgeColor: "#EF4444",
            badgeText: "white",
            stars: 5,
            reviews: 128,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJcvAJiC6aMGAZ6-Z3rF0ipX2k9f-CUrcig3VnI6M8soGm9E1M4gYxgcF444jtlCqaaoeSej-kEiORfKyA_wUjSGahJ4AsMPOM1X34i5MIjRnBxp850CLR3o5PPILzzeJZl_8VMxJ-CA4aZ0Tnz3lWtboC0EDwGvBwakh7klA026drDqjoIGNwMfDGyJ5vHDj7KPlmU6z4iwukBSIlSpun0mPlI1vLB55Z4PktijMBD0RnjFIp96hEhRUr7k8j4higJfkcIgX1yPB_"
        },
        {
            id: '3',
            title: "Classic Canvas Bag",
            subtitle: "Accessories",
            price: "$24.50",
            stars: 4,
            reviews: 85,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOVksraPr3tJaRnP1uz6GLJjAg575bnfNLFm25WspTdhn2VCnAneWHAyvlZitf-VbCVC33aFyj5DbBYS8wK-i6AqQqO8-YfElctvhJ2xLkXWf7UoERin6aicIGT-s-2u7l3Ov_jErMWcqOSWkuUPaufv72X4J23325wVtpo3UA1gNWpMvIDj_0XvIv82OC-q4XagJwieobEpr5vlkuStogIpAYGwe4xXa4BqJmGrpLPyWxrEh4ssFcpIIERqMKRm9koxNDjVnUZSCN"
        },
        {
            id: '4',
            title: "Science Textbook",
            subtitle: "Education",
            price: "$45.00",
            stars: 5,
            reviews: 304,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlKGILC8YgeYkEwG4NJNnb-WOlsreGSkaKOKu0yQnmFL7PpZDQorUjkTEmSdfo8uFOzYEzszGMhpsjE6RUNWqzwNV2nNjmbXAl6FVDaATYfHF2mWDIouVYbBMekLTnY-xvKbfLJdzLmsJJUjA7f3R5S_1nRnBf4RZP88nrG2hOLzuVJ0yP6Jk07EGXFePaVMWrvkyDUzGek2Y_-TV7wjdqFs7k3h5TWxYRXAtS9naBq1XUL1GBGCyBd26nH9R3QJpRt_5cq6B0cu8u"
        }
    ];

    const products = data?.products || defaultProducts;

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<MaterialIcons key={i} name="star" size={12} color={colors.primary} />);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(<MaterialIcons key={i} name="star-half" size={12} color="#D1D5DB" />); // Using gray for half since primary is yellow
            } else {
                stars.push(<MaterialIcons key={i} name="star" size={12} color="#D1D5DB" />);
            }
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Top Picks</Text>
                <MaterialIcons name="star" size={24} color={colors.primary} style={styles.headerIcon} />
            </View>

            <View style={styles.grid}>
                {products.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                            }
                        ]}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/product/${item.id}`)}
                    >
                        {/* Badges */}
                        {item.badge && (
                            <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                                <Text style={[styles.badgeText, { color: item.badgeText }]}>{item.badge}</Text>
                            </View>
                        )}

                        <TouchableOpacity style={[
                            styles.favButton,
                            { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }
                        ]}>
                            <MaterialIcons name="favorite" size={16} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Image */}
                        <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text numberOfLines={1} style={[styles.title, { color: isDarkMode ? 'white' : colors.textMainLight }]}>
                                {item.title}
                            </Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>

                            <View style={styles.ratingRow}>
                                {renderStars(item.stars)}
                                <Text style={styles.reviewCount}>({item.reviews})</Text>
                            </View>

                            <View style={styles.footer}>
                                <View>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    )}
                                    <Text style={[styles.price, { color: isDarkMode ? '#34D399' : '#155e48' }]}>
                                        {item.price}
                                    </Text>
                                </View>
                                <TouchableOpacity style={[
                                    styles.addButton,
                                    { backgroundColor: isDarkMode ? 'white' : 'black' }
                                ]}>
                                    <MaterialIcons name="add" size={18} color={isDarkMode ? 'black' : 'white'} />
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
        marginTop: 24,
        paddingHorizontal: PADDING,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 0.5,
    },
    headerIcon: {
        marginLeft: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
        transform: [{ rotate: '-3deg' }],
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    favButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 6,
        borderRadius: 16,
        zIndex: 10,
    },
    imageContainer: {
        height: 128,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewCount: {
        fontSize: 10,
        color: '#9CA3AF',
        marginLeft: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    originalPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
        marginBottom: 2,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        padding: 6,
        borderRadius: 16,
    },
});

export default SchoolTwoGrid;
