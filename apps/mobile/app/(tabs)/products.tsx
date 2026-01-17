import React from 'react';
import { View, StyleSheet } from 'react-native';
import CategoriesScreen from '../../src/components/homepage/categories/CategoriesScreen';

export default function ProductsTab() {
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
