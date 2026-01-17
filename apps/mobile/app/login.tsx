import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      // Dismiss modal if presentation is modal
      if (router.canDismiss()) {
        router.dismiss();
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>EcommerceEarn</Text>
          {/* Or use an Image here if available locally */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Log in for the best experience</Text>
          <Text style={styles.subtitle}>Enter your details to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 8 }}>
                <Text style={{ color: '#2874F0', fontWeight: '600', fontSize: 13 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to our <Text style={styles.linkText}>Terms of Use</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>

          <TouchableOpacity
            style={[styles.continueButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.continueButtonText}>
              {loading ? 'Verifying...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/signup')} style={{ marginTop: 20, alignSelf: 'center' }}>
            <Text style={{ color: '#2874F0', fontWeight: '600' }}>New here? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2874F0', // Blue background for header area
  },
  header: {
    backgroundColor: '#2874F0',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 4,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 28, // Balance the close button
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    fontStyle: 'italic'
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingTop: 32,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#2874F0',
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingRight: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 18,
  },
  linkText: {
    color: '#2874F0',
  },
  continueButton: {
    backgroundColor: '#FB641B', // Flipkart Orange
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#FFB895',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
