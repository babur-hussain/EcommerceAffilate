
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const SchoolTwoDeals = ({ data }: { data: any }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // Theme colors
    const colors = {
        primary: "black", // or primary yellow? Design uses primary borders
        cardLight: "#ffffff",
        cardDark: "#1f2937",
        textMainLight: "#1F2937",
        textMainDark: "#F3F4F6",
    };

    const deals = [
        {
            id: '1',
            title: "Spiral Notebook",
            offer: "Buy 2 Get 1 Free",
            offerColor: "#16A34A", // green-600
            price: "$4.99",
            borderColor: "#FACC15", // yellow
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEa3u_1cNHpa6TAMxdKQwY8gExaLB6S6KIsgmy2X4DhoD8qoDejMdIRDHvjNNQHvhZdaB2UCh7Qq6qo522z5u8VLjVtCMZDM0ngq8fv1ykty35QqaVIrNeuJTnOkSErttb7nQII0a8P7oqmU4hQW670UuB09umtISk0Vq84ubLZAzJ5PD890x75_slf4porQ1gXKF0p4icSiBGsVGL0EVUyflRruF-SRjLFEf4aCsmXqhTvJMJ82wRzQ2BPBbt03Gqs6F0_bDrIZ-N"
        },
        {
            id: '2',
            title: "Geometry Set",
            offer: "Clearance",
            offerColor: "#2563EB", // blue-600
            price: "$8.50",
            borderColor: "#60A5FA", // blue-400
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhLz22N2B6CX4y1Oq-3gdaf6hHaW3ioMJgC0lQ_sNDUbsajCMapVdEdd1C-5YTCAGzTkjyt13OJTFqHcPHEtFSyLfdIQXaH0qem1t-6VLDH9fk_NFS1hBH8wNoJHCnDUT9d6EVndkx1jXhk_RfEAzyGu-wbBxQ04M_1K1IwyKONy0OJpdzVMeC8oQNAFRIERHceiTDleCECDHSZdkpf8DMznxjHl1_ygAXcwRDWeu0KnK1INDjWFYYW8mE4hwIXIXPl4MGIfsY22oN"
        }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Deals of the Week</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {deals.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
                                borderLeftColor: item.borderColor
                            }
                        ]}
                        activeOpacity={0.9}
                    >
                        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

                        <View style={styles.content}>
                            <Text style={[styles.title, { color: isDarkMode ? 'white' : colors.textMainLight }]}>
                                {item.title}
                            </Text>
                            <Text style={[styles.offer, { color: item.offerColor }]}>{item.offer}</Text>
                            <Text style={[styles.price, { color: isDarkMode ? '#E5E7EB' : '#111827' }]}>
                                {item.price}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    scrollContent: {
        gap: 16,
        paddingBottom: 4,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        width: 280,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 8,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    offer: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default SchoolTwoDeals;
