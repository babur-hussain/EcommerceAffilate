import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import { HomeStaticHeader, HomeStickyHeader } from '../../src/components/homepage/HomeHeader';
import ShoppingTab from '../../src/components/homepage/ShoppingTab';
import ServicesTab from '../../src/components/homepage/ServicesTab';
import { GroceryScreen } from '../../src/components/grocery';
import InfluencersPage from '../../src/components/influencers/InfluencersPage';
import ForYouSection from '../../src/components/homepage/ForYouSection';
import CategoryDynamicSection from '../../src/components/homepage/CategoryDynamicSection';
import FashionPage from '../../src/components/homepage/categories/fashion/index';
import MobilesPage from '../../src/components/homepage/categories/mobiles/index';
import BeautyPage from '../../src/components/homepage/categories/beauty/index';
import ElectronicsPage from '../../src/components/homepage/categories/electronics/index';
import HomeCategoryPage from '../../src/components/homepage/categories/home/index';
import AppliancesPage from '../../src/components/homepage/categories/appliances/index';
import ToysPage from '../../src/components/homepage/categories/toys/index';
import FoodAndHealthPage from '../../src/components/homepage/categories/food-and-health/index';
import AutoAccessoriesPage from '../../src/components/homepage/categories/auto-accessories/index';
import TwoWheelersPage from '../../src/components/homepage/categories/two-wheelers/index';
import SportsPage from '../../src/components/homepage/categories/sports/index';
import BooksPage from '../../src/components/homepage/categories/books/index';
import FurniturePage from '../../src/components/homepage/categories/furniture/index';

type TabType = 'shopping' | 'businesses' | 'grocery' | 'influencers';

interface Tab {
  id: TabType;
  label: string;
}

const TABS: Tab[] = [
  { id: 'shopping', label: 'Shopping' },
  { id: 'businesses', label: 'Businesses' },
  { id: 'grocery', label: 'Grocery' },
  { id: 'influencers', label: 'Influencers' },
];

export default function HomeScreen() {
  const router = useRouter(); // expo-router hook
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('shopping');
  const [selectedCategory, setSelectedCategory] = useState<string>('For You');

  // Dynamic colors based on active tab
  const [customColor, setCustomColor] = useState<string | null>(null);

  const isGroceryTab = activeTab === 'grocery';
  // Use custom color if set (e.g. from basket), otherwise fall back to tab defaults
  const safeAreaColor = customColor || (isGroceryTab ? '#FFF8E7' : '#FF6B00');
  const statusBarStyle = isGroceryTab ? 'dark-content' : 'light-content';

  const onCategorySelect = (category: any) => {
    setSelectedCategory(category.name);
  };

  const navigation = useNavigation();

  useEffect(() => {
    // Reset custom color when changing main tabs
    setCustomColor(null);

    if (activeTab === 'grocery') {
      navigation.setOptions({
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: undefined,
      });
    }
  }, [activeTab, navigation]);

  // Helper to create header components
  const createHeaders = () => {
    const handleTabPress = (id: string) => {
      if (id === 'influencers') {
        router.push('/influencers');
      } else {
        setActiveTab(id as TabType);
      }
    };

    const staticHeader = (
      <HomeStaticHeader
        onTabPress={handleTabPress}
      />
    );

    const stickyHeader = (isSticky: boolean) => (
      <View>
        {activeTab === 'shopping' && (
          <HomeStickyHeader
            onCategorySelect={onCategorySelect}
            selectedCategory={selectedCategory}
            showIcons={!isSticky}
          />
        )}
      </View>
    );

    return { staticHeader, stickyHeader, handleTabPress };
  };

  // Render shopping tab content
  const renderShoppingContent = () => {
    const { staticHeader, stickyHeader } = createHeaders();

    if (selectedCategory === 'For You') {
      return <ForYouSection staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Fashion') {
      return <FashionPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Mobiles') {
      return <MobilesPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Beauty') {
      return <BeautyPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Electronics') {
      return <ElectronicsPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Home') {
      return <HomeCategoryPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Appliances') {
      return <AppliancesPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Toys') {
      return <ToysPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Food & Health') {
      return <FoodAndHealthPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Auto Accessories') {
      return <AutoAccessoriesPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === '2 Wheelers') {
      return <TwoWheelersPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Sports') {
      return <SportsPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Books') {
      return <BooksPage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }
    if (selectedCategory === 'Furniture') {
      return <FurniturePage staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
    }

    return <CategoryDynamicSection categoryName={selectedCategory} staticHeader={staticHeader} renderStickyHeader={stickyHeader} />;
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: safeAreaColor }]}>
      <View style={{ height: insets.top, backgroundColor: safeAreaColor }}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={safeAreaColor} />
      </View>

      {/* Tab Content - All tabs are mounted, inactive ones are hidden */}
      <View style={styles.contentContainer}>
        {/* Shopping Tab */}
        <View style={[styles.tabContent, activeTab !== 'shopping' && styles.hiddenTab]}>
          {renderShoppingContent()}
        </View>

        {/* Businesses Tab */}
        <View style={[styles.tabContent, activeTab !== 'businesses' && styles.hiddenTab]}>
          <ServicesTab onTabPress={(id) => {
            if (id === 'influencers') {
              router.push('/influencers');
            } else {
              setActiveTab(id as TabType);
            }
          }} />
        </View>

        {/* Grocery Tab */}
        <View style={[styles.tabContent, activeTab !== 'grocery' && styles.hiddenTab]}>
          <GroceryScreen
            onTabPress={(id) => {
              if (id === 'influencers') {
                router.push('/influencers');
              } else {
                setActiveTab(id as TabType);
              }
            }}
            setStatusColor={setCustomColor}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hiddenTab: {
    opacity: 0,
    pointerEvents: 'none',
  },
});


