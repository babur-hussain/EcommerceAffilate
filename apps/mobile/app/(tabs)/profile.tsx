import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useData } from '../../src/hooks/useData';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import api from '../../src/lib/api';
import { useTranslation } from 'react-i18next';
import '../../src/i18n/i18n'; // Ensure init

interface LayoutItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any; // Ionicons name
  actionUrl: string;
  isNew?: boolean;
}

interface LayoutSection {
  id: string;
  title: string;
  type?: 'horizontal_list' | 'list';
  items: LayoutItem[];
}

interface AccountLayout {
  sections: LayoutSection[];
}

export default function ProfileScreen() {
  const { user, signOut, refreshUser } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  // Use smart caching hook
  const { data: layout, refetch: refetchLayout, isRefetching, error: layoutError } = useData<AccountLayout>('/api/me/account-layout');

  const onRefresh = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Promise.all([refreshUser(), refetchLayout()]);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };



  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <MaterialIcons name="account-circle" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>{t('profile.not_signed_in')}</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>{t('profile.sign_in')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderSection = (section: LayoutSection) => {
    if (section.items.length === 0) return null;

    return (
      <View key={section.id} style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t(`profile.${section.id}`, section.title)}</Text>
        {section.items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.sectionItem, index === section.items.length - 1 && styles.lastSectionItem]}
            onPress={() => {
              if (item.actionUrl) {
                router.push(item.actionUrl as any);
              }
            }}
          >
            <View style={styles.itemIconContainer}>
              <Ionicons name={item.icon} size={24} color="#2874F0" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{t(`profile.${item.id}`, item.title)}</Text>
              {item.subtitle && (
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              )}
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#2874F0" />}
      >

        {/* Header Section */}
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.userName}>{user.email}</Text>
              <TouchableOpacity style={styles.membershipRow}>
                <Text style={styles.membershipText}>
                  {t('profile.explore')} <Text style={{ fontWeight: '800', fontStyle: 'italic' }}>{(user as any).membershipStatus || 'Plus'}</Text>
                </Text>
                <MaterialIcons name="chevron-right" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.coinPill} onPress={() => router.push('/wallet')}>
              <View style={styles.coinIconWrapper}>
                <Ionicons name="flash" size={12} color="#F59E0B" />
              </View>
              <Text style={styles.coinText}>{(user as any).coins || 0}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Quick Links Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/orders')}>
              <Ionicons name="cube-outline" size={24} color="#2874F0" />
              <Text style={styles.gridLabel}>{t('profile.orders')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/wishlist')}>

              <Ionicons name="heart-outline" size={24} color="#2874F0" />
              <Text style={styles.gridLabel}>{t('profile.wishlist')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/wallet')}>
              <Ionicons name="wallet-outline" size={24} color="#2874F0" />
              <Text style={styles.gridLabel}>{t('profile.wallet')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem}>
              <Ionicons name="headset-outline" size={24} color="#2874F0" />
              <Text style={styles.gridLabel}>{t('profile.help_center')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Sections */}
        {layoutError && (
          <View style={{ padding: 16, backgroundColor: '#FEF2F2' }}>
            <Text style={{ color: '#EF4444' }}>
              Failed to update profile. Pull to refresh again. ({layoutError.message})
            </Text>
          </View>
        )}
        {layout?.sections.map(renderSection)}

        <View style={{ height: 20 }} />

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#F0F5FF',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membershipText: {
    fontSize: 14,
    color: '#4B5563',
    marginRight: 2,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  coinIconWrapper: {
    marginRight: 4,
  },
  coinText: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 14,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16, // Adjusted for even spacing
    borderRadius: 8,
    width: '48%', // Ensure 2 items fit
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center', // Center content slightly
    gap: 8,
  },
  gridLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastSectionItem: {
    borderBottomWidth: 0,
  },
  itemIconContainer: {
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  signOutButton: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  signOutText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    // No background or border, just text
  },
  deleteText: {
    color: '#EF4444', // Red
    fontWeight: '600',
    fontSize: 14,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#2874F0',
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
