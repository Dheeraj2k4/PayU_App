import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/home/HomeHeader';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import ProfileTabSwitcher, { ProfileTab } from '../../components/profile/ProfileTabSwitcher';
import ProfilePreview from '../../components/profile/ProfilePreview';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import FAB from '../../components/common/FAB';
import { Colors } from '../../constants/theme';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('preview');

  const handleUpdateDetails = (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    // TODO: implement update logic
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.flex}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header — shared with HomeScreen */}
            <HomeHeader notificationCount={2} />

            <View style={styles.divider} />

            {/* Avatar + name */}
            <ProfileAvatar name="Alex yu" />

            <View style={styles.body}>
              {/* Preview / Edit toggle */}
              <ProfileTabSwitcher active={activeTab} onChange={setActiveTab} />

              {/* Content */}
              {activeTab === 'preview' ? (
                <ProfilePreview
                  totalSpendings="$2000"
                  email="alex@gmail.com"
                  balance="$20000"
                />
              ) : (
                <ProfileEditForm
                  initialName="Alex yu"
                  initialEmail="alex@gmail.com"
                  onSubmit={handleUpdateDetails}
                />
              )}
            </View>
          </ScrollView>

          <FAB onPress={() => { /* TODO */ }} />
        </View>
      </KeyboardAvoidingView>
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
});
