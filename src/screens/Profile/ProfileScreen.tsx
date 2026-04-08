import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import HomeHeader from '../../components/home/HomeHeader';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import ProfileTabSwitcher, { ProfileTab } from '../../components/profile/ProfileTabSwitcher';
import ProfilePreview from '../../components/profile/ProfilePreview';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import FAB from '../../components/common/FAB';
import AddTransactionSheet, { AddTransactionSheetRef } from '../../components/home/AddTransactionSheet';
import { useUserContext } from '../../store';
import { useTransactionContext } from '../../store';
import { formatCurrency } from '../../utils/currency';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

export default function ProfileScreen() {
  const sheetRef = useRef<AddTransactionSheetRef>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, updateProfile } = useUserContext();
  const { transactions } = useTransactionContext();
  const { colors, isDark, setMode } = useTheme();
  const [activeTab, setActiveTab] = useState<ProfileTab>('preview');
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  // Keep local display state in sync when profile loads from AsyncStorage
  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
  }, [profile.name, profile.email]);

  const totalExpenses = transactions.reduce(
    (sum, tx) => (tx.type === 'expense' ? sum + tx.amount : sum), 0,
  );
  const totalIncome = transactions.reduce(
    (sum, tx) => (tx.type === 'income' ? sum + tx.amount : sum), 0,
  );
  const balance = totalIncome - totalExpenses;

  const notificationCount = useMemo(
    () => transactions.filter((tx) => tx.isRecurring && tx.type === 'expense').length,
    [transactions],
  );

  const contentOpacity = useSharedValue(1);
  const contentAnimStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  // Fade back in whenever the active tab changes
  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 200 });
  }, [activeTab]);

  const handleTabChange = (tab: ProfileTab) => {
    contentOpacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(setActiveTab)(tab);
    });
  };

  const handleUpdateDetails = (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (data.fullName.trim()) setName(data.fullName.trim());
    if (data.email.trim()) setEmail(data.email.trim());
    updateProfile({
      name: data.fullName.trim() || name,
      email: data.email.trim() || email,
    });
    // Animate back to preview tab after saving
    contentOpacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(setActiveTab)('preview');
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
          >
            {/* Header — shared with HomeScreen */}
            <HomeHeader
              notificationCount={notificationCount}
              onSearchPress={() => navigation.navigate('Search')}
              onNotificationPress={() => navigation.navigate('Notifications')}
            />

            {/* Avatar + name */}
            <ProfileAvatar name={name} />

            <View style={styles.body}>
              {/* Preview / Edit toggle */}
              <ProfileTabSwitcher active={activeTab} onChange={handleTabChange} />

              {/* Content — fades on tab switch */}
              <Animated.View style={contentAnimStyle}>
                {activeTab === 'preview' ? (
                  <ProfilePreview
                    totalSpendings={formatCurrency(totalExpenses)}
                    email={email}
                    balance={formatCurrency(balance)}
                  />
                ) : (
                  <ProfileEditForm
                    initialName={name}
                    initialEmail={email}
                    onSubmit={handleUpdateDetails}
                  />
                )}
              </Animated.View>

              {activeTab === 'preview' && (
                <>
                  <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>Appearance</Text>
                    <View style={styles.themeRow}>
                      <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
                      <Switch
                        value={isDark}
                        onValueChange={(val) => setMode(val ? 'dark' : 'light')}
                        trackColor={{ false: colors.surfaceElevated, true: Colors.teal }}
                        thumbColor={colors.background}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.logoutBtn, { backgroundColor: colors.surface }]}
                    onPress={() =>
                      navigation.reset({ index: 0, routes: [{ name: 'Auth' }] })
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.logoutText}>Log Out</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <FAB onPress={() => sheetRef.current?.open()} />
        <AddTransactionSheet ref={sheetRef} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 20,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 20,
  },
  settingsCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  themeLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
  },
  logoutBtn: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.error,
  },
});
