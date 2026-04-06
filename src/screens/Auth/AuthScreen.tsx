import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AuthTabSwitcher, { AuthTab } from '../../components/auth/AuthTabSwitcher';
import AppLogo from '../../components/auth/AppLogo';
import SignInForm from '../../components/auth/SignInForm';
import SignUpForm from '../../components/auth/SignUpForm';
import { Colors } from '../../constants/theme';
import { Typography } from '../../constants/typography';
import { RootStackParamList } from '../../navigation/AppNavigator';

type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [activeTab, setActiveTab] = useState<AuthTab>('sign-in');

  const handleSignIn = (data: { email: string; password: string }) => {
    navigation.replace('Main');
  };

  const handleSignUp = (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <AppLogo />
            <Text style={styles.heroTitle}>Welcome to PayU</Text>
            <Text style={styles.heroSubtitle}>
              Send money globally with the real exchange rate
            </Text>
          </View>

          {/* Auth card */}
          <View style={styles.card}>
            {/* Card header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeading}>Get started</Text>
              <Text style={styles.cardSubheading}>
                Sign in to your account or create a new one
              </Text>
            </View>

            {/* Tab switcher */}
            <AuthTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Form — swaps based on active tab */}
            {activeTab === 'sign-in' ? (
              <SignInForm onSubmit={handleSignIn} />
            ) : (
              <SignUpForm onSubmit={handleSignUp} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 32,
  },

  // ── Hero ──────────────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    gap: 16,
  },
  heroTitle: {
    ...Typography.headingLarge,
    fontSize: 28,
    color: Colors.dark.textPrimary,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  // ── Card ──────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: 24,
    padding: 24,
    gap: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardHeader: {
    gap: 6,
  },
  cardHeading: {
    ...Typography.headingLarge,
    color: Colors.dark.textPrimary,
  },
  cardSubheading: {
    ...Typography.bodyMedium,
    color: Colors.dark.textSecondary,
  },
});
