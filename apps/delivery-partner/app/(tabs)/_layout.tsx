import { Tabs } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.tabIconSelected,
                tabBarInactiveTintColor: Colors.tabIconDefault,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: Colors.border,
                    height: Platform.OS === 'ios' ? 88 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                    paddingTop: 8,
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="earnings"
                options={{
                    title: 'Earnings',
                    tabBarIcon: ({ color }) => <MaterialIcons name="attach-money" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
