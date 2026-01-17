import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TopCategoryBoxes, TabType } from '../shared/TopCategoryBoxes';

// ==================== Location Bar ====================
interface GroceryLocationBarProps {
    address?: string;
    date?: string;
}

function GroceryLocationBar({ address = 'Select your location', date }: GroceryLocationBarProps) {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'short' });

    return (
        <View style={locationStyles.container}>
            <TouchableOpacity style={locationStyles.leftSection}>
                <MaterialIcons name="home" size={20} color="#8B6914" />
                <Text style={locationStyles.addressLine} numberOfLines={1}>
                    <Text style={locationStyles.label}>WORK  </Text>
                    <Text style={locationStyles.address}>{address}</Text>
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#8B6914" />
            </TouchableOpacity>
            <View style={locationStyles.dateContainer}>
                <Text style={locationStyles.dateNumber}>{dateNum} {month}</Text>
                <Text style={locationStyles.dayName}>{dayName}</Text>
            </View>
        </View>
    );
}

const locationStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF8E7',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    addressLine: {
        marginLeft: 8,
        flex: 1,
        fontSize: 12,
        color: '#6B5720',
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#8B6914',
        letterSpacing: 0.5,
    },
    address: {
        fontSize: 12,
        color: '#6B5720',
    },
    dateContainer: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    dateNumber: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    dayName: {
        fontSize: 9,
        color: '#FFFFFF',
        opacity: 0.9,
    },
});

// ==================== Search Bar ====================
function GrocerySearchBar() {
    const router = useRouter(); // Import might be needed if not top level
    return (
        <View style={searchStyles.container}>
            <TouchableOpacity
                style={searchStyles.searchContainer}
                onPress={() => router.push('/search')}
                activeOpacity={0.9}
            >
                <MaterialIcons name="search" size={22} color="#9CA3AF" style={searchStyles.icon} />
                <Text style={searchStyles.placeholder}>Search for atta, dal, oil...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={searchStyles.micButton}>
                <MaterialIcons name="mic" size={22} color="#FF9800" />
            </TouchableOpacity>
        </View>
    );
}

const searchStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 12,
        backgroundColor: '#FFF8E7',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 46,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    placeholder: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    micButton: {
        width: 46,
        height: 46,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
});

// ==================== Exported Components ====================

interface GroceryStaticHeaderProps {
    onTabPress?: (tabId: string) => void;
}

// Static header includes top cards and location bar (scrolls away)
export const GroceryStaticHeader = ({ onTabPress }: GroceryStaticHeaderProps) => {
    return (
        <View style={mainStyles.staticContainer}>
            <TopCategoryBoxes
                activeTab="grocery"
                onTabPress={(id) => onTabPress?.(id)}
                backgroundColor="#FFF8E7"
                activeBackgroundColor="#FF9800"
            />
            <GroceryLocationBar />
        </View>
    );
};

// Sticky header only has search bar (stays visible when scrolling)
export const GroceryStickyHeader = () => {
    return (
        <View style={mainStyles.stickyContainer}>
            <GrocerySearchBar />
        </View>
    );
};

const mainStyles = StyleSheet.create({
    staticContainer: {
        backgroundColor: '#FFF8E7',
    },
    stickyContainer: {
        backgroundColor: '#FFF8E7',
    },
});

export default {
    GroceryStaticHeader,
    GroceryStickyHeader,
};

