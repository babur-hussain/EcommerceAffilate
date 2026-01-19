import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Custom Colors from the design
const COLORS = {
    primary: "#376F7C", // Muted Teal
    secondary: "#D8B08C", // Muted Rose Gold
    backgroundLight: "#FAF7F2", // Soft Ivory
    backgroundDark: "#1C1C1E", // Dark Charcoal
    surfaceLight: "#F2EDE5", // Off-White
    surfaceDark: "#2C2C2E", // Dark Surface
    textMain: "#22252a",
    textMuted: "#6c7c7f",
    white: "#FFFFFF",
    black: "#000000",
};

const CATEGORIES = [
    "Western", "Ethnic", "Luxe", "Accessories", "Activewear"
];

const SUB_CATEGORIES = [
    { name: "Dresses", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKKsWNx-7kEcxlgVUzEHgoG64-9MNTZOur82nZavgM1Nc3OUiCJt_TSr5KWBoCcEsro9fdwJnwsdEO3Hy4HHKLepOJa6Yx8jvyBiT4DFcPSzaOHlPAV_HCqtlXkPAnQJoeH4uWPwDuCRvBk-GYqD9VVKIcVENSaw1pRhdVotBKcoDtONvdI3PXV7xiO86Nwz49ElQANWJSxape8TmkjKNRfhik02sPkyCzpiRKvzQbtLvVrHqXqC9HZvYzLf-GVcT1K_aojKFhJVtH" },
    { name: "Kurta Sets", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2vP8Mlne2objfu4XQf4oG2pIGZAQ3aKJF0enwEImMW94bCDn8EroMO0FNG13ErudRoHkjE4PBkRkL5u4DEaRx80XIBX4Zh8p0PG0euUmJKPbnDhREZm5EqRy880CYjXnoTCwamG1aJdyyO5ZOlvN_EfYEKVHKbZcx9YYSrMJnpuUc0LZVW1GSRUPvBsl0cMZEn2WEgBCnR8itSxcDpzUSNKjXbRVRSO3cyax20KrWxVBXaYZQnHLGe41SHu6JExwIs4i3Z8Xhei9H" },
    { name: "Handbags", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7mqZAiS9jux-sBIEfnk7pSk_rXG-EBSOUFXKXQ7e_Dw_gePUNyGRl8PYW1HsgLoH4lm4uAIF-mA7qk9KIv9ee6PPkfTbuYD772N6aTldY21CaXvMnvETKnXtgZxxsgjgHrDHvbL_RyJCC_34M20atBFqNcxwzmzr5apSnPpgYoLy0yInncaiE4mIV8S1YGQZhZ3BsVY3zmFi7cPssGU4nYaah0ZLkaNgEFObkgcebaGOiam-LsjSk8cikee_q_4Fi6E8R6KkijyrJ" },
    { name: "Heels", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmYp3FgtXkKe3Yh7yRpkofxE0QMT8aZtCgFyitT11pLpUvn63g4e92VO_eiKG7TWVt9UcYr1bi4HLHTIad5TmHXAd6rywXv2VUjwxyDml4azadN88c_n7VuXrlUPsHsm7kJITolfQlHhzJGChmVukxLgfOw5itQRrD21DqHrmVgvFEI9H8x9ZXCWOAkSv2niLpisDurJAK-Jl2Se-TKjCSurJPS8qqeUEB2mJVUS5poP_BEXxkP-jPMnUXDKtZoPJ9JgKePP2zCFBu" },
    { name: "Jewelry", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJDx4heTiJSnD7HMsl6zZkrK--j9AGSMFZuHhq2IuQHoUcACznJ3McMjqqLrUXDqkPXbFrjCh1V9MRa3ifKzNbTMnJOyLZL3S6Lh17PW4iq1YCw4VfAKBxJ8Hv8Z6f_05rnPT1A8sIoLzVzS2HZbGXo9BS-PigMS_hmb-cq4I0aJFdsZBQxkOEiiLIDe9a4QGiA5zNyCvlgx5GujRCqk6kl56hdXUBHM4b1ZpRl_6_wP2IuoBugRRlGaySyaU0P4qOidij5rvJzJGj" },
    { name: "Watches", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBksqkdTz3XxSC1NoFe-paTB76fB8LEmR6p4xdXYovZLpgwqBpTPnboAW0q7v4jrZeCwAPoHMEG_HWmfL4GOlkYWuQHx2XACNvtBKyD7QlZLFiRjeU0HurcBn7E_dWsNoq6GfXxPRjsBRwx7qNG-kXrJS54O2eYCJ5eXiQqSH5gSt3D81WdM1OKbYprHurmWZYLmg5mfl_t7OnmOcpie9UCqOYwHV2QbKJwjxmOvGYhm_LxBiIDXH2647kDBBRWkEVmGkTqD48zeoCC" },
    { name: "Bottoms", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpaZxyGCBKY_K4CrA8x3zYu6_pvEW8UJYxyjynVCAzhR7F9peYP5PJu7cluCmKu7eN3e8RGHYacWU_WcwbxrRWq0A0HlvXyJVPiSkIC0MPWoVcsOz6dbF7tbKs-ySeC0CuXuOx0Niz2cqA3YIbUtMYK-rtwqymlxjhbLxDDYb6wIUQJMCtUAOE6GwJv9IKA22nl6YQI0G0KrVo5tjUsQy2oKGJj3RyEAt37j9AbBWM6UjAxvLzRR-R-RrGbBnAeULT5W6h7mJlS9ZA" },
    { name: "Sunglasses", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5ReQ8pxQcN6X2F1xii7GeNInLZXf4msMppSKROOgjlKTiKvcovbUXeW9_sCzjRc0e_ahM5oiaQTwhFfpp-8xLwIVJwIdMXiFZgxzS0Z7Ki3wUZ8zA8vzIvvTt2sw8tThQi0ozTmwmlc9L9iOJhEM5Bwb5AtL9JO8Cbmr2if-5j--F7hRVrPVXR1FbqodhEvof5GluP6DhT8y24nPVWwjgukAsaTJtR5Rc72ACq19ZCnPbzSDbHybRnvz_3YwulPZtzqkaCAjDC6aH" },
];

export default function WomensPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundLight }}>
            <StatusBar style="dark" />
            {/* Top Search Header */}
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, backgroundColor: 'rgba(250, 247, 242, 0.95)' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
                        <MaterialIcons name="menu" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, position: 'relative' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: COLORS.white, borderRadius: 24, paddingLeft: 16, shadowColor: '#376F7C', shadowOpacity: 0.05, shadowRadius: 20, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}>
                            <MaterialIcons name="search" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
                            <TextInput
                                style={{ flex: 1, fontSize: 16, color: COLORS.textMain, fontWeight: '500' }}
                                placeholder="Search designers, styles..."
                                placeholderTextColor={COLORS.textMuted}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
                        <MaterialIcons name="notifications-none" size={24} color={COLORS.textMain} />
                        <View style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary, borderWidth: 1, borderColor: COLORS.white }} />
                    </TouchableOpacity>
                </View>

                {/* Horizontal Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
                    {CATEGORIES.map((cat, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                paddingHorizontal: 20,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: index === 0 ? COLORS.primary : COLORS.surfaceLight,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: index === 0 ? 'transparent' : 'transparent',
                            }}
                        >
                            <Text style={{
                                fontSize: 14,
                                fontWeight: index === 0 ? '600' : '500',
                                color: index === 0 ? COLORS.white : COLORS.textMain,
                                letterSpacing: index === 0 ? 0.5 : 0
                            }}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                    <View style={{ width: '100%', height: 460, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
                        <Image
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWMEyYMVfSHhKIiqrG0BFfBtpM5oT7f5aC2cDexPxWyXACit1PnvxAZ2fcsPSskV7AbHp9fsLP4q1egPLJoza9h2JffHBvA1kCrIpg5AXROITqONfuJP9KWgz-A0-GvxfzfiL4VfULVgxCMjFA5iV8z077i1rJpZoFTEM2qmrYR5qPn-u5FnkNNlzRluWk5LAK27lJWB8tg3GX6Uvs6QumeU6DCIj2h39cb6O-EqghnXJLcZkDzYrQY0rfeLkXgl9qALqss5UsQ5ZF" }}
                            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                        />
                        {/* Gradient Overlay */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
                            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' }}
                        />

                        <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 24, gap: 16, alignItems: 'flex-start' }}>
                            <View>
                                <Text style={{ fontSize: 36, color: COLORS.white, fontWeight: '500', lineHeight: 42, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}>The Spring{'\n'}Floral Edit</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginTop: 4, letterSpacing: 0.5 }}>Bloom with elegance.</Text>
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.secondary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 }}>
                                <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 }}>Shop the Look</Text>
                                <MaterialIcons name="arrow-forward" size={18} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Sub-Category Grid */}
                <View style={{ paddingHorizontal: 16, marginTop: 32 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                        {SUB_CATEGORIES.map((item, index) => {
                            const itemWidth = (width - 32 - 36) / 4; // Screen width - padding - gaps
                            return (
                                <TouchableOpacity key={index} style={{ width: itemWidth, gap: 8, alignItems: 'center' }}>
                                    <View style={{ width: itemWidth, height: itemWidth, borderRadius: 16, padding: 4, backgroundColor: COLORS.surfaceLight, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{ width: '100%', height: '100%', borderRadius: 12 }}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textMain, textAlign: 'center' }}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Trending Section */}
                <View style={{ paddingHorizontal: 16, marginTop: 24, paddingBottom: 24 }}>
                    <Text style={{ fontSize: 24, fontWeight: '600', color: COLORS.textMain, marginBottom: 20, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}>Trending for You</Text>

                    <View style={{ gap: 24 }}>
                        {/* Trending Card 1 */}
                        <TouchableOpacity activeOpacity={0.9} style={{ width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', position: 'relative', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 }}>
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Oo1nZKXGGqOkuRCXFOKA7srndEVXEaYUCnRtI3SZ1gLKoYKHx5D3YxQjbrwUFHl5PB9f23jQSPgUq8YdJkcnh6hC8xxsIxdHvUR4pBWgdvlCT-mw8hF2pkxW0TV7CbM6GsubCxkfvspWHNUu33gxDl7XYhThH-XeuQklG1z-hl0UoIJzTNN9f9pm-HTego4z62qvM9GfAOg2A1x1qqYcgRu25gOlpbNJmv-e-JxmP_UbVJkIGHV_TlR2zjJjdx6VxIO6O8k1YpJ3" }}
                                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.5)']}
                                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%' }}
                            />
                            <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                                    <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>New Season</Text>
                                </View>
                                <Text style={{ fontSize: 24, color: COLORS.white, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', lineHeight: 28 }}>Satin Slip Dresses</Text>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialIcons name="favorite-border" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        {/* Trending Card 2 */}
                        <TouchableOpacity activeOpacity={0.9} style={{ width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', position: 'relative', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 }}>
                            <Image
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEGb5afFGFiBY8qbiW_kHE_Bd7cmDatWW5OWiYdzTeM0EXefomGJmOstOrqRcsKzxhTE2ZCGzqfL5Bfb4xIojeqNpNMYezyy137pYCzXK1R6jSrAHpq9BrG72C4wdSXuJueoZr2yG64mS1DLKTb-rgvocJWD3F0B-0SWONSFkOTuZuunpiwCHz85Tnltv6vZUY8SdbM3Sfy1DI8WzU6VwcZqVMEoGW4Dhjqcdlmbqf2Br0MOmjLFyfDSdE1Bwudce3cbCa743xCKmw" }}
                                style={{ width: '100%', height: '100%', resizeMode: 'cover', alignSelf: 'flex-start' }} // bg-top
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.5)']}
                                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%' }}
                            />
                            <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                                    <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>Wedding Edit</Text>
                                </View>
                                <Text style={{ fontSize: 24, color: COLORS.white, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', lineHeight: 28 }}>Embroidered Lehengas</Text>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialIcons name="favorite-border" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.9)', borderTopWidth: 1, borderTopColor: '#f1f1f1', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 }}>
                <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="home" size={24} color={COLORS.primary} />
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.primary }}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="grid-view" size={24} color={COLORS.textMuted} />
                    <Text style={{ fontSize: 10, fontWeight: '500', color: COLORS.textMuted }}>Categories</Text>
                </TouchableOpacity>
                <View style={{ transform: [{ translateY: -24 }] }}>
                    <TouchableOpacity style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 8 }, elevation: 5 }}>
                        <MaterialIcons name="shopping-bag" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="favorite-border" size={24} color={COLORS.textMuted} />
                    <Text style={{ fontSize: 10, fontWeight: '500', color: COLORS.textMuted }}>Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="person-outline" size={24} color={COLORS.textMuted} />
                    <Text style={{ fontSize: 10, fontWeight: '500', color: COLORS.textMuted }}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
