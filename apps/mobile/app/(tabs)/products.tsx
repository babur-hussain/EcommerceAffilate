import { ScrollView, View, StyleSheet } from 'react-native';
import CategoriesScreen from '../../src/components/homepage/categories/CategoriesScreen';
import { usePageLayout } from '../../src/hooks/usePageLayout';
import SectionRenderer from '../../src/components/homepage/SectionRenderer';
import { useAuth } from '../../src/context/AuthContext';

export default function ProductsTab() {
  const { layout, loading } = usePageLayout('category');
  const { user } = useAuth();

  // If a custom layout is defined in Admin, use it.
  if (layout && layout.sections && layout.sections.length > 0) {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {layout.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} user={user} />
          ))}
        </ScrollView>
      </View>
    );
  }

  // Otherwise (or while loading), show standard Categories screen
  return (
    <View style={styles.container}>
      <CategoriesScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
